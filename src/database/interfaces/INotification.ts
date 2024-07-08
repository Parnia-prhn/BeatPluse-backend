import { Document } from "mongoose";
interface INotification extends Document {
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  isDeleted: boolean;
}
export { INotification };
