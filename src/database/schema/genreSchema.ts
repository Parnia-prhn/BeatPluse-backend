import { Schema } from "mongoose";
import { IGenre } from "../interfaces/IGenre";
const genreSchema = new Schema<IGenre>({
  name: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  created: {
    type: Date,
    required: false,
  },
  updated: {
    type: Date,
    required: false,
  },

  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});

export { genreSchema };
