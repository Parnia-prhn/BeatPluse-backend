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
  isCollaboration: {
    type: Boolean,
    required: false,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
  play: [
    {
      isPlayed: {
        type: Boolean,
        required: false,
        default: false,
      },
      playDate: {
        type: Date,
        required: false,
      },
      counter: {
        type: Number,
        required: false,
        default: 0,
      },
    },
  ],
});

export { playlistSchema };
