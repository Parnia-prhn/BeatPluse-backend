import { FastifyInstance } from "fastify";
import {
  createSongController,
  updateSongController,
  deleteSongController,
  getSongController,
  getAllSongsController,
  getRecentlyPlayedSong,
  getMostPlayedSongByUser,
  getPopularSongs,
  getSongsOfGenre,
  getSongsSearchByName,
  getSongsOfPlaylist,
  getSongsOfArtist,
  getSongsOfAlbum,
  getSongInformation,
  streamSong,
  addSongToPlaylist,
  getNewSongsForNotifications,
  getQueueSongs,
  getUserPlayedSongs,
} from "../controllers/songController";

async function songRoutes(fastify: FastifyInstance) {
  // Create a new song
  //   fastify.post("/songs/create", createSongController);

  // Update an existing song
  fastify.put("/songs/update/:id", updateSongController);

  // Delete a song
  fastify.delete("/songs/delete/:id", deleteSongController);

  // Get a specific song by ID
  fastify.get("/songs/:id", getSongController);

  // Get all songs
  fastify.get("/songs", getAllSongsController);

  // Get recently played songs by a user
  fastify.get("/users/:id/recently-played", getRecentlyPlayedSong);

  // Get most played songs by a user
  fastify.get("/users/:id/most-played", getMostPlayedSongByUser);

  // Get popular songs
  fastify.get("/songs/popular", getPopularSongs);

  // Get songs by genre
  fastify.get("/genres/:genreName/songs", getSongsOfGenre);

  // Search songs by name
  fastify.get("/songs/search/:name", getSongsSearchByName);

  // Get songs in a playlist
  fastify.get("/playlists/:id/songs", getSongsOfPlaylist);

  // Get songs by an artist
  fastify.get("/artists/:id/songs", getSongsOfArtist);

  // Get songs in an album
  fastify.get("/albums/:id/songs", getSongsOfAlbum);

  // Get detailed information of a song
  fastify.get("/songs/:id/information", getSongInformation);

  // Stream a song
  fastify.post("/songs/:id/stream", streamSong);

  // Add a song to a playlist
  fastify.post("/playlists/:id/songs/:songId", addSongToPlaylist);

  // Get new songs for notifications
  fastify.get("/users/:id/notifications/songs", getNewSongsForNotifications);

  // Get the queue of songs in a playlist
  fastify.get("/playlists/:playlistId/songs/:songId/queue", getQueueSongs);

  // Get songs played by a user
  fastify.get("/users/:id/played-songs", getUserPlayedSongs);
}

export default songRoutes;
