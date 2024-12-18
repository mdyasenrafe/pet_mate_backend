import { ObjectId } from "mongoose";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Userservices } from "./user.service";
import httpStatus from "http-status";

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
  const result = await Userservices.getRandomUsersFromDB(req.query);
  sendResponse(res, {
    message: "Random users retrieved successfully",
    data: result.result,
    meta: result.meta,
  });
});
const getUsers = catchAsync(async (req, res) => {
  const userId = req?.user?.userId;
  const result = await Userservices.getRandomUsersFromDB(req.query, userId);
  sendResponse(res, {
    message: "Random users retrieved successfully",
    data: result.result,
    meta: result.meta,
  });
});

const getUsersById = catchAsync(async (req, res) => {
  const userId = req?.params?.userId;
  const result = await Userservices.getUserFromDB(userId);
  sendResponse(res, {
    message: "Random users retrieved successfully",
    data: result,
  });
});
const getAllUsers = catchAsync(async (req, res) => {
  const { result, meta } = await Userservices.getAllUsersFromDB(req.query);
  sendResponse(res, {
    message: "get users fetched successfully",
    data: result,
    meta: meta,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await Userservices.updateUserRoleInDB(id);
  sendResponse(res, {
    message: "User role updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Userservices.deleteUserFromDB(id);
  sendResponse(res, {
    message: "User deleted successfully",
    data: null,
  });
});

export const UserControllers = {
  updateProfile,
  addFollower,
  removeFollower,
  getRandomUsers,
  getUsers,
  getUsersById,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
