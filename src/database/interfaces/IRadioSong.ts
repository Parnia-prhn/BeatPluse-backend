import { Document } from "mongoose";
interface IRadioSong extends Document {
  radioId: string;
  songId: string;
  isDeleted: boolean;
}
export { IRadioSong };
