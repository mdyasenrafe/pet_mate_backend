import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { CommentModel } from "./comment.model";
import { TComment } from "./comment.type";

const createComment = async (body: TComment) => {
  const comment = await CommentModel.create(body);

  if (!comment) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create the comment.");
  }

  return comment;
};

export const CommentServices = {
  createComment,
};
