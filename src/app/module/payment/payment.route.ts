import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { authenticateToken } from "../../middlewares/authMiddleware";
import { PaymentController } from "./payment.controller";
import { PaymentValidations } from "./payment.validation";
import { UserRolesObject } from "../user/user.constant";

const router = Router();

router.use(authenticateToken(UserRolesObject.admin, UserRolesObject.user));

router.post(
  "/pay",
  validateRequest(PaymentValidations.createPremiumValidation),
  PaymentController.pay
);
router.post(
  "/payment-success/:paymentIntentId",
  PaymentController.paymentSuccess
);
router.post(
  "/payment-failure/:paymentIntentId",
  PaymentController.paymentFailure
);

router.get(
  "/payment-history",
  authenticateToken(UserRolesObject.admin),
  PaymentController.getAllPaymentHistory
);

export const PaymentRoutes = router;
