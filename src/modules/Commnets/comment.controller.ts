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

const getAllComments = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const result = await commentService.getAllComments();
    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Getting all  the comments successfully",
        data: result
    });
});

const getCommentsByPostId = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    if(!postId){
        throw new Error("Post ID Required");
    }
    const result = await commentService.getCommentsByPostId(postId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Getting all  the comments by post successfully",
        data: result
    });
});

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

const deleteComment = catchAsync( async (req: Request, res:Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    if(!commentId){
      throw new Error("Comment ID Required");
    }

    const result = await commentService.deleteComment(commentId as string, authorId as string, isAdmin);
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Comment deleted SuccessFully!",
      data: result
    });
})

const updateCommentStatus = catchAsync( async (req: Request, res:Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    const {status} = req.body;

    if(!commentId){
      throw new Error("Comment ID Required");
    }
    if(!status){
      throw new Error("Status Required");
    }

    const result = await commentService.updateCommentStatus(commentId as string, status);
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Comment status updated SuccessFully!",
      data: result
    });
})

export const commentController = {
    createComments,
    getAllComments,
    getCommentsByPostId,
    getCommentsByAuthorId,
    updateCommentbyCommentId,
    deleteComment,
    updateCommentStatus
}