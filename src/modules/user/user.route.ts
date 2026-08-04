import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import httpstatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { auth } from "../../middleware/auth";



const router = Router();
router.post("/register", userController.createUser);

router.get(
  "/me",
  // (req: Request, res: Response, next: NextFunction) => {
  //   console.log("from cookies", req.cookies);

  //   const { accessToken } = req.cookies;
  //   console.log(accessToken);

  //   const verifiedToken = jwtUtils.verifyToken(
  //     accessToken,
  //     config.jwt_access_secret,
  //   );
  //   console.log("before", verifiedToken);


  //   if(!verifiedToken.success){
  //     throw new Error(verifiedToken.error);
  //   }




  //   const { id, name, email, role } = verifiedToken.data as JwtPayload;
  //   console.log("after", verifiedToken);

  //   const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];

  //   if (!requiredRoles.includes(role)) {
  //     return res.status(403).json({
  //       success: false,
  //       statusCode: httpstatus.FORBIDDEN,
  //       message:
  //         "Forbidden. You do not have permission to access this resource.",
  //     });
  //   }

  //   req.user = {
  //     email,
  //     name,
  //     id,
  //     role
  //   }

  //   next();
  // },
  auth(Role.ADMIN, Role.USER),
  userController.getMyProfile,
);

router.put("/my-profile", auth(Role.ADMIN, Role.USER), userController.updateMyProfile);

export const userRoutes = router;
