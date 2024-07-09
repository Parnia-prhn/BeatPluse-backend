import mongoose from "mongoose";
import { IPlaylistSong } from "../interfaces/IPlaylistSong";
import { playlistSongSchema } from "../schema/playlistSongSchema";
const PlaylistSong = mongoose.model<IPlaylistSong>(
  "PlaylistSong",
  playlistSongSchema
);

export { PlaylistSong };
