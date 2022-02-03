import {celebrate, Joi, Segments} from "celebrate";
import prisma from "../prisma-client";
import {RelationshipStatus, Role, Doctor} from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import {MyRequest, stripe} from "../app";
import express from "express";
import {DateTime} from "luxon";
import doctor from "./doctor";

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
        const query:string = req.query.query as string

        //This query searches across firstName, lastName, email, medical practice, whether they contain query str
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
                uid: true,
                medicalPractice: true,
                user: true,
                patients: {
                    where: {
                        patientUid: user.uid
                    }
                }
            },

        })


        //This next section searches for full name by concatenating firstName and lastName
        //this query raw unsafe and the next prisma.findMany could be combined into a singular custom SQL for better perf
        const result = await prisma.$queryRawUnsafe<Doctor[]>(
            `SELECT d.uid FROM "doctor" d INNER JOIN "user" u on d.uid = u.uid WHERE CONCAT(u."firstName",' ',u."lastName") ILIKE CONCAT('%',$1::text,'%');`,
            query
        )
        const flattened = result.map((v) => v.uid)

        const nameList = await prisma.doctor.findMany({
            where: {
                uid: {in: flattened},
                verified: true
            },
            select: {
                uid: true,
                medicalPractice: true,
                user: true,
                patients: {
                    where: {
                        patientUid: user.uid
                    }
                }
            },
        })

        const nameListIds = new Set(nameList.map(d => d.uid));
        const merged = [...nameList, ...doctorList.filter(d => !nameListIds.has(d.uid))];

        return res.json(merged)
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
                return res.status(400).send("Could not find pre-existing request")
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

        return res.status(200).send()
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
                return res.status(400).send("Could not find pre-existing request")
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
                return res.status(400).send("Could not find valid pre-existing request")
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

        return res.status(200).send()
    }
)

patientRouter.post('/verifyPatient',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            firstName: Joi.string().allow(""),
            lastName: Joi.string().allow(""),
            sex: Joi.string().required(),
            birthDate: Joi.string().required(),
            avatarImageUrl: Joi.string().allow(""),
        })
    }),
    async (req: MyRequest, res) => {
        const user = req.currentUser!

        console.log("Verifying patient")

        const birthDate = DateTime.fromSQL(req.body.birthDate)

        if (!birthDate.isValid) {
            return res.status(400).send("Invalid date");
        }

        try {
            await prisma.$transaction([
                prisma.user.update({
                    where: {
                        uid: user.uid
                    },
                    data: {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        avatarImageUrl: req.body.avatarImageUrl
                    }
                }),
                prisma.patient.update({
                    where: {
                        uid: user.uid
                    },
                    data: {
                        birthDate: birthDate.toJSDate(),
                        sex: req.body.sex,
                        verified: true
                    }
                })
            ])
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

        return res.status(200).send('Patient verification submitted for ' + user.email);


    }
)

patientRouter.get('/getAllMemos', celebrate({
        [Segments.QUERY]: {
            pageNum: Joi.number().integer().required(),
            perPage: Joi.number().integer().required(),
        }
    }),
    async (req: MyRequest, res) => {


        const pageNum = parseInt(<string>req.query.pageNum)
        const perPage = parseInt(<string>req.query.perPage)
        const user = req.currentUser!

        const results = await prisma.memo.findMany({
            skip: (pageNum - 1) * perPage,
            take: perPage,
            where: {
                patientUid: user.uid
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
                createdAt: true,
                patientHasAccess: true
            }
        })

        const totalCount = await prisma.memo.count({
            where: {
                patientUid: user.uid,
            }
        })

        return res.json({totalCount, results})
    }
)

patientRouter.get('/getMemo', celebrate({
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
                patient: true,
                diagnoses: true,
                prescriptions: true
            }
        })

        if (foundMemo === null) {
            return res.status(400).send("Memo id not found.")
        }

        if (foundMemo.patient.uid !== user.uid) {
            return res.status(401).send("You do not have access to this memo.")
        }

        if (!foundMemo.patientHasAccess) {
            return res.status(401).send("You have not purchased this memo and do not have access to it.")
        }

        return res.json(foundMemo)
    }
)

patientRouter.post('/purchaseMemo',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            memoId: Joi.number().required()
        })
    }),
    async (req: MyRequest, res) => {

        const {memoId} = req.body
        const domainUrl = process.env.DOMAIN
        const user = req.currentUser!

        const userRecord = await prisma.user.findUnique({
            where: {
                uid: user.uid
            }
        })

        if (userRecord === null) {
            return res.status(400).send("User id not found")
        }

        const memoRecord = await prisma.memo.findUnique({
            where: {
                id: memoId
            },
            include: {
                doctor: {
                    include: {
                        user: true
                    }
                }
            }
        })

        if (memoRecord === null) {
            return res.status(400).send("Memo id not found")
        }

        const doctorName = memoRecord.doctor.user.firstName + " " + memoRecord.doctor.user.lastName
        const formattedDate = DateTime.fromJSDate(memoRecord.createdAt).toLocaleString(DateTime.DATETIME_MED)

        let customerId = userRecord.stripeCustomerId

        if (customerId === null) {
            let formattedName = ""

            if (!userRecord.firstName && !userRecord.lastName) {
                formattedName = ""
            }
            else if (!userRecord.firstName && userRecord.lastName) {
                formattedName = userRecord.lastName
            }
            else if (!userRecord.lastName && userRecord.firstName) {
                formattedName = userRecord.firstName
            } else {
                formattedName = userRecord.firstName + " " + userRecord.lastName
            }

            const createdCustomer = await stripe.customers.create({
                email: userRecord.email,
                name: formattedName
            })

            await prisma.user.update({
                where: {
                    uid: user.uid
                },
                data: {
                    stripeCustomerId: createdCustomer.id
                }
            })

            customerId = createdCustomer.id

        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Memo written by ${doctorName} on ${formattedDate}`,
                        },
                        unit_amount: 500,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${domainUrl}/patient/memos/${memoId}?purchased=true`,
            cancel_url: `${domainUrl}/patient/memos`,
            customer: customerId,
            client_reference_id: memoId
        });

        return res.json({url: session.url})
    });

export default patientRouter