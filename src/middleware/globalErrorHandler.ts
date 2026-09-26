import { NextFunction, Request, Response } from "express";
import httpstatus, { StatusCodes } from "http-status-codes";

export const globalErrorHandler = (err: any, req: Request, res:Response, next: NextFunction) => {
res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      StatusCodes: httpstatus.INTERNAL_SERVER_ERROR,
      message: err.message,
      error: err.stack
    })
}