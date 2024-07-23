import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { IPodcast } from "../database/interfaces/IPodcast";
import { Podcast } from "../database/models/Podcast";
import {
  createPodcast,
  updatePodcast,
  getPodcast,
  deletePodcast,
  getAllPodcasts,
} from "../services/podcastService";
import { IUser } from "../database/interfaces/IUser";
import { User } from "../database/models/User";
import { ILike } from "../database/interfaces/ILike";
import { Like } from "../database/models/Like";
import { IPodcastEpisode } from "../database/interfaces/IPodcastEpisode";
import { PodcastEpisode } from "../database/models/PodcastEpisode";
async function createPodcastController(obj: IPodcast): Promise<IPodcast> {
  const title = obj.title;
  const hostId = obj.hostId;
  const description = obj.description;
  const coverPicture = obj.coverPicture;

  try {
    const existingPodcast: IPodcast | null = await Podcast.findOne({
      title,
      hostId,
    });
    if (existingPodcast) {
      throw new Error("podcast already exists");
    }

    const newPodcast: IPodcast = await createPodcast(
      title,
      hostId,
      description,
      coverPicture
    );
    return newPodcast;
  } catch (err) {
    throw new Error("Internal server error");
  }
}
async function updatePodcastController(
  req: Request,
  reply: Reply
): Promise<void> {
  const podcastId = (req.params as { id: string }).id;
  const updates = req.body as Partial<IPodcast>;
  try {
    const podcast: IPodcast | null = await Podcast.findById(podcastId);
    if (!podcast || podcast.isDeleted) {
      reply.status(404).send({ error: "Podcast not found" });
      return;
    }
    const updatedPodcast: IPodcast | null = await updatePodcast(
      podcastId,
      updates
    );
    reply.status(200).send(updatedPodcast);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function deletePodcastController(
  req: Request,
  reply: Reply
): Promise<void> {
  const podcastId = (req.params as { id: string }).id;
  try {
    const podcast: IPodcast | null = await Podcast.findById(podcastId);
    if (!podcast || podcast.isDeleted) {
      reply.status(404).send({ error: "podcast not found!" });
    }
    await deletePodcast(podcastId);
    reply.status(500).send({ message: "podcast deleted successfully!" });
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getPodcastController(req: Request, reply: Reply) {
  const podcastId = (req.params as { id: string }).id;
  try {
    const podcast: IPodcast | null = await Podcast.findById(podcastId);
    if (!podcast || podcast.isDeleted) {
      reply.status(404).send({ error: "podcast not found!" });
    }
    const podcastInfo = await getPodcast(podcastId);
    reply.send(podcast);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getAllPodcastsController(req: Request, reply: Reply) {
  try {
    const podcasts = await getAllPodcasts();
    reply.send(podcasts);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getRecentlyPlayedPodcast(req: Request, reply: Reply) {
  const userId = (req.params as { id: string }).id;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "User not found" });
      return;
    }
    const podcasts: IPodcast[] | null = await Podcast.find({
      "play.userIdPlayer": userId,
      isDeleted: false,
    })
      .sort({ "play.playDate": -1 })
      .limit(5)
      .exec();

    if (!podcasts || podcasts.length === 0) {
      reply.status(404).send({ error: "User hasn't played any podcasts yet" });
      return;
    }
    reply.status(200).send(podcasts);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function getMostPlayedPodcastByUser(req: Request, reply: Reply) {
  const userId = (req.params as { id: string }).id;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "User not found" });
      return;
    }
    const podcasts: IPodcast[] | null = await Podcast.find({
      "play.userIdPlayer": userId,
      isDeleted: false,
    })
      .sort({ "play.counter": -1 })
      .limit(5)
      .exec();

    if (!podcasts || podcasts.length === 0) {
      reply.status(404).send({ error: "User hasn't played any podcasts yet" });
      return;
    }
    reply.status(200).send(podcasts);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function getPopularPodcasts(req: Request, reply: Reply) {
  try {
    const popularPodcasts = await Podcast.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: "$play" }, // Deconstruct the play array
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          hostId: { $first: "$hostId" },
          description: { $first: "$description" },
          coverPicture: { $first: "$coverPicture" },
          created: { $first: "$created" },
          updated: { $first: "$updated" },
          isDeleted: { $first: "$isDeleted" },
          totalPlayCount: { $sum: "$play.counter" }, // Sum the play counters
        },
      },
      { $sort: { totalPlayCount: -1 } }, // Sort by total play count in descending order
    ]).exec();
    if (!popularPodcasts || popularPodcasts.length === 0) {
      reply.status(404).send({ error: "not found any Podcasts" });
    }
    reply.status(200).send(popularPodcasts);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function getPodcastsSearchByName(req: Request, reply: Reply) {
  const name = (req.params as { name: string }).name;
  try {
    const podcasts: IPodcast[] | null = await Podcast.find({
      title: { $regex: name, $options: "i" }, //  a regular expression for partial match, case insensitive
      isDeleted: false,
    }).exec();

    if (!podcasts || podcasts.length === 0) {
      reply
        .status(404)
        .send({ error: "not found any podcasts with this name" });
      return;
    }
    reply.status(200).send(podcasts);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function getNewEpisodeOfPodcastsForNotifications(
  req: Request,
  reply: Reply
) {
  const userId = (req.params as { id: string }).id;

  try {
    const user: IUser | null = await User.findById(userId);
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "User not found" });
      return;
    }

    const userLikes: ILike | null = await Like.findOne({ userId }).exec();

    if (
      !userLikes ||
      !userLikes.podcastId ||
      userLikes.podcastId.length === 0
    ) {
      reply.status(404).send({ error: "User has not liked any podcasts" });
      return;
    }

    const episodes: IPodcastEpisode[] = await PodcastEpisode.find({
      podcastId: { $in: userLikes.podcastId },
      isDeleted: false,
    })
      .sort({ releaseDate: -1 })
      .limit(10)
      .exec();

    if (!episodes || episodes.length === 0) {
      reply.status(404).send({ error: "No new episodes from liked podcasts" });
      return;
    }

    reply.status(200).send(episodes);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
export {
  createPodcastController,
  updatePodcastController,
  deletePodcastController,
  getPodcastController,
  getAllPodcastsController,
  getRecentlyPlayedPodcast,
  getMostPlayedPodcastByUser,
  getPopularPodcasts,
  getPodcastsSearchByName,
  getNewEpisodeOfPodcastsForNotifications,
};
