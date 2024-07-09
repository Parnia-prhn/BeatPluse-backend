import { Schema } from "mongoose";
import { IFollow } from "../interfaces/IFollow";
const followSchema = new Schema<IFollow>({
  followerId: {
    type: String,
    required: false,
  },
  followedId: {
    type: String,
    required: false,
  },
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});

export { followSchema };
