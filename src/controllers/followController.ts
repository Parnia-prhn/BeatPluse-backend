import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { IFollow } from "../database/interfaces/IFollow";
import { Follow } from "../database/models/Follow";
import { getFollow, getAllFollows } from "../services/followService";
import { getAsync, setAsync } from "../configs/redisClient";

async function FollowUserController(req: Request, reply: Reply): Promise<void> {
  interface ParamsType {
    followerId?: string;
    followedId?: string;
  }

  const params = req.params as ParamsType;
  const followerId = params.followerId;
  const followedId = params.followedId;

  try {
    if (!followedId) {
      reply.status(400).send({
        error: "User ID that you want to follow is missing from the request.",
      });
      return;
    }

    let followUserCache = await getAsync(`follow:${followerId}`);
    let followUser: IFollow | null = null;

    if (followUserCache) {
      followUser = JSON.parse(followUserCache);
    } else {
      followUser = await Follow.findById(followerId);
      if (!followUser) {
        followUser = new Follow({
          followerId,
          followedId: [],
          isDeleted: false,
        });
      }
      await setAsync(
        `follow:${followerId}`,
        JSON.stringify(followUser),
        "EX",
        3600
      );
    }

    if (followUser) {
      const followedIndex = followUser.followedId.indexOf(followedId);
      if (followedIndex > -1) {
        followUser.followedId.splice(followedIndex, 1);
      } else {
        followUser.followedId.push(followedId);
      }

      const updatedFollowUser = await followUser.save();
      await setAsync(
        `follow:${followerId}`,
        JSON.stringify(updatedFollowUser),
        "EX",
        3600
      );
      reply.status(200).send(updatedFollowUser);
    } else {
      reply.status(404).send({
        error: "Follow user record not found or couldn't be created.",
      });
    }
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function getFollowController(req: Request, reply: Reply) {
  const followId = (req.params as { id: string }).id;
  try {
    const follow: IFollow | null = await Follow.findById(followId);
    if (!follow || follow.isDeleted) {
      reply.status(404).send({ error: "follow not found!" });
    }
    const followInfo = await getFollow(followId);
    reply.send(follow);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getAllFollowsController(req: Request, reply: Reply) {
  try {
    const follows = await getAllFollows();
    reply.send(follows);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
export { FollowUserController, getFollowController, getAllFollowsController };
