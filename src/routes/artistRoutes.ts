import { FastifyInstance } from "fastify";
import {
  createArtistrController,
  updateArtistController,
  deleteArtistController,
  getArtistController,
  getAllArtistsController,
  getArtistsSearchByName,
  getMostPlayedArtistByUser,
  getPopularArtists,
  getRecentlyPlayedArtist,
} from "../controllers/artistController";
import { getAlbumsSearchByName } from "../controllers/albumController";

async function artistRoutes(fastify: FastifyInstance) {
  // fastify.post("/artist/create",createArtistrController);

  fastify.put("/artist/update/:artistId", updateArtistController);

  fastify.delete("/artist/delete/:artistId", deleteArtistController);

  fastify.get("/artist/:artistId", getArtistController);

  fastify.get("/artists", getAllArtistsController);

  fastify.get("/artists/recentlyPlayed/:userId", getRecentlyPlayedArtist);

  fastify.get("/artists/mostPlayed/:userId", getMostPlayedArtistByUser);

  fastify.get("/artists/popular", getPopularArtists);

  fastify.get("/artist/:name", getAlbumsSearchByName);
}
export default artistRoutes;
