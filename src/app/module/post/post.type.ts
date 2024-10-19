import mongoose from "mongoose";

type TFileType = "image" | "pdf";
export type TFile = {
  _id: string;
  url: string;
  type: TFileType;
};

export type TPost = {
  title: string;
  content: string;
  category: string;
  files: TFile[];
  monetization: boolean;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
