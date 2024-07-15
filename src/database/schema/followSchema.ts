import { Schema } from "mongoose";
import { IFollow } from "../interfaces/IFollow";
const followSchema = new Schema<IFollow>({
  followerId: {
    type: String,
    required: true,
  },
  followedId: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});

export { followSchema };
