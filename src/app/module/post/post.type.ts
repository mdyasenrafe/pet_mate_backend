import mongoose from "mongoose";

type TFileType = "image" | "pdf";
export type TPostStatus = "published" | "deleted";

export type TFile = {
  _id: string;
  url: string;
  type: TFileType;
};

export type TPost = {
  _id: string;
  title: string;
  content: string;
  category: string;
  files: TFile[];
  monetization: boolean;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
  upvotedBy: mongoose.Types.ObjectId[];
  downvotedBy: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  status: TPostStatus;
};
