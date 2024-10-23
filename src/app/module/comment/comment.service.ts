import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { CommentModel } from "./comment.model";
import { PostModel } from "../post/post.model";
import { TComment } from "./comment.type";

const createComment = async (body: TComment) => {
  const post = await PostModel.findById(body.post);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found.");
  }

  const comment = await CommentModel.create(body);

  if (!comment) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create the comment.");
  }

  const updatedPost = await PostModel.findByIdAndUpdate(
    body.post,
    { $push: { comments: comment._id }, $inc: { commentCount: 1 } },
    { new: true }
  );

  if (!updatedPost) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Post not found after comment creation."
    );
  }

  return comment;
};

export const CommentServices = {
  createComment,
};
