import { z } from "zod";

const userSignupSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  profilePicture: z
    .string()
    .min(1, { message: "Profile picture URL cannot be empty" }),
});

const userSigninSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const userChangePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(6, { message: "Old password must be at least 6 characters long" }),
  newPassword: z
    .string()
    .min(6, { message: "New password must be at least 6 characters long" }),
});

export const AuthValidations = {
  userSignupSchema,
  userSigninSchema,
  userChangePasswordSchema,
};
