import { Schema, model } from "mongoose";
import { TFile, TPost } from "./post.type";

const FileSchema = new Schema<TFile>({
  url: {
    type: String,
  },
  type: {
    type: String,
    enum: ["image", "pdf"],
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
      ref: "user",
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
    upvotedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    downvotedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    status: {
      type: String,
      enum: ["published", "deleted"],
      default: "published",
    },
  },
  { timestamps: true }
);

export const PostModel = model<TPost>("post", PostSchema);
