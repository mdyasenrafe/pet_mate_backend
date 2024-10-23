import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { CommentServices } from "./comment.service";
import { catchAsync } from "../../utils/catchAsync";

export const createCommentHandler = catchAsync(
  async (req: Request, res: Response) => {
    const comment = await CommentServices.createComment(req?.body);
    sendResponse(res, {
      message: "Comment created successfully",
      data: comment,
    });
  }
);
