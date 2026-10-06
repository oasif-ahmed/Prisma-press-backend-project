import Stripe from "stripe";
import { prisma } from "../lib/prisma";
import { stripe } from "../lib/stripe";
import { SubscriptionStatus } from "../../generated/prisma/enums";

const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId!;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !stripeCustomerId) {
    console.log("Webhook: Missing values for creating checkout session");
    return;
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    stripeSubscriptionId as string,
  );
  console.log("sub info:", stripeSubscription.items.data[0]);

  // const currentPeriodStart = stripeSubscription.items.data[0]?.current_period_start;

  
  const currentPeriodEnd =  getPeriodEnd(stripeSubscription);


  await prisma.subscription.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
  });
};

const getPeriodEnd = (payload: Stripe.Subscription) => {
    const currentPeriodEndInMillisecond = payload.items.data[0]?.current_period_end!;
    const currentPeriodEnd = new Date(currentPeriodEndInMillisecond * 1000);
    return currentPeriodEnd;
}

const handleChangedSubscription = async (payload: Stripe.Subscription) => {
  const stripeSubscriptionId = payload.id;
  const status =
    payload.status === "active"
      ? SubscriptionStatus.ACTIVE
      : payload.status === "trialing"
        ? SubscriptionStatus.ACTIVE
        : payload.status === "canceled"
          ? SubscriptionStatus.CANCELLED
          : SubscriptionStatus.EXPIRED;

          const currentPeriodEnd = getPeriodEnd(payload);

          const isSubscrptionExist = await prisma.subscription.findUnique({
            where: {
                stripeSubscriptionId
            }
          })
          if(!isSubscrptionExist){
            console.log(`Webhook: No Subscription found for subscription id: ${stripeSubscriptionId}!`);
          }

          await prisma.subscription.update({
            where: {
                stripeSubscriptionId
            },
            data: {
                status,
                currentPeriodEnd
            }
          })
};

export const subscriptionUtils = {
    getPeriodEnd,
    handleCheckoutCompleted,
    handleChangedSubscription
}