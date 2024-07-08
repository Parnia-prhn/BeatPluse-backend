import { Document } from "mongoose";
interface IFollow extends Document {
  followerId: string;
  followedId: string;
  isDeleted: boolean;
}
export { IFollow };
