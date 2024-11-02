import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import { authenticateToken } from "../../middlewares/authMiddleware";
import { UserRolesObject } from "../user/user.constant";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(AuthValidations.userSignupSchema),
  AuthControllers.register
);

router.post(
  "/login",
  validateRequest(AuthValidations.userSigninSchema),
  AuthControllers.signin
);

router.post(
  "/change-password",
  authenticateToken(UserRolesObject.admin),
  validateRequest(AuthValidations.userChangePasswordSchema),
  AuthControllers.changePassword
);

export const AuthRoutes = router;
