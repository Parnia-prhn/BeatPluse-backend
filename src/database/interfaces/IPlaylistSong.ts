import { Document } from "mongoose";
interface IPlaylistSong extends Document {
  playlistId: string;
  songId: string;
  isDeleted: boolean;
}
export { IPlaylistSong };
