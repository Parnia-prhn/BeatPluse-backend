import { Schema } from "mongoose";
import { ISubscription } from "../interfaces/ISubscription";

const subscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },

  startDate: {
    type: Date,
    required: false,
  },
  endDate: {
    type: Date,
    required: false,
  },
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});

export { subscriptionSchema };
