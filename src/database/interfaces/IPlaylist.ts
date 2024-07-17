import { Document } from "mongoose";
interface IPlaylist extends Document {
  title: string;
  description: string;
  userIdCreator: string;
  created: Date;
  updated: Date;
  isCollaboration: boolean;
  isDeleted: boolean;
  play: [
    {
      isPlayed: boolean;
      playDate: Date;
      counter: number;
    },
  ];
}
export { IPlaylist };
