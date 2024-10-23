import { Schema, model } from "mongoose";
import { TComment } from "./comment.type";

const CommentSchema = new Schema<TComment>(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
  },
  { timestamps: true }
);

export const CommentModel = model<TComment>("comment", CommentSchema);
