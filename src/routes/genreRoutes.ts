import { FastifyInstance } from "fastify";
import {
  createGenreController,
  updateGenreController,
  deleteGenreController,
  getGenreController,
  getAllGenresController,
  getGenresSearchByName,
} from "../controllers/genreController";

async function genreRoutes(fastify: FastifyInstance) {
  //   fastify.post("/genre/create", async (req, reply) => {
  //     try {
  //       const newGenre = await createGenreController(req.body);
  //       reply.status(201).send(newGenre);
  //     } catch (error) {
  //       reply.status(500).send({ error: "Internal server error" });
  //     }
  //   });

  fastify.put("/genre/update/:id", updateGenreController);

  fastify.delete("/genre/delete/:id", deleteGenreController);

  fastify.get("/genre/:id", getGenreController);

  fastify.get("/genres", getAllGenresController);

  fastify.get("/genre/search/:name", getGenresSearchByName);
}

export default genreRoutes;
