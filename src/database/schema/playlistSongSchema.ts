import { Schema } from "mongoose";
import { IPlaylistSong } from "../interfaces/IPlaylistSong";
const playlistSongSchema = new Schema<IPlaylistSong>({
  playlistId: {
    type: String,
    required: false,
  },
  songId: {
    type: String,
    required: false,
  },
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});

export { playlistSongSchema };
