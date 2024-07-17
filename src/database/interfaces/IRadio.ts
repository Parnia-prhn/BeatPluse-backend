import { Document } from "mongoose";
interface IRadio extends Document {
  title: string;
  description: string;
  userIdCreator: string;
  created: Date;
  updated: Date;
  isDeleted: boolean;
  play: [
    {
      isPlayed: boolean;
      playDate: Date;
      counter: number;
    },
  ];
}
export { IRadio };
