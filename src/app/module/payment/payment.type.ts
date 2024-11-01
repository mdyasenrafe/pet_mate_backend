import { Types } from "mongoose";

export type TPremiumType = "premium";

export type TPremium = {
  user: Types.ObjectId;
  type: TPremiumType;
  paymentIntentId: string;
  isActive: boolean;
};
