import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { ILike } from "../database/interfaces/ILike";
import { Like } from "../database/models/Like";
import {
  createLike,
  getLike,
  deleteLike,
  getAllLikes,
} from "../services/likeService";
async function createLikeController(obj: ILike): Promise<ILike> {
  const userId = obj.userId;
  const songId = obj.songId;
  const playlistId = obj.playlistId;
  const albumId = obj.albumId;
  const podcastId = obj.podcastId;

  try {
    const existingLike: ILike | null = await Like.findOne({ userId, songId });
    if (existingLike) {
      throw new Error("like already exists");
    }

    const newLike: ILike = await createLike(
      userId,
      songId,
      playlistId,
      albumId,
      podcastId
    );
    return newLike;
  } catch (err) {
    throw new Error("Internal server error");
  }
}

async function deleteLikeController(req: Request, reply: Reply): Promise<void> {
  const likeId = (req.params as { id: string }).id;
  try {
    const like: ILike | null = await Like.findById(likeId);
    if (!like) {
      reply.status(404).send({ error: "like not found!" });
    }
    await deleteLike(likeId);
    reply.status(500).send({ message: "like deleted successfully!" });
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getLikeController(req: Request, reply: Reply) {
  const likeId = (req.params as { id: string }).id;
  try {
    const like: ILike | null = await Like.findById(likeId);
    if (!like) {
      reply.status(404).send({ error: "like not found!" });
    }
    const likeInfo = await getLike(likeId);
    reply.send(like);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getAllLikesController(req: Request, reply: Reply) {
  try {
    const likes = await getAllLikes();
    reply.send(likes);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
export {
  createLikeController,
  deleteLikeController,
  getLikeController,
  getAllLikesController,
};
