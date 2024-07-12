import {headers} from "next/headers";
import {stripe} from "@/lib/stripe";
import Stripe from "stripe";
import {prisma} from "@/lib/database";

export async function POST(req: Request){
    const body = await req.text();
    const signature = headers().get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        event =  stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err) {
        console.error(err);
        return new Response("Webhook Error", {status: 400});

    }

    const session  =  event.data.object as Stripe.Checkout.Session;

    if(event.type === "checkout.session.completed"){
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        if(!session?.metadata?.userId){
            return new Response("Webhook Error User not found", {status: 404});
        }
        await prisma.userSubscription.create({
            data: {
                userId: session.metadata.userId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            }
        })
    }

    if(event.type === 'invoice.payment_succeeded'){
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        if(!session?.metadata?.userId){
            return new Response("Webhook Error User not found", {status: 404});
        }
        await prisma.userSubscription.update({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            }
        })
    }
    return new Response(null, {status: 200});
}