import express, {NextFunction, Request, Response} from "express"
import dotenv from "dotenv"
import {App, cert, initializeApp} from 'firebase-admin/app';
import {DecodedIdToken, getAuth} from 'firebase-admin/auth'
import bodyParser from "body-parser";
import cors from "cors"
import {errors} from "celebrate";
import prisma from './prisma-client'
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";
import patientRouter from "./routes/patient";
import doctorRouter from "./routes/doctor";
import {Role} from "@prisma/client";
import Stripe from 'stripe';
import publicRouter from "./routes/public";
import {getStorage} from "firebase-admin/storage";

dotenv.config()
const app = express()

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDS as string);
const firebaseApp: App = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

export const bucket = getStorage().bucket()

export const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY as string,
    {apiVersion: '2020-08-27'});


export type MyRequest = express.Request & {
    currentUser?: DecodedIdToken;
};

app.use(cors())
//NOTE: This has to come before bodyParser.json() so that stripe webhook route maintains raw body
app.use('/webhook', bodyParser.raw({type: "*/*"}))
app.use(bodyParser.json())
app.use('/auth', decodeIDToken);
app.use('/auth/admin', verifyAdminRole);
app.use('/auth/patient', verifyPatientRole);
app.use('/auth/doctor', verifyDoctorRole);
app.use('/', publicRouter)
app.use('/auth', authRouter)
app.use('/auth/admin', adminRouter)
app.use('/auth/patient', patientRouter)
app.use('/auth/doctor', doctorRouter)
app.use(errors())

/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body.
 */
async function decodeIDToken(req: MyRequest, res: Response, next: NextFunction) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {

        const idToken = req.headers.authorization.split('Bearer ')[1];

        try {
            req.currentUser = await getAuth().verifyIdToken(idToken);
        } catch (err) {
            console.log(err);
        }

    }

    if (!req.currentUser) {
        return res.status(403).send("You must be logged in")
    }

    next();
}

async function verifyAdminRole(req: MyRequest, res: Response, next: NextFunction) {

    const user = req.currentUser

    const roles = await prisma.userRoles.findMany({
        where: {
            uid: user!.uid
        }
    })

    const validRole = roles.filter(function (item) {
        return item.role === "ADMIN"
    })

    if (validRole.length == 0) {
        console.log("Invalid Role: Only admins can access list of all doctors awaiting approval")
        return res.status(403).send('User does not have a valid role')
    }

    next()
}

async function verifyPatientRole(req: MyRequest, res: Response, next: NextFunction) {

    const user = req.currentUser!

    const roles = await prisma.userRoles.findMany({
        where: {
            uid: user!.uid
        }
    })

    const validRole = roles.filter(function (item) {
        return item.role === Role.PATIENT
    })

    if (validRole.length == 0) {
        console.log("Invalid Role: Only patients can access this API. email: " + user.email)
        return res.status(403).send('User does not have a valid role')
    }

    next()
}

async function verifyDoctorRole(req: MyRequest, res: Response, next: NextFunction) {

    const user = req.currentUser!

    const roles = await prisma.userRoles.findMany({
        where: {
            uid: user!.uid
        }
    })

    const validRole = roles.filter(function (item) {
        return item.role === Role.DOCTOR
    })

    if (validRole.length == 0) {
        console.log("Invalid Role: Only doctors can access this API. email: " + user.email)
        return res.status(403).send('User does not have a valid role')
    }

    next()
}

// start the server listening for requests
app.listen(process.env.PORT || 5000,
    () => console.log("Server is running..."));