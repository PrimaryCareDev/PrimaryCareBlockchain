import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import {MyRequest} from "../app";
import express from "express"
import prisma from "../prisma-client";
import {celebrate, Joi, Segments} from "celebrate";
import {RelationshipStatus, Role} from "@prisma/client";
import axios from "axios";

const doctorRouter = express.Router()

doctorRouter.get('/getPatientRelationships', async (req: MyRequest, res) => {
    const user = req.currentUser!

    const patientList = await prisma.patient.findMany({
        where: {
            doctors: {
                some: {
                    doctorUid: user.uid
                }
            }
        },
        select: {
            user: true,
            doctors: {
                where: {
                    doctorUid: user.uid
                }
            }
        }
    })

    res.json(patientList)
})

doctorRouter.get('/getPatientRelationship',
    celebrate({
        [Segments.QUERY]: {
            patientUid: Joi.string().required()
        }
    }),
    async (req: MyRequest, res) => {

        const user = req.currentUser!
        const {patientUid} = req.query
        const currentRelationship = await prisma.doctorOnPatient.findUnique({
            where: {
                doctorUid_patientUid: {
                    doctorUid: user.uid,
                    patientUid: patientUid as string
                }
            }
        })

        res.json(currentRelationship)

    }
)

doctorRouter.post('/requestPatient',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            patientUid: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {

        const user = req.currentUser!
        const {patientUid} = req.body

        const roles = await prisma.userRoles.findMany({
            where: {
                uid: patientUid
            }
        })

        const validRole = roles.filter(function (item) {
            return item.role === "PATIENT"
        })

        if (validRole.length == 0) {
            console.log("Provided uid is not a patient: " + patientUid)
            return res.status(400).send('Something went wrong. Please refresh the page and try again.')
        }

        const currentRelationship = await prisma.doctorOnPatient.findUnique({
            where: {
                doctorUid_patientUid: {
                    doctorUid: user.uid,
                    patientUid: patientUid
                }
            }
        })

        if (currentRelationship?.status == RelationshipStatus.ACCEPTED) {
            return res.status(400).send("You already have access to this patient's data.")
        }

        const result = await prisma.doctorOnPatient.upsert({
            where: {
                doctorUid_patientUid: {
                    doctorUid: user.uid,
                    patientUid: patientUid
                }
            },
            update: {
                requester: Role.DOCTOR,
                requestedTimestamp: new Date(),
                status: RelationshipStatus.REQUESTED
            },
            create: {
                doctorUid: user.uid,
                patientUid: patientUid,
                requester: Role.DOCTOR,
                status: RelationshipStatus.REQUESTED
            }
        })

        res.status(200).send()

    }
)

doctorRouter.post('/removePatient',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            patientUid: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {
        const user = req.currentUser!
        const {patientUid} = req.body

        try {
            await prisma.doctorOnPatient.update({
                where: {
                    doctorUid_patientUid: {
                        doctorUid: user.uid,
                        patientUid: patientUid
                    }
                },
                data: {
                    deleter: Role.DOCTOR,
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

doctorRouter.post('/acceptPatient',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            patientUid: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {
        const user = req.currentUser!
        const {patientUid} = req.body

        try {
            const record = await prisma.doctorOnPatient.findUnique({
                where: {
                    doctorUid_patientUid: {
                        doctorUid: user.uid,
                        patientUid: patientUid,
                    }
                }
            })

            if (record === null || (record.status != RelationshipStatus.REQUESTED && record.requester != Role.PATIENT)) {
                res.status(400).send("Could not find pre-existing invitation from patient")
            }

            await prisma.doctorOnPatient.update({
                where: {
                    doctorUid_patientUid: {
                        doctorUid: user.uid,
                        patientUid: patientUid,
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
                    return res.status(400).send("Could not find pre-existing connection with patient.")
                }
            } else if (e instanceof Error) {
                console.log(e.message)
            }

            return res.status(500).send("Something went wrong. Please try again.")
        }

        res.status(200).send()
    }
)

doctorRouter.post('/rejectPatient',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            patientUid: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {
        const user = req.currentUser!
        const {patientUid} = req.body

        try {
            const record = await prisma.doctorOnPatient.findUnique({
                where: {
                    doctorUid_patientUid: {
                        doctorUid: user.uid,
                        patientUid: patientUid,
                    }
                }
            })

            if (record === null || (record.status != RelationshipStatus.REQUESTED && record.requester != Role.PATIENT)) {
                res.status(400).send("Could not find pre-existing invitation from patient")
            }

            await prisma.doctorOnPatient.update({
                where: {
                    doctorUid_patientUid: {
                        doctorUid: user.uid,
                        patientUid: patientUid,
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
                    return res.status(400).send("Could not find valid pre-existing connection with patient.")
                }
            } else if (e instanceof Error) {
                console.log(e.message)
            }

            return res.status(500).send("Something went wrong. Please try again.")
        }

        res.status(200).send()
    }
)

doctorRouter.post('/cancelPatientRequest',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            patientUid: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {
        const user = req.currentUser!
        const {patientUid} = req.body

        try {
            const record = await prisma.doctorOnPatient.findUnique({
                where: {
                    doctorUid_patientUid: {
                        doctorUid: user.uid,
                        patientUid: patientUid,
                    }
                }
            })

            if (record === null || (record.status != RelationshipStatus.REQUESTED && record.requester != Role.DOCTOR)) {
                res.status(400).send("Could not find valid pre-existing request")
            }

            await prisma.doctorOnPatient.delete({
                where: {
                    doctorUid_patientUid: {
                        doctorUid: user.uid,
                        patientUid: patientUid,
                    }
                }
            })
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                console.log("Prisma error code: " + e.code)
                if (e.code === 'P2025') {
                    return res.status(400).send("Could not find pre-existing connection with patient.")
                }
            } else if (e instanceof Error) {
                console.log(e.message)
            }

            return res.status(500).send("Something went wrong. Please try again.")
        }

        res.status(200).send()
    }
)

doctorRouter.post('/searchPatients',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            query: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {

        const user = req.currentUser!
        const {query} = req.body

        const foundPatient = await prisma.patient.findFirst({
            where: {user: {email: query}},
            include: {
                user: true
            }

        })
        if (foundPatient === null) {
            return res.status(400).send("Could not find any patient who uses that email address. Please try a new query.")
        }

        res.json(foundPatient)
    }
)

doctorRouter.get('/getPatients', async (req: MyRequest, res) => {
    const user = req.currentUser!

    const patientList = await prisma.patient.findMany({
        where: {
            doctors: {
                some: {
                    doctorUid: user.uid,
                    status: RelationshipStatus.ACCEPTED
                }
            }
        },
        include: {
            user: true,
            doctors: {
                where: {
                    doctorUid: user.uid
                }
            }
        }
    })

    res.json(patientList)
})

doctorRouter.get('/viewPatientDetails',
    celebrate({
        [Segments.QUERY]: Joi.object().keys({
            patientUid: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {

        const user = req.currentUser!
        const {patientUid} = req.query


        const requestedPatient = await prisma.patient.findUnique({
            where: {
                uid: patientUid as string
            },
            include: {
                user: true,
                doctors: {
                    where: {
                        doctorUid: user.uid
                    }
                }
            }
        })

        if (requestedPatient === null) {
            return res.status(400).send("Could not find patient with that id.")
        }

        let hasAccess = false

        for (let i = 0; i < requestedPatient.doctors.length; i++) {
            if (requestedPatient.doctors[i].doctorUid === user.uid && requestedPatient.doctors[i].status === RelationshipStatus.ACCEPTED) {
                hasAccess = true
                break
            }
        }
        if (!hasAccess) {
            return res.status(200).send({...requestedPatient, hasAccess: false})
        } else {
            return res.status(200).send({...requestedPatient, hasAccess: true})

        }
    }
)

doctorRouter.get('/getIcdToken',
    async (req: MyRequest, res) => {

        const scope = "icdapi_access";
        const grant_type = "client_credentials";

        const icdRes = await axios.post("https://icdaccessmanagement.who.int/connect/token",
            `grant_type=${grant_type}&scope=${scope}`
            ,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${btoa(`${process.env.ICD_CLIENT_ID}:${process.env.ICD_CLIENT_SECRET}`)}`
                }
            })

        res.json(icdRes.data)

    }
)

doctorRouter.post('/createMemo',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            patientUid: Joi.string().required(),
            diagnoses: Joi.array().items(
                Joi.object().keys({
                    code: Joi.string().required(),
                    title: Joi.string().required()
                })),
            prescriptions: Joi.array().items(
                Joi.object().keys({
                    drugName: Joi.string().required(),
                    dosage: Joi.string().required(),
                    unitsPerDose: Joi.string().required(),
                    totalUnits: Joi.string().required(),
                    frequency: Joi.string().required(),
                })),
            description: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {

        const user = req.currentUser!
        const {patientUid, diagnoses, description, prescriptions} = req.body

        const test = await prisma.memo.create({
            data: {
                doctorUid: user.uid,
                patientUid: patientUid,
                description: description,
                diagnoses: {
                    create: [
                        ...diagnoses
                    ]
                },
                prescriptions: {
                    create: [
                        ...prescriptions
                    ]
                }
            }
        })

        return res.status(200).send()
    }
)

doctorRouter.get('/getAllMemos', celebrate({
        [Segments.QUERY]: {
            patientUid: Joi.string().required(),
            pageNum: Joi.number().integer().required(),
            perPage: Joi.number().integer().required(),

        }
    }),
    async (req: MyRequest, res) => {


        const pageNum = parseInt(<string>req.query.pageNum)
        const perPage = parseInt(<string>req.query.perPage)
        const patientUid = req.query.patientUid
        const user = req.currentUser!

        const currentRelationship = await prisma.doctorOnPatient.findUnique({
            where: {
                doctorUid_patientUid: {
                    doctorUid: user.uid,
                    patientUid: patientUid as string
                }
            }
        })

        if (currentRelationship == null || currentRelationship?.status != RelationshipStatus.ACCEPTED) {
            return res.status(400).send("You do not have access to this patient's data.")
        }

        const results = await prisma.memo.findMany({
            skip: (pageNum - 1) * perPage,
            take: perPage,
            where: {
                patientUid: patientUid as string,
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                doctor: {
                    select: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                },
                diagnoses: true,
                createdAt: true
            }
        })

        const totalCount = await prisma.memo.count({
            where: {
                patientUid: patientUid as string,
            }
        })

        return res.json({totalCount, results})
    }
)

doctorRouter.get('/getMemo', celebrate({
        [Segments.QUERY]: {
            memoId: Joi.number().required(),
        }
    }),
    async (req: MyRequest, res) => {
        const user = req.currentUser!
        const memoId = parseInt(<string>req.query.memoId)


        const foundMemo = await prisma.memo.findUnique({
            where: {
                id: memoId
            },
            include: {
                doctor: {
                    select: {
                        user: true
                    }
                },
                diagnoses: true,
                prescriptions: true
            }
        })

        if (foundMemo === null) {
            return res.status(400).send("Memo id not found.")
        }

        const currentRelationship = await prisma.doctorOnPatient.findUnique({
            where: {
                doctorUid_patientUid: {
                    doctorUid: user.uid,
                    patientUid: foundMemo.patientUid
                }
            }
        })

        if (currentRelationship == null || currentRelationship?.status != RelationshipStatus.ACCEPTED) {
            return res.status(401).send("You do not have access to this patient's data.")
        }

        const hasEditAccess = foundMemo.doctorUid === user.uid

        return res.json({hasEditAccess, ...foundMemo})
    }
)

doctorRouter.post('/editMemo',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            id: Joi.number().required(),
            diagnoses: Joi.array().items(
                Joi.object().keys({
                    code: Joi.string().required(),
                    title: Joi.string().required()
                })),
            prescriptions: Joi.array().items(
                Joi.object().keys({
                    drugName: Joi.string().required(),
                    dosage: Joi.string().required(),
                    unitsPerDose: Joi.string().required(),
                    totalUnits: Joi.string().required(),
                    frequency: Joi.string().required(),
                })),
            description: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {

        const user = req.currentUser!
        const {id, diagnoses, description, prescriptions} = req.body

        const foundMemo = await prisma.memo.findUnique({
            where: {
                id: id
            }
        })

        if (foundMemo === null) {
            return res.status(400).send("Memo id not found.")
        }

        if (foundMemo.doctorUid !== user.uid) {
            return res.status(401).send("You do not have permissions to edit this memo.")
        }


        await prisma.$transaction([

            prisma.diagnosis.deleteMany({
                where: {
                    memoId: id
                }
            }),

            prisma.prescription.deleteMany({
                where: {
                    memoId: id
                }
            }),

            prisma.memo.update({
                where: {
                    id: id
                },
                data: {
                    description: description,
                    updatedAt: new Date(),
                    diagnoses: {
                        create: [
                            ...diagnoses
                        ]
                    },
                    prescriptions: {
                        create: [
                            ...prescriptions
                        ]
                    }
                }
            })
        ])

        return res.status(200).send()
    }
)


export default doctorRouter