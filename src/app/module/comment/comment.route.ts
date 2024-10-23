import { Router } from "express";
import { createCommentHandler } from "./comment.controller";
import { authenticateToken } from "../../middlewares/authMiddleware";
import { CommentValidations } from "./comment.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.use(authenticateToken("user", "admin"));

router.post(
  "/",
  validateRequest(CommentValidations.createCommentValidation),
  createCommentHandler
);

export const CommentRoutes = router;
