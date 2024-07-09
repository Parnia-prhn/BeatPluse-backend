import mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";
import { userSchema } from "../schema/userSchema";
const User = mongoose.model<IUser>("User", userSchema);

export { User };
