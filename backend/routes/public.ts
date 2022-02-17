import express from "express";
import {stripe} from "../app";
import {Stripe} from "stripe";
import prisma from "../prisma-client";
import {celebrate, Joi, Segments} from "celebrate";
import {getAuth} from "firebase-admin/auth";
import {auth} from "firebase-admin";
import UserRecord = auth.UserRecord;

const publicRouter = express.Router()


publicRouter.get('/stripeSecret', async (req, res) => {
    const intent = // ... Fetch or create the PaymentIntent
        res.json({publishableKey: process.env.STRIPE_PUBLISHABLE_KEY});
});

publicRouter.post('/webhook', async (req, res) => {
    const payload = req.body;

    const sig = req.headers['stripe-signature'];

    const endpointSecret: string = process.env.STRIPE_WEBHOOK_SECRET as string

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig as string, endpointSecret);
    } catch (e) {
        console.log((e as Error).message)
        return res.status(400).send(`Webhook Error: ${(e as Error).message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const purchasedMemoId = session.client_reference_id

        if (purchasedMemoId !== null) {
            await prisma.memo.update({
                where: {
                    id: parseInt(purchasedMemoId)
                },
                data: {
                    patientHasAccess: true,
                    stripeSessionId: session.id
                }

            })
        } else {
            console.log("ERROR: Stripe checkout.session.completed event has no client_reference_id")
        }
    } else {

        console.log(event)
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(200).send();
});

publicRouter.post('/createDoctor',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().required()
        })
    }),
    async (req, res) => {

        const {email, password} = req.body
        console.log("Creating doctor: " + email)
        let errorMessage = ""
        const userRecord = <UserRecord> await getAuth().createUser({
            email: email,
            password: password
        }).catch((e) => {
            console.log("Firebase error when creating doctor record: " + email)
            errorMessage = getMessageFromErrorCode(e.errorInfo.code)
        })

        if (errorMessage != "") {
            return res.status(400).send(errorMessage)
        }

        try {

            await prisma.$transaction([
                prisma.user.create({
                    data: {
                        uid: userRecord.uid,
                        email: email
                    }
                }),
                prisma.doctor.create({
                    data: {
                        uid: userRecord.uid

                    }
                }),
                prisma.userRoles.create({
                    data: {
                        uid: userRecord.uid,
                        role: 'DOCTOR'
                    }
                })
            ])

            return res.status(200).send('Doctor record created for ' + userRecord.email);

        } catch (e) {
            console.log("Error creating doctor record")
            if (e instanceof Error) {
                console.log(e.message)
            }

            return res.status(500).send("Something went wrong. Please try again.")
        }

    }
)

publicRouter.post('/createPatient',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().required()
        })
    }),
    async (req, res) => {

        const {email, password} = req.body
        console.log("Creating patient: " + email)
        let errorMessage = ""
        const userRecord = <UserRecord> await getAuth().createUser({
            email: email,
            password: password
        }).catch((e) => {
            console.log("Firebase error when creating patient record: " + email)
            errorMessage = getMessageFromErrorCode(e.errorInfo.code)
        })

        if (errorMessage != "") {
            return res.status(400).send(errorMessage)
        }

        try {

            await prisma.$transaction([
                prisma.user.create({
                    data: {
                        uid: userRecord.uid,
                        email: email
                    }
                }),
                prisma.patient.create({
                    data: {
                        uid: userRecord.uid

                    }
                }),
                prisma.userRoles.create({
                    data: {
                        uid: userRecord.uid,
                        role: 'PATIENT'
                    }
                })
            ])

            return res.status(200).send('Patient record created for ' + userRecord.email);

        } catch (e) {
            console.log("Error creating patient record")
            if (e instanceof Error) {
                console.log(e.message)
            }

            return res.status(500).send("Something went wrong. Please try again.")
        }

    }
)

function getMessageFromErrorCode(errorCode: string) {
    const slicedCode = errorCode.slice(5)
    switch (slicedCode) {
        case "ERROR_EMAIL_ALREADY_IN_USE":
        case "account-exists-with-different-credential":
        case "email-already-in-use":
            return "Email already used. Go to login page.";
            break;
        case "ERROR_WRONG_PASSWORD":
        case "wrong-password":
            return "Wrong email/password combination.";
            break;
        case "ERROR_USER_NOT_FOUND":
        case "user-not-found":
            return "No user found with this email.";
            break;
        case "ERROR_USER_DISABLED":
        case "user-disabled":
            return "User disabled.";
            break;
        case "ERROR_TOO_MANY_REQUESTS":
        case "operation-not-allowed":
            return "Too many requests to log into this account.";
            break;
        case "ERROR_OPERATION_NOT_ALLOWED":
        case "operation-not-allowed":
            return "Server error, please try again later.";
            break;
        case "ERROR_INVALID_EMAIL":
        case "invalid-email":
            return "Email address is invalid.";
            break;
        case "email-already-exists":
            return "A user with that email account already exists.";
            break;
        default:
            return "Login failed. Please try again.";
            break;
    }
}

export default publicRouter