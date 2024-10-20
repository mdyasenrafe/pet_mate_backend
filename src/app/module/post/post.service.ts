import httpStatus from "http-status";
import { TPost } from "./post.type";
import { PostModel } from "./post.model";
import { Types } from "mongoose";
import { UserModel } from "../user/user.model";
import { AppError } from "../../errors/AppError";

const checkPremiumAccess = async (userId: Types.ObjectId) => {
  const user = await UserModel.findById(userId);
  if (user?.isPremium) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You must be a premium user to perform this action."
    );
  }
};

// Get random posts
export const getRandomPosts = async (limit: number = 10) => {
  const posts = await PostModel.aggregate([{ $sample: { size: limit } }]);
  if (!posts) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to fetch random posts."
    );
  }
  return posts;
};

// Create a new post
export const createPost = async (data: TPost, userId: Types.ObjectId) => {
  data["author"] = userId;
  if (data.monetization) {
    checkPremiumAccess(userId);
  }

  const post = await PostModel.create(data);

  if (!post?._id) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create post."
    );
  }

  return post;
};

// Update a post
export const updatePost = async (data: TPost, user: Types.ObjectId) => {
  if (data?.monetization) {
    checkPremiumAccess(user);
  }

  const updatedPost = await PostModel.findByIdAndUpdate(data._id, data, {
    new: true,
  });

  if (!updatedPost) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update post."
    );
  }

  return updatedPost;
};

// Delete a post
// export const deletePost = async (postId: string, userId: Types.ObjectId) => {
//   const post = await PostModel.findOneAndDelete({ _id: postId, author:userId });

//   if (!post) {
//     throw new AppError(httpStatus.NOT_FOUND, "Post not found or unauthorized.");
//   }

//   return post;
// };

// Upvote a post
// export const upvotePost = async (postId: Types.ObjectId) => {
//   const post = await PostModel.findByIdAndUpdate(
//     postId,
//     { $inc: { upvoteCount: 1 } },
//     { new: true }
//   );

//   if (!post) {
//     throw new AppError(httpStatus.NOT_FOUND, "Post not found.");
//   }

//   return post;
// };

// // Downvote a post
// export const downvotePost = async (postId: string) => {
//   const post = await Post.findByIdAndUpdate(postId, { $inc: { downvoteCount: 1 } }, { new: true });

//   if (!post) {
//     throw new AppError(httpStatus.NOT_FOUND, "Post not found.");
//   }

//   return post;
// };