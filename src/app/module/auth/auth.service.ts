import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { TUser } from "../user/user.types";
import { UserModel } from "../user/user.model";
import { AppError } from "../../errors/AppError";
import { generateToken } from "../../utils/tokenGenerateFunction";

const createUserIntoDB = async (payload: TUser) => {
  if (payload.role === "admin") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to create an admin user"
    );
  }

  const result = await UserModel.create(payload);
  const token = generateToken(result._id, result.role);
  return { data: result, token };
};

const signinUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email })
    .select("+password")
    .populate("following")
    .populate("followers");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  if (user.status === "deleted") {
    throw new AppError(httpStatus.FORBIDDEN, "User account has been deleted");
  }

  const token = generateToken(user._id, user.role);
  return { data: user, token };
};

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await UserModel.findById(userId).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password is incorrect");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  const result = await UserModel.findOneAndUpdate(
    { _id: userId },
    { password: hashedNewPassword },
    { new: true }
  );

  return result;
};

export const AuthServices = {
  createUserIntoDB,
  signinUser,
  changePassword,
};
