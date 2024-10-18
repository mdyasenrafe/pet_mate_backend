import { z } from "zod";

const uploadSchema = z.object({
  file: z.instanceof(File),
});

export const uploadValidations = {
  uploadSchema,
};
