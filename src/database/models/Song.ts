import mongoose from "mongoose";
import { ISong } from "../interfaces/ISong";
import { songSchema } from "../schema/songSchema";
const Song = mongoose.model<ISong>("Song", songSchema);

export { Song };
