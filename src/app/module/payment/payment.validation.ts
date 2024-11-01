import { z } from "zod";

const createPremiumValidation = z.object({
  type: z.enum(["premium"]),
});

export const PaymentValidations = {
  createPremiumValidation,
};
