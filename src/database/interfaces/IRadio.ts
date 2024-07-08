import { Document } from "mongoose";
interface IRadio extends Document {
  title: string;
  description: string;
  userIdCreator: string;
  created: Date;
  updated: Date;
  isDeleted: boolean;
}
export { IRadio };
