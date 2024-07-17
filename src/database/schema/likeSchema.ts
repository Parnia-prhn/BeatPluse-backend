import { Schema } from "mongoose";
import { ILike } from "../interfaces/ILike";
const likeSchema = new Schema<ILike>({
  userId: {
    type: String,
    required: true,
  },
  songId: [
    {
      type: String,
      required: false,
    },
  ],

  playlistId: [
    {
      type: String,
      required: false,
    },
  ],
  albumId: [
    {
      type: String,
      required: false,
    },
  ],

  podcastId: [
    {
      type: String,
      required: false,
    },
  ],
});

export { likeSchema };
