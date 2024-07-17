import { Document } from "mongoose";
interface ILike extends Document {
  userId: string;
  song: [
    {
      songId: string;
      isLiked: boolean;
    },
  ];
  playlist: [
    {
      playlistId: string;
      isLiked: boolean;
    },
  ];
  album: [
    {
      albumId: string;
      isLiked: boolean;
    },
  ];
  podcast: [
    {
      podcastId: string;
      isLiked: boolean;
    },
  ];
}
export { ILike };
