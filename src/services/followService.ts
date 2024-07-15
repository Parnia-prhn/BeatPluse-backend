import { getAsync, setAsync, delAsync } from "../configs/redisClient";
import { Follow } from "../database/models/Follow";
import { IFollow } from "../database/interfaces/IFollow";

async function createFollow(
  followerId: string,
  followedId: string
): Promise<IFollow> {
  const follow = new Follow({
    followerId,
    followedId,
  });
  await follow.save();
  return follow;
}
async function getFollow(followId: string): Promise<IFollow | null> {
  let follow = await getAsync(`follow:${followId}`);
  if (follow) {
    return JSON.parse(follow) as IFollow;
  }
  follow = await Follow.findById(followId).exec();
  if (follow) {
    await setAsync(`follow:${followId}`, JSON.stringify(follow), "EX", 3600);
  }
  return follow;
}

async function deleteFollow(followId: string): Promise<void> {
  const follow = await Follow.findByIdAndUpdate(followId, {
    isDeleted: true,
  }).exec();
  await delAsync(`follow:${followId}`);
}
async function getAllFollows(): Promise<IFollow[]> {
  return Follow.find().exec();
}
export { createFollow, getFollow, deleteFollow, getAllFollows };
