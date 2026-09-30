import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status-codes";
const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await subscriptionService.createCheckoutSession(userId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Checkout completed Successfully!",
      data: result
    })
  },
);

export const subscriptionController = {
  createCheckoutSession,
};
