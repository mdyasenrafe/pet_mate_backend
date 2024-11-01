import { UserModel } from "../user/user.model";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { TPremiumType } from "./payment.type";
import { PremiumModel } from "./payment.model";
import { stripe } from "../../../config";
import { Types } from "mongoose";

const initiatePayment = async (userId: string, type: TPremiumType) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 10000,
    currency: "usd",
    description: `Subscription for ${type}`,
    metadata: { userId: user._id.toString(), type },
  });

  const premiumSubscription = await PremiumModel.create({
    user: user._id,
    type,
    paymentIntentId: paymentIntent.id,
    isActive: false,
  });

  return { clientSecret: paymentIntent.client_secret };
};

const handlePaymentSuccess = async (
  paymentIntentId: string,
  userId: Types.ObjectId
) => {
  const premium = await PremiumModel.findOneAndUpdate(
    { paymentIntentId },
    { isActive: true },
    { new: true }
  );

  if (!premium)
    throw new AppError(httpStatus.NOT_FOUND, "Premium subscription not found");

  const user = await UserModel.findOneAndUpdate(
    { _id: userId },
    { isPremium: true },
    { new: true }
  );

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  return premium;
};

const handlePaymentFailure = async (paymentIntentId: string) => {
  const premium = await PremiumModel.findOneAndUpdate(
    { paymentIntentId },
    { isActive: false },
    { new: true }
  );

  if (!premium)
    throw new AppError(httpStatus.NOT_FOUND, "Premium subscription not found");
  return premium;
};

export const PaymentService = {
  initiatePayment,
  handlePaymentSuccess,
  handlePaymentFailure,
};
