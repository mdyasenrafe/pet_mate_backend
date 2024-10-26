import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Userservices } from "./user.service";
import httpStatus from "http-status";

const getProfile = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await Userservices.getUserFromDB(user.userId);
  sendResponse(res, {
    message: "User profile retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const { user, body } = req;
  const result = await Userservices.updateUserIntoDB(user, body);
  sendResponse(res, {
    message: "Profile updated successfully",
    data: result,
  });
});

const addFollower = catchAsync(async (req, res) => {
  const user = req.user;
  const { followerId } = req.params;
  const result = await Userservices.addFollower(
    user?.userId,
    followerId as string
  );
  sendResponse(res, {
    message: "Follower added successfully",
    data: result,
  });
});

const removeFollower = catchAsync(async (req, res) => {
  const user = req.user;
  const { followerId } = req.params;
  const result = await Userservices.removeFollower(user?.userId, followerId);
  sendResponse(res, {
    message: "Follower removed successfully",
    data: result,
  });
});

const getRandomUsers = catchAsync(async (req, res) => {
  const result = await Userservices.getRandomUsers(req.query);
  sendResponse(res, {
    message: "Random users retrieved successfully",
    data: result.result,
    meta: result.meta,
  });
});
const getUsers = catchAsync(async (req, res) => {
  const userId = req?.user?.userId;
  const result = await Userservices.getRandomUsers(req.query, userId);
  sendResponse(res, {
    message: "Random users retrieved successfully",
    data: result.result,
    meta: result.meta,
  });
});

export const UserControllers = {
  getProfile,
  updateProfile,
  addFollower,
  removeFollower,
  getRandomUsers,
  getUsers,
};
