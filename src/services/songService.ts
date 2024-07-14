import { getAsync, setAsync, delAsync } from "../configs/redisClient";
import { Song } from "../database/models/Song";
import { ISong } from "../database/interfaces/ISong";
async function createSong(
  title: string | null,
  artistId: string | null,
  albumId: string | null,
  genreId: string | null,
  duration: string | null,
  coverPicture: string | null,
  fileUrl: string | null,
  lyrics: string | null
): Promise<ISong> {
  const song = new Song({
    title,
    artistId,
    albumId,
    genreId,
    duration,
    coverPicture,
    fileUrl,
    lyrics,
    created: Date.now(),
    updated: Date.now(),
  });
  await song.save();
  return song;
}
async function getSong(songId: string): Promise<ISong | null> {
  let song = await getAsync(`song:${songId}`);
  if (song) {
    return JSON.parse(song) as ISong;
  }
  song = await Song.findById(songId).exec();
  if (song) {
    await setAsync(`song:${songId}`, JSON.stringify(song), "EX", 3600);
  }
  return song;
}
async function updateSong(
  songId: string,
  updates: Partial<ISong>
): Promise<ISong | null> {
  const song = await Song.findByIdAndUpdate(songId, updates, {
    new: true,
  }).exec();
  if (song) {
    await setAsync(`song:${songId}`, JSON.stringify(song), "EX", 3600);
  }
  return song;
}
async function deleteSong(songId: string): Promise<void> {
  const song = await Song.findByIdAndUpdate(songId, { isDeleted: true }).exec();
  await delAsync(`song:${songId}`);
}
async function getAllSongs(): Promise<ISong[]> {
  return Song.find().exec();
}
export { createSong, updateSong, getSong, deleteSong, getAllSongs };
