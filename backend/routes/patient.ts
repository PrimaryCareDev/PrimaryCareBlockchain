import {celebrate, Joi, Segments} from "celebrate";
import prisma from "../prisma-client";
import {RelationshipStatus, Role} from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import {MyRequest} from "../app";
import express from "express";

const patientRouter = express.Router()

patientRouter.get('/getDoctors',
    celebrate({
        [Segments.QUERY]: {
            requestedStatus: Joi.string().required(),
            requesterRole: Joi.string().required()
        }
    }),
    async (req: MyRequest, res) => {

        const user = req.currentUser!
        const {requesterRole, requestedStatus} = req.query
        const doctors = await prisma.doctorOnPatient.findMany({
            where: {
                patientUid: user.uid,
                status: requestedStatus as RelationshipStatus,
                requester: requesterRole as Role
            },
            include: {
                doctor: {
                    include: {
                        user: true
                    }
                }
            }
        })

        res.json(doctors)

    }
)

patientRouter.get('/searchDoctors',
    celebrate({
        [Segments.QUERY]: {
            query: Joi.string().required()
        }
    }),
    async (req: MyRequest, res) => {

        const user = req.currentUser!
        const {query} = req.body

        const doctorList = await prisma.doctor.findMany({
            where: {
                OR: [
                    {user: {firstName: {contains: query, mode: 'insensitive'}}},
                    {user: {lastName: {contains: query, mode: 'insensitive'}}},
                    {user: {email: {contains: query, mode: 'insensitive'}}},
                    {medicalPractice: {contains: query, mode: 'insensitive'}}
                ],
                //Comment this line out for testing searching
                verified: true
            },
            select: {
                medicalPractice: true,
                user: true,

                patients: {
                    where: {
                        patientUid: user.uid
                    }
                }
            },

        })
        if (doctorList.length === 0) {
            return res.status(400).send("Could not find any matching Doctor. Please try a new search query.")
        }

        res.json(doctorList)
    }
)

patientRouter.post('/inviteDoctor',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            doctorUid: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {

        const user = req.currentUser!
        const {doctorUid} = req.body

        const roles = await prisma.userRoles.findMany({
            where: {
                uid: doctorUid
            }
        })

        const validRole = roles.filter(function (item) {
            return item.role === "DOCTOR"
        })

        if (validRole.length == 0) {
            console.log("Provided uid is not a doctor: " + doctorUid)
            return res.status(400).send('Something went wrong. Please refresh the page and try again.')
        }

        const currentRelationship = await prisma.doctorOnPatient.findUnique({
            where: {
                doctorUid_patientUid: {
                    doctorUid: doctorUid,
                    patientUid: user.uid
                }
            }
        })

        if (currentRelationship?.status == RelationshipStatus.ACCEPTED) {
            return res.status(400).send('This doctor already has access to your data.')
        }

        const result = await prisma.doctorOnPatient.upsert({
            where: {
                doctorUid_patientUid: {
                    doctorUid: doctorUid,
                    patientUid: user.uid
                }
            },
            update: {
                requester: Role.PATIENT,
                requestedTimestamp: new Date(),
                status: RelationshipStatus.REQUESTED
            },
            create: {
                doctorUid: doctorUid,
                patientUid: user.uid,
                requester: Role.PATIENT,
                status: RelationshipStatus.REQUESTED
            }
        })

        res.status(200).send()

    }
)

patientRouter.get('/getDoctorRelationship',
    celebrate({
        [Segments.QUERY]: {
            doctorUid: Joi.string().required()
        }
    }),
    async (req: MyRequest, res) => {

        const user = req.currentUser!
        const {doctorUid} = req.query
        const currentRelationship = await prisma.doctorOnPatient.findUnique({
            where: {
                doctorUid_patientUid: {
                    doctorUid: doctorUid as string,
                    patientUid: user.uid
                }
            }
        })

        res.json(currentRelationship)

    }
)

patientRouter.get('/getAllDoctorRelationships', async (req: MyRequest, res) => {

    const user = req.currentUser!

    const doctorList = await prisma.doctor.findMany({
        where: {
            patients: {
                some: {
                    patientUid: user.uid
                }
            }
        },
        select: {
            medicalPractice: true,
            user: true,
            patients: {
                where: {
                    patientUid: user.uid
                }
            }
        }
    })

    res.json(doctorList)
})

patientRouter.post('/deleteDoctor',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            doctorUid: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {
        const user = req.currentUser!
        const {doctorUid} = req.body

        try {
            await prisma.doctorOnPatient.update({
                where: {
                    doctorUid_patientUid: {
                        doctorUid: doctorUid,
                        patientUid: user.uid
                    }
                },
                data: {
                    deleter: Role.PATIENT,
                    deleteTimestamp: new Date(),
                    status: RelationshipStatus.DELETED
                }
            })
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                console.log("Prisma error code: " + e.code)
                // if (e.code==='P2025') {
                //     return res.status(400).send("Could not find pre-existing connection with doctor.")
                // }
            } else if (e instanceof Error) {
                console.log(e.message)
            }

            return res.status(500).send("Something went wrong. Please try again.")
        }

        return res.status(200).send()
    }
)

patientRouter.post('/acceptDoctor',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            doctorUid: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {
        const user = req.currentUser!
        const {doctorUid} = req.body

        try {
            const record = await prisma.doctorOnPatient.findUnique({
                where: {
                    doctorUid_patientUid: {
                        doctorUid: doctorUid,
                        patientUid: user.uid,
                    }
                }
            })

            if (record === null || (record.status != RelationshipStatus.REQUESTED && record.requester != Role.DOCTOR)) {
                res.status(400).send("Could not find pre-existing request")
            }

            await prisma.doctorOnPatient.update({
                where: {
                    doctorUid_patientUid: {
                        doctorUid: doctorUid,
                        patientUid: user.uid,
                    }
                },
                data: {
                    acceptedTimestamp: new Date(),
                    status: RelationshipStatus.ACCEPTED
                }
            })
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                console.log("Prisma error code: " + e.code)
                if (e.code === 'P2025') {
                    return res.status(400).send("Could not find pre-existing connection with doctor.")
                }
            } else if (e instanceof Error) {
                console.log(e.message)
            }

            return res.status(500).send("Something went wrong. Please try again.")
        }

        res.status(200).send()
    }
)

patientRouter.post('/rejectDoctor',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            doctorUid: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {
        const user = req.currentUser!
        const {doctorUid} = req.body

        try {
            const record = await prisma.doctorOnPatient.findUnique({
                where: {
                    doctorUid_patientUid: {
                        doctorUid: doctorUid,
                        patientUid: user.uid,
                    }
                }
            })

            if (record === null || (record.status != RelationshipStatus.REQUESTED && record.requester != Role.DOCTOR)) {
                res.status(400).send("Could not find pre-existing request")
            }

            await prisma.doctorOnPatient.update({
                where: {
                    doctorUid_patientUid: {
                        doctorUid: doctorUid,
                        patientUid: user.uid,
                    }
                },
                data: {
                    rejectedTimestamp: new Date(),
                    status: RelationshipStatus.REJECTED
                }
            })
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                console.log("Prisma error code: " + e.code)
                if (e.code === 'P2025') {
                    return res.status(400).send("Could not find valid pre-existing connection with doctor.")
                }
            } else if (e instanceof Error) {
                console.log(e.message)
            }

            return res.status(500).send("Something went wrong. Please try again.")
        }

        res.status(200).send()
    }
)

patientRouter.post('/cancelDoctorInvitation',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            doctorUid: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {
        const user = req.currentUser!
        const {doctorUid} = req.body

        try {
            const record = await prisma.doctorOnPatient.findUnique({
                where: {
                    doctorUid_patientUid: {
                        doctorUid: doctorUid,
                        patientUid: user.uid,
                    }
                }
            })

            if (record === null || (record.status != RelationshipStatus.REQUESTED && record.requester != Role.PATIENT)) {
                res.status(400).send("Could not find valid pre-existing request")
            }

            await prisma.doctorOnPatient.delete({
                where: {
                    doctorUid_patientUid: {
                        doctorUid: doctorUid,
                        patientUid: user.uid,
                    }
                }
            })
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                console.log("Prisma error code: " + e.code)
                if (e.code === 'P2025') {
                    return res.status(400).send("Could not find pre-existing connection with doctor.")
                }
            } else if (e instanceof Error) {
                console.log(e.message)
            }

            return res.status(500).send("Something went wrong. Please try again.")
        }

        res.status(200).send()
    }
)

export default patientRouter