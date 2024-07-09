import mongoose from "mongoose";
import { IGenre } from "../interfaces/IGenre";
import { genreSchema } from "../schema/genreSchema";
const Genre = mongoose.model<IGenre>("Genre", genreSchema);

export { Genre };
