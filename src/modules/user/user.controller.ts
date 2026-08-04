import { NextFunction, Request, RequestHandler, Response } from "express";
import httpstatus from "http-status-codes";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
 


const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userService.createUserIntoDB(payload);

    // res.status(httpstatus.CREATED).json({
    //     success: true,
    //     statusCode: httpstatus.CREATED,
    //     message: "User created successfully!",
    //     data: {
    //       user,
    //     },
    //   });

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.CREATED,
      message: "user Created Successfully!",
      data: { user },
    });
  },
);

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  
  // const {accessToken} = req.cookies;
  console.log(req.user, "user request"); //this req.user amra middleware ei peye jacci so cockie theke ar ber korar
  //dorkar nai

  // const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);
  
  // if(typeof verifiedToken === "string"){
  //   throw new Error(verifiedToken);
  // }
  // const {id, name, email, role} = verifiedToken;
  // console.log(id, name, email, role);

  const profile = await userService.getMyProfileDB(req.user?.id as string);

  sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "user profile fetched Successfully!",
      data: { profile },
    });
});

// const createUser = async (req: Request, res: Response) => {
//   try {
//     const payload = req.body;
//     const user = await userService.createUserIntoDB(payload);

//     res.status(httpstatus.CREATED).json({
//       success: true,
//       statusCode: httpstatus.CREATED,
//       message: "User created successfully!",
//       data: {
//         user,
//       },
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "failed to register user",
//       error: (error as Error).message
//     })
//   }
// };


const updateMyProfile = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id as string;

  const payload = req.body;

  const updatedProfile = await userService.updateMyProfileFromDB(userId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "user profile updated successfully!",
    data: {updatedProfile}
  })
})

export const userController = {
  createUser,
  getMyProfile,
  updateMyProfile
};
