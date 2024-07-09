import { Schema } from "mongoose";
import { IArtist } from "../interfaces/IArtist";
const artistSchema = new Schema<IArtist>({
  name: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  profilePicture: {
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

export { artistSchema };
