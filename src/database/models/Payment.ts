import mongoose from "mongoose";
import { IPayment } from "../interfaces/IPayment";
import { paymentSchema } from "../schema/paymentSchema";
const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

export { Payment };
