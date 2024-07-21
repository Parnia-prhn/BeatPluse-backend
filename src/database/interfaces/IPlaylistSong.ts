import { Document } from "mongoose";
interface IPlaylistSong extends Document {
  playlistId: string;
  songs: [
    {
      songId: string;
      isDeleted: boolean;
    },
  ];
}
export { IPlaylistSong };
