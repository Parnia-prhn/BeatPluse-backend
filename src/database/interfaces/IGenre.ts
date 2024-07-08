import { Document } from "mongoose";
interface IGenre extends Document {
  name: string;
  description: string;
  created: Date;
  updated: Date;
  isDeleted: boolean;
}
export { IGenre };
