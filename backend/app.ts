import express, {NextFunction, Response} from "express"
import dotenv from "dotenv"
import {App, cert, initializeApp} from 'firebase-admin/app';
import {DecodedIdToken, getAuth} from 'firebase-admin/auth'
import bodyParser from "body-parser";
import cors from "cors"
import {errors} from "celebrate";
import prisma from './prisma-client'
import baseRouter from "./routes/base";
import adminRouter from "./routes/admin";
import patientRouter from "./routes/patient";
import doctorRouter from "./routes/doctor";
import {Role} from "@prisma/client";

dotenv.config()
const app = express()

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDS as string);
const firebaseApp: App = initializeApp({
    credential: cert(serviceAccount)
});

export type MyRequest = express.Request & {
    currentUser?: DecodedIdToken;
};
// Decodes the Firebase JSON Web Token
app.use(cors())
app.use(bodyParser.json())
app.use(decodeIDToken);
app.use('/admin', verifyAdminRole);
app.use('/patient', verifyPatientRole);
app.use('/doctor', verifyDoctorRole);
app.use('/', baseRouter)
app.use('/admin', adminRouter)
app.use('/patient', patientRouter)
app.use('/doctor', doctorRouter)
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