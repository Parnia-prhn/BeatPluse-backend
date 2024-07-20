import { Document } from "mongoose";
interface IPlaylist extends Document {
  title: string;
  description: string;
  userIdCreator: string;
  created: Date;
  updated: Date;
  isCollaboration: boolean;
  isDeleted: boolean;
  genre: string;
  play: [
    {
      userIdPlayer: string;
      isPlayed: boolean;
      playDate: Date;
      counter: number;
    },
  ];
}
export { IPlaylist };
