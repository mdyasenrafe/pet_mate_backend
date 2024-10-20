import { Router } from "express";
import { userRoutes } from "../module/user/user.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { uploadRoutes } from "../module/upload/upload.route";
import { PostRoutes } from "../module/post/post.route";

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
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
