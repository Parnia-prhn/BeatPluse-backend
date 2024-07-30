import { Document } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  dateOfBirth: Date;
  created: Date;
  updated: Date;
  isDeleted: boolean;
  otp: string;
  otpExpires: Date;
}
export { IUser };
