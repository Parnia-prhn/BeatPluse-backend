import mongoose from "mongoose";
import { IPodcast } from "../interfaces/IPodcast";
import { podcastSchema } from "../schema/podcastSchema";
const Podcast = mongoose.model<IPodcast>("Podcast", podcastSchema);

export { Podcast };
