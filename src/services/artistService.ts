import { getAsync, setAsync, delAsync } from "../configs/redisClient";
import { Artist } from "../database/models/Artist";
import { IArtist } from "../database/interfaces/IArtist";
async function createArtist(
  name: string | null,
  description: string | null,
  profilePicture: string | null
): Promise<IArtist> {
  const artist = new Artist({
    name,
    description,
    profile_picture_url: profilePicture,
    created: Date.now(),
    updated: Date.now(),
  });
  await artist.save();
  return artist;
}
async function getArtist(artistId: string): Promise<IArtist | null> {
  let artist = await getAsync(`artist:${artistId}`);
  if (artist) {
    return JSON.parse(artist) as IArtist;
  }
  artist = await Artist.findById(artistId).exec();
  if (artist) {
    await setAsync(`artist:${artistId}`, JSON.stringify(artist), "EX", 3600);
  }
  return artist;
}
async function updateArtist(
  artistId: string,
  updates: Partial<IArtist>
): Promise<IArtist | null> {
  const artist = await Artist.findByIdAndUpdate(artistId, updates, {
    new: true,
  }).exec();
  if (artist) {
    await setAsync(`artist:${artistId}`, JSON.stringify(artist), "EX", 3600);
  }
  return artist;
}
async function deleteArtist(artistId: string): Promise<void> {
  const artist = await Artist.findByIdAndUpdate(artistId, {
    isDeleted: true,
  }).exec();
  await delAsync(`artist:${artistId}`);
}
async function getAllArtists(): Promise<IArtist[]> {
  return Artist.find().exec();
}
export { createArtist, updateArtist, getArtist, deleteArtist, getAllArtists };
