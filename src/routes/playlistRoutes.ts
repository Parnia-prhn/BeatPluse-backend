import { FastifyInstance } from "fastify";
import {
  createPlaylistController,
  updatePlaylistController,
  deletePlaylistController,
  getPlaylistController,
  getAllPlaylistsController,
  getRecentlyPlayedPlaylist,
  getPlaylistsMadeByUser,
  getMostPlayedPlaylistsByUser,
  getPopularPlaylists,
  getPlaylistsOfGenre,
  getPlaylistsSearchByName,
  editCollaboratorToPlaylist,
} from "../controllers/playlistController"; // Adjust the path according to your project structure

async function playlistRoutes(fastify: FastifyInstance) {
  // Route to create a new playlist
  //   fastify.post("/playlists", async (req, reply) => {
  //     const newPlaylist = await createPlaylistController(req.body);
  //     reply.status(201).send(newPlaylist);
  //   });

  // Route to update an existing playlist
  fastify.put("/playlists/:id", updatePlaylistController);

  // Route to delete a playlist
  fastify.delete("/playlists/:id", deletePlaylistController);

  // Route to get a specific playlist by its ID
  fastify.get("/playlists/:id", getPlaylistController);

  // Route to get all playlists
  fastify.get("/playlists", getAllPlaylistsController);

  // Route to get recently played playlists by a user
  fastify.get("/users/:id/recent-playlists", getRecentlyPlayedPlaylist);

  // Route to get playlists created by a specific user
  fastify.get("/users/:id/created-playlists", getPlaylistsMadeByUser);

  // Route to get the most played playlists by a user
  fastify.get("/users/:id/most-played-playlists", getMostPlayedPlaylistsByUser);

  // Route to get popular playlists
  fastify.get("/playlists/popular", getPopularPlaylists);

  // Route to get playlists of a specific genre
  fastify.get("/genres/:genreName/playlists", getPlaylistsOfGenre);

  // Route to search playlists by name
  fastify.get("/playlists/search/:name", getPlaylistsSearchByName);

  // Route to toggle the collaboration status of a playlist
  fastify.patch("/playlists/:id/collaboration", editCollaboratorToPlaylist);
}

export default playlistRoutes;
