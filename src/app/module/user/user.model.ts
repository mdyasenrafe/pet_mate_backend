import { Schema, model } from "mongoose";
import { TUser } from "./user.types";
import bcrypt from "bcrypt";
import { UserRolesArray, UserStatusArray } from "./user.constant";

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: UserRolesArray,
      default: "user",
    },
    profilePicture: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: UserStatusArray,
      default: "active",
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    isPremium: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(user.password, 12);
  next();
});

userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

export const UserModel = model<TUser>("user", userSchema);
