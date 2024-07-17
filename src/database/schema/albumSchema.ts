import { Schema } from "mongoose";
import { IAlbum } from "../interfaces/IAlbum";
const albumSchema = new Schema<IAlbum>({
  title: {
    type: String,
    required: false,
  },
  artistId: {
    type: String,
    required: false,
  },
  releaseDate: {
    type: Date,
    required: false,
  },
  coverPicture: {
    type: String,
    required: false,
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

export { albumSchema };
