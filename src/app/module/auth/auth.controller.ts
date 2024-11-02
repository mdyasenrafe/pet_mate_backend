import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const { data, token } = await AuthServices.createUserIntoDB(req.body);
  sendResponse(res, {
    data: data,
    token,
    message: "User registered successfully",
  });
});

const signin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { data, token } = await AuthServices.signinUser(email, password);
  sendResponse(res, {
    data: data,
    token,
    message: "User logged in successfully",
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;

  const result = await AuthServices.changePassword(
    userId,
    oldPassword,
    newPassword
  );
  sendResponse(res, {
    data: result,
    message: "Password changed successfully",
  });
});

export const AuthControllers = {
  register,
  signin,
  changePassword,
};
