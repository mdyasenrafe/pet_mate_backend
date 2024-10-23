import { z } from "zod";

export const CreateCommentValidations = {
  createCommentValidation: z.object({
    content: z.string().min(1, "Content is required"),
    author: z.string({
      required_error: "Author ID is required",
    }),
    post: z.string({
      required_error: "Post ID is required",
    }),
  }),
};

export const CommentValidations = {
  CreateCommentValidations,
};
