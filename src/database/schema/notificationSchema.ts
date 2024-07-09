import { Schema } from "mongoose";
import { INotification } from "../interfaces/INotification";
const notificationSchema = new Schema<INotification>({
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    requierd: false,
  },
  isRead: {
    type: Boolean,
    required: false,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});

export { notificationSchema };
