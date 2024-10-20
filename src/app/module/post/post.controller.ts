import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PostServices } from "./post.service";

export const createPostHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const post = await PostServices.createPost(req.body, userId);
    sendResponse(res, {
      message: "Post created successfully",
      data: post,
    });
  }
);

export const getPostsHandler = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query;
    const { result, meta } = await PostServices.getPosts(query);

    sendResponse(res, {
      message: "Posts fetched successfully",
      data: result,
      meta,
    });
  }
);

export const updatePostHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const updatedPost = await PostServices.updatePost(req.body, userId);
    sendResponse(res, {
      message: "Post updated successfully",
      data: updatedPost,
    });
  }
);

export const deletePostHandler = catchAsync(
  async (req: Request, res: Response) => {
    const postId = req.params.postId;
    const userId = req.user.userId;
    const post = await PostServices.deletePost(postId, userId);
    sendResponse(res, {
      message: "Post deleted successfully",
      data: post,
    });
  }
);

export const getRandomPostsHandler = catchAsync(
  async (req: Request, res: Response) => {
    const posts = await PostServices.getRandomPosts(10);
    sendResponse(res, {
      message: "Posts fetched successfully",
      data: posts,
    });
  }
);

export const upvotePostHandler = catchAsync(
  async (req: Request, res: Response) => {
    const postId = req.params.postId;
    const userId = req.user.userId;
    const post = await PostServices.upvotePost(postId, userId);
    sendResponse(res, { message: "Post upvoted", data: post });
  }
);

export const downvotePostHandler = catchAsync(
  async (req: Request, res: Response) => {
    const postId = req.params.postId;
    const userId = req.user.userId;
    const post = await PostServices.downvotePost(postId, userId);
    sendResponse(res, {
      message: "Post downvoted",
      data: post,
    });
  }
);
