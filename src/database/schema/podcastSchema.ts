import { Schema } from "mongoose";
import { IPodcast } from "../interfaces/IPodcast";
const podcastSchema = new Schema<IPodcast>({
  title: {
    type: String,
    required: false,
  },
  hostId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    requierd: false,
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
});

export { podcastSchema };
