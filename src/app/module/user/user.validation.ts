import { z } from "zod";

const userUpdateSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
  profilePicture: z
    .string()
    .min(1, { message: "Profile picture URL cannot be empty" })
    .optional(),
});

export const UserValidations = {
  userUpdateSchema,
};
