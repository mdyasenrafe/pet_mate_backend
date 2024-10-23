import { Router } from "express";
import {
  createPostHandler,
  updatePostHandler,
  deletePostHandler,
  getRandomPostsHandler,
  upvotePostHandler,
  downvotePostHandler,
  getPostsHandler,
  undoVoteHandler,
  getPostDetailsHandler,
} from "./post.controller";
import { authenticateToken } from "../../middlewares/authMiddleware";
import { UserRolesObject } from "../user/user.constant";
import { validateRequest } from "../../middlewares/validateRequest";
import { PostValidations } from "./post.validation";

const router = Router();

router.get("/random", getRandomPostsHandler);

router.use(authenticateToken(UserRolesObject.admin, UserRolesObject.user));

router.get("/", getPostsHandler);
router.get("/:postId/details", getPostDetailsHandler);
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
router.post("/:postId/undo-vote", undoVoteHandler);

export const PostRoutes = router;
