import mongoose from "mongoose";
import { IArtist } from "../interfaces/IArtist";
import { artistSchema } from "../schema/artistSchema";
const Artist = mongoose.model<IArtist>("Artist", artistSchema);

export { Artist };
