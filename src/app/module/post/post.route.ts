import { Router } from "express";
import {
  createPostHandler,
  updatePostHandler,
  deletePostHandler,
  getRandomPostsHandler,
  upvotePostHandler,
  downvotePostHandler,
  getPostsHandler,
} from "./post.controller";
import { authenticateToken } from "../../middlewares/authMiddleware";
import { UserRolesObject } from "../user/user.constant";
import { validateRequest } from "../../middlewares/validateRequest";
import { PostValidations } from "./post.validation";

const router = Router();

// Public route to get all posts (if applicable)
router.get("/", getPostsHandler);

router.use(authenticateToken(UserRolesObject.admin, UserRolesObject.user));

router.post(
  "/",
  validateRequest(PostValidations.createPostValidation),
  createPostHandler
);
router.put(
  "/",
  validateRequest(PostValidations.updatePostValidation),
  updatePostHandler
);
router.delete("/:postId", deletePostHandler);
router.post("/:postId/upvote", upvotePostHandler);
router.post("/:postId/downvote", downvotePostHandler);

export const PostRoutes = router;
