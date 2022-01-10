import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import {MyRequest} from "../app";
import express from "express"
import prisma from "../prisma-client";
import {celebrate, Joi, Segments} from "celebrate";

const baseRouter = express.Router()

baseRouter.get('/verifyIdToken', async (req: MyRequest, res) => {

    console.log("Returning Verification")
    const user = req.currentUser

    res.json(req.currentUser)

})

baseRouter.post('/registerDoctor', async (req: MyRequest, res) => {

    const user = req.currentUser!
    console.log("Trying to create Doctor record for " + user.email)

    try {

        await prisma.$transaction([
            prisma.user.create({
                data: {
                    uid: user.uid,
                    email: user.email!
                }
            }),
            prisma.doctor.create({
                data: {
                    uid: user.uid

                }
            }),
            prisma.userRoles.create({
                data: {
                    uid: user!.uid,
                    role: 'DOCTOR'
                }
            })
        ])

        res.status(200).send('Doctor record created for ' + user.email);

    } catch (e) {
        console.log("Error creating doctor record")
        if (e instanceof Error) {
            console.log(e.message)
        }

        res.status(500).send()
    }
})

baseRouter.post('/registerPatient', async (req: MyRequest, res) => {

    const user = req.currentUser!
    console.log("Trying to create Patient record for " + user.email)

    try {

        await prisma.$transaction([
            prisma.user.create({
                data: {
                    uid: user.uid,
                    email: user!.email!
                }
            }),
            prisma.patient.create({
                data: {
                    uid: user.uid

                }
            }),
            prisma.userRoles.create({
                data: {
                    uid: user.uid,
                    role: 'PATIENT'
                }
            })
        ])

        res.status(200).send('Patient record created for' + user.email);

    } catch (e) {
        console.log("Error creating doctor record")
        if (e instanceof Error) {
            console.log(e.message)
        }

        res.status(500).send()
    }
})

baseRouter.get('/getUserDetails', async (req: MyRequest, res) => {
    const user = req.currentUser!

    console.log("Getting user details for " + user.email)
    try {

        const foundUser = await prisma.user.findUnique({
            where: {
                uid: user.uid
            },
            include: {
                doctor: true,
                patient: {
                    include: {
                        doctors: true
                    }
                },
                userRoles: true
            }
        })

        res.json(foundUser)

    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            console.log("Prisma error code: " + e.code)
        } else if (e instanceof Error) {
            console.log(e.message)
        }

        return res.status(400).send("User not found.")
    }

})

baseRouter.post('/doctorVerificationSubmission', async (req: MyRequest, res) => {

    const user = req.currentUser!

    console.log("Storing doctor verification details for " + user.email)

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
        prisma.doctor.update({
            where: {
                uid: user.uid
            },
            data: {
                idImageUrl: req.body.idImageUrl,
                medicalPractice: req.body.medicalPractice,
                medicalLicenseNumber: req.body.medicalLicenseNumber,
                licenseImageUrl: req.body.licenseImageUrl,
                submittedForVerification: true,
                submissionTimestamp: new Date()
            }
        })
    ])

    res.status(200).send('Doctor verification submitted for ' + user.email);

})

baseRouter.post('/updateAvatarImage',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            avatarImageUrl: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {
        const user = req.currentUser!

        const {avatarImageUrl} = req.body

        await prisma.user.update({
            where: {
                uid: user.uid
            },
            data: {
                avatarImageUrl: avatarImageUrl
            }
        })

        res.status(200).send()
})

baseRouter.post('/updateName',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {
        const user = req.currentUser!

        const {firstName, lastName} = req.body

        await prisma.user.update({
            where: {
                uid: user.uid
            },
            data: {
                firstName: firstName,
                lastName: lastName
            }
        })

        res.status(200).send()
    })

export default baseRouter