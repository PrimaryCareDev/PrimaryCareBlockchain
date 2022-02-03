import express, {Request} from "express";
import {stripe} from "../app";
import {Stripe} from "stripe";
import prisma from "../prisma-client";

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
        }
        else {
            console.log("ERROR: Stripe checkout.session.completed event has no client_reference_id")
        }
    }
    else {

        console.log(event)
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(200).send();
});

export default publicRouter