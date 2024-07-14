import { getAsync, setAsync, delAsync } from "../configs/redisClient";
import { Genre } from "../database/models/Genre";
import { IGenre } from "../database/interfaces/IGenre";

async function createGenre(
  name: string | null,
  description: string | null
): Promise<IGenre> {
  const genre = new Genre({
    name,
    description,
    created: Date.now(),
    updated: Date.now(),
  });
  await genre.save();
  return genre;
}
async function getGenre(genreId: string): Promise<IGenre | null> {
  let genre = await getAsync(`genre:${genreId}`);
  if (genre) {
    return JSON.parse(genre) as IGenre;
  }
  genre = await Genre.findById(genreId).exec();
  if (genre) {
    await setAsync(`genre:${genreId}`, JSON.stringify(genre), "EX", 3600);
  }
  return genre;
}
async function updateGenre(
  genreId: string,
  updates: Partial<IGenre>
): Promise<IGenre | null> {
  const genre = await Genre.findByIdAndUpdate(genreId, updates, {
    new: true,
  }).exec();
  if (genre) {
    await setAsync(`genre:${genreId}`, JSON.stringify(genre), "EX", 3600);
  }
  return genre;
}
async function deleteGenre(genreId: string): Promise<void> {
  const genre = await Genre.findByIdAndUpdate(genreId, {
    isDeleted: true,
  }).exec();
  await delAsync(`genre:${genreId}`);
}
async function getAllGenres(): Promise<IGenre[]> {
  return Genre.find().exec();
}
export { createGenre, getGenre, updateGenre, deleteGenre, getAllGenres };
