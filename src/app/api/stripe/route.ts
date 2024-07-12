import {getAuthSession} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "@/lib/database";
import {stripe} from "@/lib/stripe";

const settingsUrl = process.env.NEXTAUTH_URL + '/settings'

export async function GET(){
    try{
        const session =  await getAuthSession()
        if(!session?.user){
            return new NextResponse('unauthorised', {status: 401})
        }

        const userSubscription = await prisma.userSubscription.findUnique({
            where: {
                userId: session.user.id
            }
        })

        if (userSubscription && userSubscription.stripeCustomerId){
            const stripeSession =  await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl
            })
            return NextResponse.json({url: stripeSession.url})
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ['card'],
            mode: 'subscription',
            billing_address_collection: 'auto',
            customer_email: session.user.email ?? '',
            line_items: [
                {
                    price_data: {
                        currency: 'GBP',
                        product_data: {
                            name: 'Topic Tutor Pro Subscription',
                            description: 'Unlock unlimited generations',
                        },
                        unit_amount: 500,
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId: session.user.id
            }
        })
        return NextResponse.json({url: stripeSession.url})
    }
    catch(error){
        console.error(error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}