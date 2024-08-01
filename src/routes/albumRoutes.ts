import { FastifyInstance } from "fastify";
import {
  createAlbumController,
  updateAlbumController,
  deleteAlbumController,
  getAlbumController,
  getAllAlbumsController,
  getRecentlyPlayedAlbum,
  getMostPlayedAlbumByUser,
  getPopularAlbums,
  getAlbumsSearchByName,
  getArtistAlbums,
  getNewAlbumsForNotifications,
} from "../controllers/albumController";

async function albumRoutes(fastify: FastifyInstance) {
  //   fastify.post("/album/create", createAlbumController);

  fastify.put("/album/update/:albumId", updateAlbumController);

  fastify.delete("/album/delete/:albumId", deleteAlbumController);

  fastify.get("/album/:albumId", getAlbumController);

  fastify.get("/albums", getAllAlbumsController);

  fastify.get("/album/recentlyPlayed/:userId", getRecentlyPlayedAlbum);

  fastify.get("/album/mostPlayed/:userId", getMostPlayedAlbumByUser);

  fastify.get("/albums/popular", getPopularAlbums);

  fastify.get("/album/:name", getAlbumsSearchByName);

  fastify.get("/albums/:artistId", getArtistAlbums);

  fastify.get("/albums/new/:userId", getNewAlbumsForNotifications);
}

export default albumRoutes;
