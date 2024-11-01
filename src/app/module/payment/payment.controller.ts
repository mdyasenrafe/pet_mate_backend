import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const pay = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { type } = req.body;
  const { clientSecret } = await PaymentService.initiatePayment(userId, type);

  sendResponse(res, {
    message: "Payment intent created successfully",
    data: { clientSecret },
  });
});

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const { paymentIntentId } = req.query;
  const premiumSubscription = await PaymentService.handlePaymentSuccess(
    paymentIntentId as string
  );

  sendResponse(res, {
    message: "Payment successful, premium subscription activated",
    data: premiumSubscription,
  });
});

const paymentFailure = catchAsync(async (req: Request, res: Response) => {
  const { paymentIntentId } = req.query;
  const premiumSubscription = await PaymentService.handlePaymentFailure(
    paymentIntentId as string
  );

  sendResponse(res, {
    message: "Payment failed, subscription is inactive",
    data: premiumSubscription,
  });
});

export const PaymentController = {
  pay,
  paymentSuccess,
  paymentFailure,
};
