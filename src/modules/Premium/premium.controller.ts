import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status-codes";
import { premiumServices } from "./premium.service";

const getPremiumContent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await premiumServices.getPremiumContent();
    
    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Premium content retrived successfully",
        data: result
    })
})

export const premiumController = {
    getPremiumContent
}