import { FastifyInstance } from "fastify";
import {
  createPodcastController,
  updatePodcastController,
  deletePodcastController,
  getPodcastController,
  getAllPodcastsController,
  getRecentlyPlayedPodcast,
  getMostPlayedPodcastByUser,
  getPopularPodcasts,
  getPodcastsSearchByName,
  getNewEpisodeOfPodcastsForNotifications,
} from "../controllers/podcastController"; // Adjust the path according to your project structure

async function podcastRoutes(fastify: FastifyInstance) {
  // Route to create a new podcast
  //   fastify.post("/podcasts", async (req, reply) => {
  //     try {
  //       const newPodcast = await createPodcastController(req.body);
  //       reply.status(201).send(newPodcast);
  //     } catch (error) {
  //       reply.status(500).send({ error: "Internal server error" });
  //     }
  //   });

  // Route to update an existing podcast
  fastify.put("/podcasts/:id", updatePodcastController);

  // Route to delete a podcast
  fastify.delete("/podcasts/:id", deletePodcastController);

  // Route to get a specific podcast by its ID
  fastify.get("/podcasts/:id", getPodcastController);

  // Route to get all podcasts
  fastify.get("/podcasts", getAllPodcastsController);

  // Route to get recently played podcasts by a user
  fastify.get("/users/:id/recent-podcasts", getRecentlyPlayedPodcast);

  // Route to get the most played podcasts by a user
  fastify.get("/users/:id/most-played-podcasts", getMostPlayedPodcastByUser);

  // Route to get popular podcasts
  fastify.get("/podcasts/popular", getPopularPodcasts);

  // Route to search podcasts by name
  fastify.get("/podcasts/search/:name", getPodcastsSearchByName);

  // Route to get new episodes for user notifications
  fastify.get(
    "/users/:id/new-episodes",
    getNewEpisodeOfPodcastsForNotifications
  );
}

export default podcastRoutes;
