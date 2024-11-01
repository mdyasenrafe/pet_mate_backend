import { Router } from "express";
import { userRoutes } from "../module/user/user.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { uploadRoutes } from "../module/upload/upload.route";
import { PostRoutes } from "../module/post/post.route";
import { CommentRoutes } from "../module/comment/comment.route";
import { PaymentRoutes } from "../module/payment/payment.route";

const router = Router();

const modulesRoutes = [
  {
    path: "/upload",
    route: uploadRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/post",
    route: PostRoutes,
  },
  {
    path: "/comment",
    route: CommentRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
