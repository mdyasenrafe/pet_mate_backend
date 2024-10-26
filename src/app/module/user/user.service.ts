import { Types, startSession } from "mongoose";
import { UserModel } from "./user.model";
import { TUser } from "./user.types";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { AppError } from "../../errors/AppError";
import QueryBuilder from "../../builder/queryBuilder";

const getUserFromDB = async (id: Types.ObjectId) => {
  const result = await UserModel.findById(id);
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
  });
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

    const isAlreadyFollowing = user.followers.includes(
      followerId as Types.ObjectId
    );
    const isAlreadyFollowedBy = follower.following.includes(userId);

    if (!isAlreadyFollowing && !isAlreadyFollowedBy) {
      await UserModel.findByIdAndUpdate(
        userId,
        { $push: { followers: followerId } },
        { new: true, runValidators: true, session }
      );
      await UserModel.findByIdAndUpdate(
        followerId,
        { $push: { following: userId } },
        { new: true, runValidators: true, session }
      );
    } else {
      const errorMessage = isAlreadyFollowing
        ? "User is already a follower."
        : "User is already being followed.";
      throw new AppError(httpStatus.BAD_REQUEST, errorMessage);
    }

    await session.commitTransaction();
    return user;
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
      { $pull: { followers: followerId } },
      { new: true, runValidators: true, session }
    );

    await UserModel.findByIdAndUpdate(
      followerId,
      { $pull: { following: userId } },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    return await UserModel.findById(userId).populate("followers");
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getRandomUsers = async (
  query: Record<string, unknown>,
  userId?: string
) => {
  let userFilter: Record<string, unknown> = {};

  if (userId) {
    userFilter = { _id: { $ne: userId } };
  }

  const queryBuilder = new QueryBuilder(UserModel.find(userFilter), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await queryBuilder.countTotal();
  const result = await queryBuilder.modelQuery;
  return {
    result,
    meta,
  };
};

export const Userservices = {
  getUserFromDB,
  updateUserIntoDB,
  addFollower,
  removeFollower,
  getRandomUsers,
};
