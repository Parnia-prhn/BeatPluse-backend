import mongoose from "mongoose";
import { INotification } from "../interfaces/INotification";
import { notificationSchema } from "../schema/notificationSchema";
const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export { Notification };
