import { Schema, Document } from "mongoose";
import { TPost } from "../post/post.type";

export type TComment = {
  content: string;
  author: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
};
