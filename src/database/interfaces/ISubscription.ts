import { Document } from "mongoose";
interface ISubscription extends Document {
  userId: string;
  type: string;
  status: string;
  startDate: Date;
  endDate: Date;
  isDeleted: boolean;
}
export { ISubscription };
