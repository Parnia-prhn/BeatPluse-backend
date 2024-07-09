import mongoose from "mongoose";
import { ISubscription } from "../interfaces/ISubscription";
import { subscriptionSchema } from "../schema/subscriptionSchema";
const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);

export { Subscription };
