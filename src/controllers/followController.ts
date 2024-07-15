import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { IFollow } from "../database/interfaces/IFollow";
import { Follow } from "../database/models/Follow";
import {
  createFollow,
  getFollow,
  deleteFollow,
  getAllFollows,
} from "../services/followService";
async function createFollowController(obj: IFollow): Promise<IFollow> {
  const followerId = obj.followerId;
  const followedId = obj.followedId;

  try {
    const existingFollow: IFollow | null = await Follow.findOne({
      followerId,
      followedId,
    });
    if (existingFollow) {
      throw new Error("email already exists");
    }

    const newFollow: IFollow = await createFollow(followerId, followedId);
    return newFollow;
  } catch (err) {
    throw new Error("Internal server error");
  }
}
async function deleteFollowController(
  req: Request,
  reply: Reply
): Promise<void> {
  const followId = (req.params as { id: string }).id;
  try {
    const follow: IFollow | null = await Follow.findById(followId);
    if (!follow || follow.isDeleted) {
      reply.status(404).send({ error: "follow not found!" });
    }
    await deleteFollow(followId);
    reply.status(500).send({ message: "follow deleted successfully!" });
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
export {
  createFollowController,
  deleteFollowController,
  getFollowController,
  getAllFollowsController,
};
