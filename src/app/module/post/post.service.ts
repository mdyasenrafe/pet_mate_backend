import httpStatus from "http-status";
import { TPost } from "./post.type";
import { PostModel } from "./post.model";
import { Types } from "mongoose";
import { UserModel } from "../user/user.model";
import { AppError } from "../../errors/AppError";

const checkPremiumAccess = async (userId: Types.ObjectId) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  if (!user.isPremium) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You must be a premium user to perform this action."
    );
  }
  return;
};

const getRandomPosts = async (limit: number = 10) => {
  const posts = await PostModel.aggregate([{ $sample: { size: limit } }]);
  return posts;
};

const createPost = async (data: TPost, userId: Types.ObjectId) => {
  data["author"] = userId;
  if (data.monetization) {
    await checkPremiumAccess(userId);
  }

  const post = await PostModel.create(data);

  return post;
};

// Update a post
const updatePost = async (data: TPost, userId: Types.ObjectId) => {
  if (data?.monetization) {
    await checkPremiumAccess(userId);
  }

  const updatedPost = await PostModel.findByIdAndUpdate(data._id, data, {
    new: true,
  });

  return updatedPost;
};

// Delete a post
const deletePost = async (postId: string, userId: Types.ObjectId) => {
  const post = await PostModel.findOneAndUpdate(
    { _id: postId, author: userId },
    { status: "deleted" },
    { new: true }
  );

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found or unauthorized.");
  }

  return post;
};

// Upvote a post
const upvotePost = async (postId: string, userId: Types.ObjectId) => {
  const post = await PostModel.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found.");
  }

  if (post.upvotedBy.includes(userId)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already upvoted this post."
    );
  }

  const updatedPost = await PostModel.findByIdAndUpdate(
    postId,
    {
      $inc: { upvoteCount: 1 },
      $addToSet: { upvotedBy: userId },
    },
    { new: true }
  );

  return updatedPost;
};

// Downvote a post
const downvotePost = async (postId: string, userId: Types.ObjectId) => {
  const post = await PostModel.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found.");
  }

  if (post.downvotedBy.includes(userId)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already downvoted this post."
    );
  }

  const updatedPost = await PostModel.findByIdAndUpdate(
    postId,
    {
      $inc: { downvoteCount: 1 },
      $addToSet: { downvotedBy: userId },
    },
    { new: true }
  );

  return updatedPost;
};

export const PostServices = {
  getRandomPosts,
  createPost,
  deletePost,
  updatePost,
  upvotePost,
  downvotePost,
};
