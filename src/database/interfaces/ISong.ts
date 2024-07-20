import { Document } from "mongoose";

interface ISong extends Document {
  title: string;
  artistId: string;
  albumId: string;
  genreId: string;
  duration: string;
  coverPicture: string;
  fileUrl: string;
  lyrics: string;
  created: Date;
  updated: Date;
  isDeleted: boolean;
  isPlaying: boolean;
  play: [
    {
      userIdPlayer: string;
      isPlayed: boolean;
      playDate: Date;
      counter: number;
    },
  ];
}
export { ISong };
