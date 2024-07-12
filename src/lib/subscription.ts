import {getAuthSession} from "@/lib/auth";
import {prisma} from "@/lib/database";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const checkSubscription = async () => {
    const session =  await getAuthSession();
    if(!session?.user){
        return false;
    }
    const userSubscription = await prisma.userSubscription.findUnique({
        where: {
            userId: session.user.id
        }
    });
    if(!userSubscription){
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const isValid = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();

    return !!isValid;
}