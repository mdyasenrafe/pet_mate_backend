import mongoose, { Schema } from "mongoose";
import { TPremium } from "./payment.type";

const PaymentSchema = new Schema<TPremium>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      enum: ["premium"],
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const PremiumModel = mongoose.model<TPremium>("payment", PaymentSchema);
