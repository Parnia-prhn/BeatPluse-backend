import { FastifyInstance } from "fastify";
import {
  createRadioController,
  updateRadioController,
  deleteRadioController,
  getRadioController,
  getAllRadiosController,
  getRecentlyPlayedRadio,
  getMostPlayedRadioByUser,
  getPopularRadios,
  getRadiosSearchByName,
} from "../controllers/radioController"; // Adjust the path according to your project structure

async function radioRoutes(fastify: FastifyInstance) {
  // Route to create a new radio
  //   fastify.post("/radios", async (req, reply) => {
  //     try {
  //       const newRadio = await createRadioController(req.body);
  //       reply.status(201).send(newRadio);
  //     } catch (error) {
  //       reply.status(500).send({ error: "Internal server error" });
  //     }
  //   });

  // Route to update an existing radio
  fastify.put("/radios/:id", updateRadioController);

  // Route to delete a radio
  fastify.delete("/radios/:id", deleteRadioController);

  // Route to get a specific radio by its ID
  fastify.get("/radios/:id", getRadioController);

  // Route to get all radios
  fastify.get("/radios", getAllRadiosController);

  // Route to get recently played radios by a user
  fastify.get("/users/:id/recent-radios", getRecentlyPlayedRadio);

  // Route to get the most played radios by a user
  fastify.get("/users/:id/most-played-radios", getMostPlayedRadioByUser);

  // Route to get popular radios
  fastify.get("/radios/popular", getPopularRadios);

  // Route to search radios by name
  fastify.get("/radios/search/:name", getRadiosSearchByName);
}

export default radioRoutes;
