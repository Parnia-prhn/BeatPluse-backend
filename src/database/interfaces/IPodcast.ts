import { Document } from "mongoose";
interface IPodcast extends Document {
  title: string;
  hostId: string;
  description: string;
  coverPicture: string;
  created: Date;
  updated: Date;
  isDeleted: boolean;
}
export { IPodcast };
