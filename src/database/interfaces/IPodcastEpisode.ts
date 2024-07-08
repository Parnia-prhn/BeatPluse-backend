import { Document } from "mongoose";
interface IPodcastEpisode extends Document {
  podcastId: string;
  title: string;
  description: string;
  duration: string;
  fileUrl: string;
  releaseDate: Date;
  isDeleted: boolean;
}
export { IPodcastEpisode };
