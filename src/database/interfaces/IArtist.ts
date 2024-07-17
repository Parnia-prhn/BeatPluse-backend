import { Document } from "mongoose";

interface IArtist extends Document {
  name: string;
  description: string;
  profilePicture: string;
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
export { IArtist };
