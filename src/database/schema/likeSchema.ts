import { Schema } from "mongoose";
import { ILike } from "../interfaces/ILike";
const likeSchema = new Schema<ILike>({
  userId: {
    type: String,
    required: true,
  },
  song: [
    {
      songId: {
        type: String,
        required: false,
      },
      isLiked: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
  ],
  playlist: [
    {
      playlistId: {
        type: String,
        required: false,
      },
      isLiked: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
  ],
  album: [
    {
      albumId: {
        type: String,
        required: false,
      },
      isLiked: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
  ],
  podcast: [
    {
      podcastId: {
        type: String,
        required: false,
      },
      isLiked: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
  ],
});

export { likeSchema };
