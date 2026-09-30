import { NextFunction, Request, Response } from "express";
import httpstatus from "http-status-codes";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Error:", err);

  let statusCode = httpstatus.INTERNAL_SERVER_ERROR;
  let errorMessage = err.message;
  let errorName = err.name || "Internal server error";
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpstatus.BAD_REQUEST;
    errorMessage = "You have provided incorrect missing fields!";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpstatus.BAD_REQUEST;
      errorMessage = "Duplicate Key Error";
    }
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
      errorCode: err.code || null,
    errorName: errorName, 
    message: errorMessage,
    error: err.stack,
  });
};
