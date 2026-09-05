import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status-codes";

const createComments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    // console.log("controller theke",data, authorId);
    const result = await commentService.createComment(authorId as string, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpstatus.CREATED,
        message: "Comment created Successfully",
        data: result
    });
})

const getCommentsByAuthorId = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.authorId;;
    const result = await commentService.getCommentsByAuthorId(authorId as any);
    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Getting all  the comments by logged in user",
        data: result
    });
});

const updateCommentbyCommentId = catchAsync( async (req: Request, res:Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    const payload = req.body;
    const  authorId = req.user?.id;

    const result = await commentService.updateCommentbyCommentId(commentId as string, authorId as string, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Post Updated SuccessFully!",
      data: result
    });
})
export const commentController = {
    createComments,
    getCommentsByAuthorId,
    updateCommentbyCommentId
}