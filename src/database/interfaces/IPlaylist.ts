import { Document } from "mongoose";
interface IPlaylist extends Document {
  title: string;
  description: string;
  userIdCreator: string;
  created: Date;
  updated: Date;
  isDeleted: boolean;
}
export { IPlaylist };
