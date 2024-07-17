import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { ILike } from "../database/interfaces/ILike";
import { Like } from "../database/models/Like";
import { getAsync, setAsync } from "../configs/redisClient";

async function LikeSongController(req: Request, reply: Reply): Promise<void> {
  interface ParamsType {
    userId?: string;
    songId?: string;
  }
  const params = req.params as ParamsType;
  const userId = params.userId;
  const songId = params.songId;
  try {
    if (!songId) {
      reply.status(400).send({ error: "song id is missing from the request" });
      return;
    }
    let userLikeCache = await getAsync(`userLike:${userId}`);
    let userLike;
    if (userLikeCache) {
      userLike = JSON.parse(userLikeCache);
    } else {
      userLike = await Like.findById(userId);
      if (!userLike) {
        userLike = new Like({
          userId,
        });
      }
      await setAsync(
        `userLike:${userId}`,
        JSON.stringify(userLike),
        "EX",
        3600
      );
    }

    const songIndex = userLike.songId.indexOf(songId);
    if (songIndex > -1) {
      userLike.songId.splice(songIndex, 1);
    } else {
      userLike.songId.push(songId);
    }

    const updatedUserLike = await userLike.save();
    await setAsync(
      `userLike:${userId}`,
      JSON.stringify(updatedUserLike),
      "EX",
      3600
    );
    reply.status(200).send(updatedUserLike);
  } catch (err) {
    throw new Error("Internal server error");
  }
}
async function LikePlaylistController(
  req: Request,
  reply: Reply
): Promise<void> {
  interface ParamsType {
    userId?: string;
    playlistId?: string;
  }
  const params = req.params as ParamsType;
  const userId = params.userId;
  const playlistId = params.playlistId;
  try {
    if (!playlistId) {
      reply
        .status(400)
        .send({ error: "playlist id is missing from the request" });
      return;
    }
    let userLikeCache = await getAsync(`userLike:${userId}`);
    let userLike;
    if (userLikeCache) {
      userLike = JSON.parse(userLikeCache);
    } else {
      userLike = await Like.findById(userId);
      if (!userLike) {
        userLike = new Like({
          userId,
        });
      }
      await setAsync(
        `userLike:${userId}`,
        JSON.stringify(userLike),
        "EX",
        3600
      );
    }

    const playlistIndex = userLike.playlistId.indexOf(playlistId);
    if (playlistIndex > -1) {
      userLike.playlistId.splice(playlistIndex, 1);
    } else {
      userLike.playlistId.push(playlistId);
    }

    const updatedUserLike = await userLike.save();
    await setAsync(
      `userLike:${userId}`,
      JSON.stringify(updatedUserLike),
      "EX",
      3600
    );
    reply.status(200).send(updatedUserLike);
  } catch (err) {
    throw new Error("Internal server error");
  }
}

async function LikeAlbumController(req: Request, reply: Reply): Promise<void> {
  interface ParamsType {
    userId?: string;
    albumId?: string;
  }
  const params = req.params as ParamsType;
  const userId = params.userId;
  const albumId = params.albumId;
  try {
    if (!albumId) {
      reply.status(400).send({ error: "album id is missing from the request" });
      return;
    }
    let userLikeCache = await getAsync(`userLike:${userId}`);
    let userLike;
    if (userLikeCache) {
      userLike = JSON.parse(userLikeCache);
    } else {
      userLike = await Like.findById(userId);
      if (!userLike) {
        userLike = new Like({
          userId,
        });
      }
      await setAsync(
        `userLike:${userId}`,
        JSON.stringify(userLike),
        "EX",
        3600
      );
    }

    const albumIndex = userLike.albumId.indexOf(albumId);
    if (albumIndex > -1) {
      userLike.albumId.splice(albumIndex, 1);
    } else {
      userLike.albumId.push(albumId);
    }

    const updatedUserLike = await userLike.save();
    await setAsync(
      `userLike:${userId}`,
      JSON.stringify(updatedUserLike),
      "EX",
      3600
    );
    reply.status(200).send(updatedUserLike);
  } catch (err) {
    throw new Error("Internal server error");
  }
}
async function LikePodcastController(
  req: Request,
  reply: Reply
): Promise<void> {
  interface ParamsType {
    userId?: string;
    podcastId?: string;
  }
  const params = req.params as ParamsType;
  const userId = params.userId;
  const podcastId = params.podcastId;
  try {
    if (!podcastId) {
      reply
        .status(400)
        .send({ error: "podcast id is missing from the request" });
      return;
    }
    let userLikeCache = await getAsync(`userLike:${userId}`);
    let userLike;
    if (userLikeCache) {
      userLike = JSON.parse(userLikeCache);
    } else {
      userLike = await Like.findById(userId);
      if (!userLike) {
        userLike = new Like({
          userId,
        });
      }
      await setAsync(
        `userLike:${userId}`,
        JSON.stringify(userLike),
        "EX",
        3600
      );
    }

    const podcastIndex = userLike.podcastId.indexOf(podcastId);
    if (podcastIndex > -1) {
      userLike.podcastId.splice(podcastIndex, 1);
    } else {
      userLike.podcastId.push(podcastId);
    }

    const updatedUserLike = await userLike.save();
    await setAsync(
      `userLike:${userId}`,
      JSON.stringify(updatedUserLike),
      "EX",
      3600
    );
    reply.status(200).send(updatedUserLike);
  } catch (err) {
    throw new Error("Internal server error");
  }
}

async function getLikeController(req: Request, reply: Reply) {
  const userId = (req.params as { id: string }).id;
  try {
    const like: ILike | null = await Like.findById(userId);
    if (!like) {
      reply.status(404).send({ error: "user not found!" });
    }
    let likeInfo = await getAsync(`userLike:${userId}`);
    if (likeInfo) {
      return JSON.parse(likeInfo) as ILike;
    } else {
      likeInfo = await Like.findById(userId).exec();
      if (likeInfo) {
        await setAsync(
          `userLike:${userId}`,
          JSON.stringify(likeInfo),
          "EX",
          3600
        );
      }
    }
    reply.send(like);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

export {
  LikeSongController,
  LikeAlbumController,
  LikePlaylistController,
  LikePodcastController,
  getLikeController,
};
