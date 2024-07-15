import { getAsync, setAsync, delAsync } from "../configs/redisClient";
import { Podcast } from "../database/models/Podcast";
import { IPodcast } from "../database/interfaces/IPodcast";

async function createPodcast(
  title: string | null,
  hostId: string,
  description: string | null,
  coverPicture: string | null
): Promise<IPodcast> {
  const podcast = new Podcast({
    title,
    hostId,
    description,
    cover_picture_url: coverPicture,
    created: Date.now(),
    updated: Date.now(),
  });
  await podcast.save();
  return podcast;
}
async function getPodcast(podcastId: string): Promise<IPodcast | null> {
  let podcast = await getAsync(`podcast:${podcastId}`);
  if (podcast) {
    return JSON.parse(podcast) as IPodcast;
  }
  podcast = await Podcast.findById(podcastId).exec();
  if (podcast) {
    await setAsync(`podcast:${podcastId}`, JSON.stringify(podcast), "EX", 3600);
  }
  return podcast;
}
async function updatePodcast(
  podcastId: string,
  updates: Partial<IPodcast>
): Promise<IPodcast | null> {
  const podcast = await Podcast.findByIdAndUpdate(podcastId, updates, {
    new: true,
  }).exec();
  if (podcast) {
    await setAsync(`podcast:${podcastId}`, JSON.stringify(podcast), "EX", 3600);
  }
  return podcast;
}
async function deletePodcast(podcastId: string): Promise<void> {
  const podcast = await Podcast.findByIdAndUpdate(podcastId, {
    isDeleted: true,
  }).exec();
  await delAsync(`podcast:${podcastId}`);
}
async function getAllPodcasts(): Promise<IPodcast[]> {
  return Podcast.find().exec();
}
export {
  createPodcast,
  getPodcast,
  updatePodcast,
  deletePodcast,
  getAllPodcasts,
};
