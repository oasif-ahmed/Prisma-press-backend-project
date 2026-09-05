import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status-codes";




const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;
    console.log(payload, id);

    const result = await postService.createPost(payload, id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.CREATED,
        message: "post created successfully.",
        data: result
    });
  },
);
const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPosts();

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Getting all the post Successfully!",
        data: result
    })
  },
);
const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    console.log(postId);
    if(!postId){
      throw new Error("Post ID Required");
    }
    const result = await postService.getPostById(postId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Get post by ID successfully!",
      data: result
    })
  },
);
const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await postService.getMyPosts(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Posts Retrived Successfully!",
      data: result
    })
  },
);
const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    const postId = req.params.postId;
    if(!postId){
      throw new Error("Post ID Required");
    }
    const payload = req.body;

    const result = await postService.updatePost(postId as string, payload, authorId as string, isAdmin);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Post Updated SuccessFully!",
      data: result
    })
  },
);
const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    const postId = req.params.postId;
    if(!postId){
      throw new Error("Post ID Required");
    }

    const result = await postService.deletePost(postId as string, authorId as string, isAdmin);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Post deleted SuccessFully!",
      data: result
    })
  },
);
const getPostsStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const postController = {
    createPost,
  getAllPosts,
  getPostsStats,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
};
