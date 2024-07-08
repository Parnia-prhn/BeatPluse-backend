import { Document } from "mongoose";
interface IPayment extends Document {
  userId: string;
  amount: number;
  currency: string;
  transactionDate: Date;
}
export { IPayment };
