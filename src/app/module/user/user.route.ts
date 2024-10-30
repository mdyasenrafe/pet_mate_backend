import express from "express";
import { UserRolesObject } from "./user.constant";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import { UserControllers } from "./user.controller";
import { authenticateToken } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/random", UserControllers.getRandomUsers);

router.use(authenticateToken(UserRolesObject.admin, UserRolesObject.user));

router.get("/", UserControllers.getUsers);
router.get("/me/:userId", UserControllers.getUsersById);
router.put(
  "/me",
  validateRequest(UserValidations.userUpdateSchema),
  UserControllers.updateProfile
);
router.post("/follow/:followerId", UserControllers.addFollower);
router.delete("/unfollow/:followerId", UserControllers.removeFollower);
router.get(
  "/",
  authenticateToken(UserRolesObject.admin),
  UserControllers.getAllUsers
);
router.put(
  "/role-update/:id",
  authenticateToken(UserRolesObject.admin),
  UserControllers.updateUserRole
);
router.delete(
  "/change-status/:id",
  authenticateToken(UserRolesObject.admin),
  UserControllers.deleteUser
);

export const userRoutes = router;
