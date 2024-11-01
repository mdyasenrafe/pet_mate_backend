import { Types } from "mongoose";

export type TPremiumType = "premium_plus";

export type TPremium = {
  user: Types.ObjectId;
  type: TPremiumType;
  paymentIntentId: string;
  isActive: boolean;
};
