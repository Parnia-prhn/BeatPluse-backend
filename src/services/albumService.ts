import { getAsync, setAsync, delAsync } from "../configs/redisClient";
import { IAlbum } from "../database/interfaces/IAlbum";
import { Album } from "../database/models/Album";
async function createAlbum(
  title: string | null,
  artistId: string | null,
  coverPicture: string | null
): Promise<IAlbum> {
  const album = new Album({
    title,
    artistId,
    coverPicture,
    releaseDate: Date.now(),
    created: Date.now(),
    updated: Date.now(),
  });
  await album.save();
  return album;
}
async function getAlbum(albumId: string): Promise<IAlbum | null> {
  let album = await getAsync(`album:${albumId}`);
  if (album) {
    return JSON.parse(album) as IAlbum;
  }
  album = await Album.findById(albumId).exec();
  if (album) {
    await setAsync(`album:${albumId}`, JSON.stringify(album), "EX", 3600);
  }
  return album;
}
async function updateAlbum(
  albumId: string,
  updates: Partial<IAlbum>
): Promise<IAlbum | null> {
  const album = await Album.findByIdAndUpdate(albumId, updates, {
    new: true,
  }).exec();
  if (album) {
    await setAsync(`album:${albumId}`, JSON.stringify(album), "EX", 3600);
  }
  return album;
}
async function deleteAlbum(albumId: string): Promise<void> {
  const album = await Album.findByIdAndUpdate(albumId, {
    isDeleted: true,
  }).exec();
  await delAsync(`album:${albumId}`);
}
async function getAllAlbums(): Promise<IAlbum[]> {
  return Album.find().exec();
}
export { createAlbum, updateAlbum, deleteAlbum, getAlbum, getAllAlbums };
