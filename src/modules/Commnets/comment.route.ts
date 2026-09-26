import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/v1", auth(Role.USER, Role.USER),  commentController.createComments);
router.get("/", auth(Role.ADMIN), commentController.getAllComments);
router.get("/post/:postId", commentController.getCommentsByPostId);
router.get("/author/:authorId", commentController.getCommentsByAuthorId);
router.patch("/:commentId", auth(Role.USER, Role.ADMIN), commentController.updateCommentbyCommentId);
router.patch("/:commentId/status", auth(Role.ADMIN), commentController.updateCommentStatus);
router.delete("/:commentId", auth(Role.USER, Role.ADMIN), commentController.deleteComment);


export const commentsRoute = router;