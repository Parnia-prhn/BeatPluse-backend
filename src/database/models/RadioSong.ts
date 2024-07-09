import mongoose from "mongoose";
import { IRadioSong } from "../interfaces/IRadioSong";
import { radioSongSchema } from "../schema/radioSongSchema";
const RadioSong = mongoose.model<IRadioSong>("RadioSong", radioSongSchema);

export { RadioSong };
