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
export {
  createPodcastController,
  updatePodcastController,
  deletePodcastController,
  getPodcastController,
  getAllPodcastsController,
};
