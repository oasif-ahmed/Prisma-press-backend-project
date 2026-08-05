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
const getPostsStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deletePost = catchAsync(
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
