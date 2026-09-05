import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/v1", auth(Role.USER, Role.USER),  commentController.createComments);
router.get("/author/:authorId", commentController.getCommentsByAuthorId);
router.patch("/:commentId", auth(Role.USER, Role.ADMIN), commentController.updateCommentbyCommentId);


export const commentsRoute = router;