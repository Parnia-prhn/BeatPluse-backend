import mongoose from "mongoose";
import { IPlaylist } from "../interfaces/IPlaylist";
import { playlistSchema } from "../schema/playlistSchema";
const Playlist = mongoose.model<IPlaylist>("Playlist", playlistSchema);

export { Playlist };
