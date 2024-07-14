import { getAsync, setAsync, delAsync } from "../configs/redisClient";
import { Playlist } from "../database/models/Playlist";
import { IPlaylist } from "../database/interfaces/IPlaylist";

async function createPlaylist(
  title: string | null,
  description: string | null,
  userIdCreator: string | null
): Promise<IPlaylist> {
  const playlist = new Playlist({
    title,
    description,
    userIdCreator,
    created: Date.now(),
    updated: Date.now(),
  });
  await playlist.save();
  return playlist;
}
async function getPlaylist(playlistId: string): Promise<IPlaylist | null> {
  let playlist = await getAsync(`playlist:${playlistId}`);
  if (playlist) {
    return JSON.parse(playlist) as IPlaylist;
  }
  playlist = await Playlist.findById(playlistId).exec();
  if (playlist) {
    await setAsync(
      `playlist:${playlistId}`,
      JSON.stringify(playlist),
      "EX",
      3600
    );
  }
  return playlist;
}
async function updatePlaylist(
  playlistId: string,
  updates: Partial<IPlaylist>
): Promise<IPlaylist | null> {
  const playlist = await Playlist.findByIdAndUpdate(playlistId, updates, {
    new: true,
  }).exec();
  if (playlist) {
    await setAsync(
      `playlist:${playlistId}`,
      JSON.stringify(playlist),
      "EX",
      3600
    );
  }
  return playlist;
}
async function deletePlaylist(playlistId: string): Promise<void> {
  const playlist = await Playlist.findByIdAndUpdate(playlistId, {
    isDeleted: true,
  }).exec();
  await delAsync(`playlist:${playlistId}`);
}
async function getAllPlaylists(): Promise<IPlaylist[]> {
  return Playlist.find().exec();
}
export {
  createPlaylist,
  getPlaylist,
  updatePlaylist,
  deletePlaylist,
  getAllPlaylists,
};
