import { Schema } from "mongoose";
import { IUser } from "../interfaces/IUser";
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  created: {
    type: Date,
    required: false,
  },
  updated: {
    type: Date,
    required: false,
  },

  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
  otp: {
    type: String,
    required: false,
  },
  otpExpire: {
    type: Date,
    required: false,
  },
});

export { userSchema };
