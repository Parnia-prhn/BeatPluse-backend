import { Schema } from "mongoose";
import { IPayment } from "../interfaces/IPayment";
const paymentSchema = new Schema<IPayment>({
  userId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: false,
  },
  currency: {
    type: String,
    requierd: false,
  },
  transactionDate: {
    type: Date,
    required: false,
  },
});

export { paymentSchema };
