import { Types } from "mongoose";
import { UserRolesObject } from "./user.constant";

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  status: "active" | "deleted";
  profilePicture: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
};

export type TUserRoles = keyof typeof UserRolesObject;
