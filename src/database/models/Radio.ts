import mongoose from "mongoose";
import { IRadio } from "../interfaces/IRadio";
import { radioSchema } from "../schema/radioSchema";
const Radio = mongoose.model<IRadio>("Radio", radioSchema);

export { Radio };
