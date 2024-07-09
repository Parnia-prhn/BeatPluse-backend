import mongoose from "mongoose";
import { ILike } from "../interfaces/ILike";
import { likeSchema } from "../schema/likeSchema";
const Like = mongoose.model<ILike>("Like", likeSchema);

export { Like };
