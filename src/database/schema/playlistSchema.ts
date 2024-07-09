import { Schema } from "mongoose";
import { IPlaylist } from "../interfaces/IPlaylist";
const playlistSchema = new Schema<IPlaylist>({
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  userIdCreator: {
    type: String,
    requierd: false,
  },
  created: {
    type: Date,
    required: false,
  },
  updated: {
    type: Date,
    required: false,
  },

  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});

export { playlistSchema };
