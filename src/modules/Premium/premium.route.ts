import { NextFunction, Request, Response, Router } from "express";
import { premiumController } from "./premium.controller";
import { auth } from "../../middleware/auth";
import { Role, SubscriptionStatus } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { prisma } from "../../lib/prisma";
import { premiumGurd } from "../../middleware/premiumGurd";

const router = Router();

router.get(
  "/posts",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  premiumGurd(),
  premiumController.getPremiumContent,
);

export const premiumRoute = router;
