import { Schema } from "mongoose";
import { ISong } from "../interfaces/ISong";
const songSchema = new Schema<ISong>({
  title: {
    type: String,
    required: false,
  },
  artistId: {
    type: String,
    required: false,
  },
  albumId: {
    type: String,
    required: false,
  },
  genreId: {
    type: String,
    required: false,
  },
  duration: {
    type: String,
    required: false,
  },
  coverPicture: {
    type: String,
    requierd: false,
  },
  fileUrl: {
    type: String,
    requierd: false,
  },
  lyrics: {
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
  isPlaying: {
    type: Boolean,
    required: false,
    default: false,
  },
  play: [
    {
      userIdPlayer: {
        type: String,
        required: false,
      },
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

export { songSchema };
