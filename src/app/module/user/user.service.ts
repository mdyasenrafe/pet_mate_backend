import { Types, startSession } from "mongoose";
import { UserModel } from "./user.model";
import { TUser } from "./user.types";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { AppError } from "../../errors/AppError";
import QueryBuilder from "../../builder/queryBuilder";

const getUserFromDB = async (id: Types.ObjectId | string) => {
  const result = await UserModel.findById(id)
    .populate("followers")
    .populate("following");

  return result;
};

const updateUserIntoDB = async (
  currentUser: JwtPayload,
  payload: Partial<TUser>
) => {
  const { userId, role } = currentUser;
  if ("role" in payload) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Role cannot be updated. Please remove the role field from the request body if you wish to proceed."
    );
  }
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 12);
  }
  const result = await UserModel.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  })
    .populate("followers")
    .populate("following");
  return result;
};

const addFollower = async (
  userId: Types.ObjectId,
  followerId: string | Types.ObjectId
) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found.");
    }

    const follower = await UserModel.findById(followerId).session(session);
    if (!follower) {
      throw new AppError(httpStatus.NOT_FOUND, "Follower not found.");
    }

    const isAlreadyFollowing = user.following.includes(
      followerId as Types.ObjectId
    );

    if (!isAlreadyFollowing) {
      await UserModel.findByIdAndUpdate(
        userId,
        { $push: { following: followerId } },
        { new: true, runValidators: true, session }
      );
      await UserModel.findByIdAndUpdate(
        followerId,
        { $push: { followers: userId } },
        { new: true, runValidators: true, session }
      );
    } else {
      const errorMessage = isAlreadyFollowing
        ? "User is already a follower."
        : "User is already being followed.";
      throw new AppError(httpStatus.BAD_REQUEST, errorMessage);
    }

    await session.commitTransaction();
    const response = await UserModel.findById(userId)
      .populate("followers")
      .populate("following")
      .session(session);
    return response;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const removeFollower = async (
  userId: Types.ObjectId,
  followerId: string | Types.ObjectId
) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found.");
    }

    const follower = await UserModel.findById(followerId).session(session);
    if (!follower) {
      throw new AppError(httpStatus.NOT_FOUND, "Follower not found.");
    }

    await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { following: followerId, followers: followerId } },
      { new: true, runValidators: true, session }
    );

    await UserModel.findByIdAndUpdate(
      followerId,
      { $pull: { followers: userId, following: userId } },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    const response = await UserModel.findById(userId)
      .populate("followers")
      .populate("following")
      .session(session);
    return response;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getRandomUsersFromDB = async (
  query: Record<string, unknown>,
  userId?: string
) => {
  const searchableFields = ["name"];
  let userFilter: Record<string, unknown> = {};

  if (userId) {
    userFilter = { _id: { $ne: userId } };
  }

  const queryBuilder = new QueryBuilder(UserModel.find(userFilter), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await queryBuilder.countTotal();
  const result = await queryBuilder.modelQuery;
  console.log("result => ", result);
  // anotther way to result
  const result2 = await UserModel.find();
  console.log("result 2=> ", result2);
  return {
    result,
    meta,
  };
};
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const searchableFields = ["name"];
  const usersQuery = new QueryBuilder(UserModel.find({ role: "user" }), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await usersQuery.modelQuery;
  const meta = await usersQuery.countTotal();
  console.log("meta", meta);
  return {
    meta,
    result,
  };
};

const updateUserRoleInDB = async (id: string) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await UserModel.findByIdAndUpdate(
    id,
    { role: "admin" },
    {
      new: true,
      runValidators: true,
    }
  );
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const result = await UserModel.findByIdAndUpdate(
    id,
    { status: "deleted" },
    { new: true }
  );
  return result;
};

export const Userservices = {
  getUserFromDB,
  updateUserIntoDB,
  addFollower,
  removeFollower,
  getRandomUsersFromDB,
  getAllUsersFromDB,
  updateUserRoleInDB,
  deleteUserFromDB,
};
