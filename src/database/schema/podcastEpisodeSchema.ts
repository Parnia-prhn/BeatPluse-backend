import { Schema } from "mongoose";
import { IPodcastEpisode } from "../interfaces/IPodcastEpisode";
const podcastEpisodeSchema = new Schema<IPodcastEpisode>({
  podcastId: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    requierd: false,
  },
  duration: {
    type: String,
    required: false,
  },
  fileUrl: {
    type: String,
    required: false,
  },
  releaseDate: {
    type: Date,
    required: false,
  },
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});

export { podcastEpisodeSchema };
