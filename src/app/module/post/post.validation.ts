import { z } from "zod";

const fileSchema = z.object({
  url: z.string().url(),
  type: z.enum(["image", "pdf"]),
});

const createPostValidation = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.enum(["tip", "story"]),
  files: z.array(fileSchema).optional(),
  monetization: z.boolean().default(false),
});

const updatePostValidation = z.object({
  postId: z.string().nonempty("postId is required"),
  title: z.string().optional(),
  content: z.string().optional(),
  category: z.enum(["tip", "story"]).optional(),
  files: z.array(fileSchema).optional(),
  monetization: z.boolean().optional(),
});

export const PostValidations = {
  createPostValidation,
  updatePostValidation,
};
