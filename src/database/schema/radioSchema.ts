import { Schema } from "mongoose";
import { IRadio } from "../interfaces/IRadio";
const radioSchema = new Schema<IRadio>({
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  userIdCreator: {
    type: String,
    requierd: false,
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
  play: [
    {
      isPlayed: {
        type: Boolean,
        required: false,
        default: false,
      },
      playDate: {
        type: Date,
        required: false,
      },
      counter: {
        type: Number,
        required: false,
        default: 0,
      },
    },
  ],
});

export { radioSchema };
