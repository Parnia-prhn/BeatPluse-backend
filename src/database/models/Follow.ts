import mongoose from "mongoose";
import { IFollow } from "../interfaces/IFollow";
import { followSchema } from "../schema/followSchema";
const Follow = mongoose.model<IFollow>("Follow", followSchema);

export { Follow };
