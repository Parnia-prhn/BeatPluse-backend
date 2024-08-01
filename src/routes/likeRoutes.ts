import { FastifyInstance } from "fastify";
import {
  LikeSongController,
  LikeAlbumController,
  LikePlaylistController,
  LikePodcastController,
  getLikeController,
  getLikedPlaylists,
  getLikedSongs,
  getLikedAlbums,
  getLikedPodcasts,
} from "../controllers/likeController";

async function likeRoutes(fastify: FastifyInstance) {
  // Route to like/unlike a song
  fastify.put("/like/song/:userId/:songId", LikeSongController);

  // Route to like/unlike a playlist
  fastify.put("/like/playlist/:userId/:playlistId", LikePlaylistController);

  // Route to like/unlike an album
  fastify.put("/like/album/:userId/:albumId", LikeAlbumController);

  // Route to like/unlike a podcast
  fastify.put("/like/podcast/:userId/:podcastId", LikePodcastController);

  // Route to get a user's like data
  fastify.get("/like/:id", getLikeController);

  // Route to get liked playlists by a user
  fastify.get("/liked/playlists/:id", getLikedPlaylists);

  // Route to get liked songs by a user
  fastify.get("/liked/songs/:id", getLikedSongs);

  // Route to get liked albums by a user
  fastify.get("/liked/albums/:id", getLikedAlbums);

  // Route to get liked podcasts by a user
  fastify.get("/liked/podcasts/:id", getLikedPodcasts);
}

export default likeRoutes;
