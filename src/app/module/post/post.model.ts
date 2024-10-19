import { Schema, model } from "mongoose";
import { TFile, TPost } from "./post.type";

const FileSchema = new Schema<TFile>({
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["image", "pdf"],
    required: true,
  },
});

const PostSchema = new Schema<TPost>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["tip", "story"],
      required: true,
    },
    files: [FileSchema],
    monetization: {
      type: Boolean,
      default: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvoteCount: {
      type: Number,
      default: 0,
    },
    downvoteCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const PostModel = model<TPost>("post", PostSchema);
