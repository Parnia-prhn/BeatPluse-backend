import { Document } from "mongoose";
interface ILike extends Document {
  userId: string;
  songId: string[];
  playlistId: string[];
  albumId: string[];
  podcastId: string[];
}
export { ILike };
