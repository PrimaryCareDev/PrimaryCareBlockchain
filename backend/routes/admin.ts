import {bucket, MyRequest} from "../app";
import express from "express"
import prisma from "../prisma-client";
import {celebrate, Joi, Segments} from "celebrate";

const adminRouter = express.Router()

adminRouter.get('/getApprovalsList', async (req: MyRequest, res) => {
    console.log("Getting Approvals List")

    const pageNum = req.query.pageNum ? parseInt(<string>req.query.pageNum) : 0
    const perPage = req.query.perPage ? parseInt(<string>req.query.perPage) : 0

    const results = await prisma.doctor.findMany({
        skip: (pageNum - 1) * perPage,
        take: perPage,
        where: {
            verified: false,
            submittedForVerification: true
        },
        orderBy: {
            submissionTimestamp: "desc"
        },
        select: {
            user: true,
            uid: true,
            verified: true,
            submittedForVerification: true,
        }
    })

    const totalCount = await prisma.doctor.count({
        where: {
            verified: false,
            submittedForVerification: true
        }
    })

    res.json({totalCount, results})
})

adminRouter.get('/getDoctorDetails', async (req: MyRequest, res) => {

    if (!req.query.doctorUid) {

        res.status(400).send('Doctor Uid not provided')
    }

    const doctorUid = <string>req.query.doctorUid!

    const foundDoctor = await prisma.doctor.findUnique({
        where: {
            uid: doctorUid
        },
        include: {
            user: true
        }
    })

    res.json(foundDoctor)

})

adminRouter.post('/approveDoctor',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            doctorUid: Joi.string().required()
        })
    }),
    async (req: MyRequest, res) => {

        const {doctorUid} = req.body

        await prisma.doctor.update({
            where: {
                uid: doctorUid
            },
            data: {
                verified: true
            }
        })

        await bucket.file("images/identification/" + doctorUid).delete()
            .catch((e) => {
                console.log("Could not delete identification image for doctor with uid " + doctorUid)
                console.log(e.response)
            })

        await bucket.file("images/licenses/" + doctorUid).delete()
            .catch((e) => {
                console.log("Could not delete medical license image for doctor with uid " + doctorUid)
                console.log(e.response)
            })

        console.log("User " + req.body.doctorUid + " approved as doctor")

        return res.status(200).send("User " + req.body.doctorUid + " approved as doctor")

    })

export default adminRouter