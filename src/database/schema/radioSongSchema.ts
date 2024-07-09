import { Schema } from "mongoose";
import { IRadioSong } from "../interfaces/IRadioSong";
const radioSongSchema = new Schema<IRadioSong>({
  radioId: {
    type: String,
    required: false,
  },
  songId: {
    type: String,
    required: false,
  },
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});

export { radioSongSchema };
