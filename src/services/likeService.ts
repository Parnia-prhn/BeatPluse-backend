import { getAsync, setAsync, delAsync } from "../configs/redisClient";
import { Like } from "../database/models/Like";
import { ILike } from "../database/interfaces/ILike";

async function createLike(
  userId: string,
  songId: string | null,
  playlistId: string | null,
  albumId: string | null,
  podcastId: string | null
): Promise<ILike> {
  const like = new Like({
    userId,
    songId,
    playlistId,
    albumId,
    podcastId,
  });
  await like.save();
  return like;
}
async function getLike(likeId: string): Promise<ILike | null> {
  let like = await getAsync(`like:${likeId}`);
  if (like) {
    return JSON.parse(like) as ILike;
  }
  like = await Like.findById(likeId).exec();
  if (like) {
    await setAsync(`like:${likeId}`, JSON.stringify(like), "EX", 3600);
  }
  return like;
}

async function deleteLike(likeId: string): Promise<void> {
  const like = await Like.findByIdAndUpdate(likeId, { isDeleted: true }).exec();
  await delAsync(`like:${likeId}`);
}
async function getAllLikes(): Promise<ILike[]> {
  return Like.find().exec();
}
export { createLike, getLike, deleteLike, getAllLikes };
