import { Document } from "mongoose";
interface IAlbum extends Document {
  title: string;
  artistId: string;
  releaseDate: Date;
  coverPicture: string;
  created: Date;
  updated: Date;
  isDeleted: boolean;
  play: [
    {
      userIdPlayer: string;
      isPlayed: boolean;
      playDate: Date;
      counter: number;
    },
  ];
}
export { IAlbum };
