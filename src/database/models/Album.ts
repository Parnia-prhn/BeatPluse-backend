import mongoose from "mongoose";
import { IAlbum } from "../interfaces/IAlbum";
import { albumSchema } from "../schema/albumSchema";
const Album = mongoose.model<IAlbum>("Album", albumSchema);

export { Album };
