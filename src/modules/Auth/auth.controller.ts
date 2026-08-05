import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status-codes";

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const {accessToken, refreshToken} = await authService.loginUserDB(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 // 24 hour or 1 day
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 24 hour or 1 day
    });

    

    sendResponse(res, {
        success: true,
        message: "user login successfully!",
        statusCode: httpstatus.OK,
        data: {accessToken, refreshToken}
    })
});

const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const {accessToken} = await authService.refreshToken(refreshToken);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 // 24 hour or 1 day
    });

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "token refreshed successfully!",
        data: {
            accessToken
        }
    })
})

export const authController = {
    loginUser,
    refreshToken
}