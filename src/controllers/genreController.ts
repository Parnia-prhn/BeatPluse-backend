import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { IGenre } from "../database/interfaces/IGenre";
import { Genre } from "../database/models/Genre";
import {
  createGenre,
  updateGenre,
  getGenre,
  deleteGenre,
  getAllGenres,
} from "../services/genreService";
async function createGenreController(obj: IGenre): Promise<IGenre> {
  const name = obj.name;
  const description = obj.description;
  try {
    const existingGenre: IGenre | null = await Genre.findOne({ name });
    if (existingGenre) {
      throw new Error("genre already exists");
    }

    const newGenre: IGenre = await createGenre(name, description);
    return newGenre;
  } catch (err) {
    throw new Error("Internal server error");
  }
}
async function updateGenreController(
  req: Request,
  reply: Reply
): Promise<void> {
  const genreId = (req.params as { id: string }).id;
  const updates = req.body as Partial<IGenre>;
  try {
    const genre: IGenre | null = await Genre.findById(genreId);
    if (!genre || genre.isDeleted) {
      reply.status(404).send({ error: "Genre not found" });
      return;
    }
    const updatedGenre: IGenre | null = await updateGenre(genreId, updates);
    reply.status(200).send(updatedGenre);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function deleteGenreController(
  req: Request,
  reply: Reply
): Promise<void> {
  const genreId = (req.params as { id: string }).id;
  try {
    const genre: IGenre | null = await Genre.findById(genreId);
    if (!genre || genre.isDeleted) {
      reply.status(404).send({ error: "genre not found!" });
    }
    await deleteGenre(genreId);
    reply.status(500).send({ message: "genre deleted successfully!" });
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getGenreController(req: Request, reply: Reply) {
  const genreId = (req.params as { id: string }).id;
  try {
    const genre: IGenre | null = await Genre.findById(genreId);
    if (!genre || genre.isDeleted) {
      reply.status(404).send({ error: "genre not found!" });
    }
    const genreInfo = await getGenre(genreId);
    reply.send(genre);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getAllGenresController(req: Request, reply: Reply) {
  try {
    const genres = await getAllGenres();
    reply.send(genres);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
export {
  createGenreController,
  updateGenreController,
  deleteGenreController,
  getGenreController,
  getAllGenresController,
};
