import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { ISong } from "../database/interfaces/ISong";
import { Song } from "../database/models/Song";
import {
  createSong,
  updateSong,
  deleteSong,
  getSong,
  getAllSongs,
} from "../services/songService";
async function createSongController(obj: ISong): Promise<ISong> {
  const title = obj.title;
  const artistId = obj.artistId;
  const albumId = obj.albumId;
  const genreId = obj.genreId;
  const duration = obj.duration;
  const coverPicture = obj.coverPicture;
  const fileUrl = obj.fileUrl;
  const lyrics = obj.lyrics;

  try {
    const existingSong: ISong | null = await Song.findOne({ fileUrl });
    if (existingSong) {
      throw new Error("song already exists");
    }

    const newSong: ISong = await createSong(
      title,
      artistId,
      albumId,
      genreId,
      duration,
      coverPicture,
      fileUrl,
      lyrics
    );
    return newSong;
  } catch (err) {
    throw new Error("Internal server error");
  }
}
async function updateSongController(req: Request, reply: Reply): Promise<void> {
  const songId = (req.params as { id: string }).id;
  const updates = req.body as Partial<ISong>;
  try {
    const song: ISong | null = await Song.findById(songId);
    if (!song || song.isDeleted) {
      reply.status(404).send({ error: "song not found" });
      return;
    }
    const updatedSong: ISong | null = await updateSong(songId, updates);
    reply.status(200).send(updatedSong);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function deleteSongController(req: Request, reply: Reply): Promise<void> {
  const songId = (req.params as { id: string }).id;
  try {
    const song: ISong | null = await Song.findById(songId);
    if (!song || song.isDeleted) {
      reply.status(404).send({ error: "song not found!" });
    }
    await deleteSong(songId);
    reply.status(500).send({ message: "song deleted successfully!" });
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getSongController(req: Request, reply: Reply) {
  const songId = (req.params as { id: string }).id;
  try {
    const song: ISong | null = await Song.findById(songId);
    if (!song || song.isDeleted) {
      reply.status(404).send({ error: "song not found!" });
    }
    const songInfo = await getSong(songId);
    reply.send(songInfo);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getAllSongsController(req: Request, reply: Reply) {
  try {
    const songs = await getAllSongs();
    reply.send(songs);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
export {
  createSongController,
  updateSongController,
  deleteSongController,
  getSongController,
  getAllSongsController,
};
