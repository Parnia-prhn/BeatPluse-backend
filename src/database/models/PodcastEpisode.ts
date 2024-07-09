import mongoose from "mongoose";
import { IPodcastEpisode } from "../interfaces/IPodcastEpisode";
import { podcastEpisodeSchema } from "../schema/podcastEpisodeSchema";
const PodcastEpisode = mongoose.model<IPodcastEpisode>(
  "PodcastEpisode",
  podcastEpisodeSchema
);

export { PodcastEpisode };
