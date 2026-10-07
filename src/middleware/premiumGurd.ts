import { NextFunction, Request, Response } from "express";
import { SubscriptionStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";

export const premiumGurd = () => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

    if (!subscription) {
      throw new Error("Please subscribe to access more premium content");
    }

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new Error(
        "Your yearly subscription ends. To see more premium content please subscribe again.",
      );
    }

    next();
  })
}