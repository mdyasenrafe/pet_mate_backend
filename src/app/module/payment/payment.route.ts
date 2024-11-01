import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { authenticateToken } from "../../middlewares/authMiddleware";
import { PaymentController } from "./payment.controller";
import { PaymentValidations } from "./payment.validation";

const router = Router();

router.use(authenticateToken());

router.post(
  "/pay",
  validateRequest(PaymentValidations.createPremiumValidation),
  PaymentController.pay
);
router.post("/payment-success", PaymentController.paymentSuccess);
router.post("/payment-failure", PaymentController.paymentFailure);

export const PaymentRoutes = router;
