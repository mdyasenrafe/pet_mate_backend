import httpStatus from "http-status";
import { TPost } from "./post.type";
import { PostModel } from "./post.model";
import mongoose, { Types } from "mongoose";
import { UserModel } from "../user/user.model";
import { AppError } from "../../errors/AppError";
import QueryBuilder from "../../builder/queryBuilder";

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

const getPosts = async (query: Record<string, unknown>, userId?: string) => {
  const searchableFields = ["title", "content"];

  let authorFilter: Record<string, unknown> = {};

  if (userId) {
    authorFilter = { author: userId };
  }

  const postQuery = new QueryBuilder(
    PostModel.find(authorFilter)
      .populate("author")
      .populate("upvotedBy")
      .populate("downvotedBy"),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery;
  const meta = await postQuery.countTotal();

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, "No posts found.");
  }

  return {
    result,
    meta,
  };
};

const createPost = async (data: TPost, userId: Types.ObjectId) => {
  data["author"] = userId;
  if (data.monetization) {
    await checkPremiumAccess(userId);
  }

  const post = await PostModel.create(data);

  return post;
};

const updatePost = async (data: TPost, userId: Types.ObjectId) => {
  if (data?.monetization) {
    await checkPremiumAccess(userId);
  }

  const post = await PostModel.findById(data?._id);
  if (!post?._id) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found.");
  }

  const updatedPost = await PostModel.findByIdAndUpdate(data._id, data, {
    new: true,
  });

  return updatedPost;
};

const deletePost = async (postId: string, userId: Types.ObjectId) => {
  console.log("userId", userId);
  const post = await PostModel.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found.");
  }

  const deletedPost = await PostModel.findOneAndUpdate(
    { _id: postId, author: userId },
    { status: "deleted" },
    { new: true }
  );

  if (!deletedPost) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this post, or the post may already be deleted."
    );
  }

  return deletedPost;
};

const upvotePost = async (postId: string, userId: Types.ObjectId) => {
  const post = await PostModel.findById(postId);
  if (!post?._id) {
    throw new AppError(httpStatus.NOT_FOUND, "This post does not exist.");
  }

  if (post.downvotedBy.includes(userId)) {
    await PostModel.findByIdAndUpdate(
      postId,
      {
        $inc: { downvoteCount: -1 },
        $pull: { downvotedBy: userId },
      },
      { new: true }
    );
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

const downvotePost = async (postId: string, userId: Types.ObjectId) => {
  const post = await PostModel.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "This post does not exist.");
  }

  if (post.upvotedBy.includes(userId)) {
    await PostModel.findByIdAndUpdate(
      postId,
      {
        $inc: { upvoteCount: -1 },
        $pull: { upvotedBy: userId },
      },
      { new: true }
    );
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
  getPosts,
  createPost,
  deletePost,
  updatePost,
  upvotePost,
  downvotePost,
};
