import { z } from "zod";

const createPremiumValidation = z.object({
  type: z.enum(["premium_plus"]),
});

export const PaymentValidations = {
  createPremiumValidation,
};
