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
import { IUser } from "../database/interfaces/IUser";
import { User } from "../database/models/User";
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
async function getRecentlyPlayedSong(req: Request, reply: Reply) {
  const userId = (req.params as { id: string }).id;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "User not found" });
      return;
    }
    const songs: ISong[] | null = await Song.find({
      "play.userIdPlayer": userId,
      isDeleted: false,
    })
      .sort({ "play.playDate": -1 })
      .limit(5)
      .exec();

    if (!songs || songs.length === 0) {
      reply.status(404).send({ error: "User hasn't played any songs yet" });
      return;
    }
    reply.status(200).send(songs);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function getMostPlayedSongByUser(req: Request, reply: Reply) {
  const userId = (req.params as { id: string }).id;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "User not found" });
      return;
    }
    const songs: ISong[] | null = await Song.find({
      "play.userIdPlayer": userId,
      isDeleted: false,
    })
      .sort({ "play.counter": -1 })
      .limit(5)
      .exec();

    if (!songs || songs.length === 0) {
      reply.status(404).send({ error: "User hasn't played any songs yet" });
      return;
    }
    reply.status(200).send(songs);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function getPopularSongs(req: Request, reply: Reply) {
  try {
    const popularSongs = await Song.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: "$play" }, // Deconstruct the play array
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          artistId: { $first: "$artistId" },
          albumId: { $first: "$albumId" },
          genreId: { $first: "$genreId" },
          duration: { $first: "$duration" },
          coverPicture: { $first: "$coverPicture" },
          fileUrl: { $first: "$fileUrl" },
          lyrics: { $first: "$lyrics" },
          created: { $first: "$created" },
          updated: { $first: "$updated" },
          isDeleted: { $first: "$isDeleted" },
          isPlaying: { $first: "$isPlaying" },
          totalPlayCount: { $sum: "$play.counter" }, // Sum the play counters
        },
      },
      { $sort: { totalPlayCount: -1 } }, // Sort by total play count in descending order
    ]).exec();
    if (!popularSongs || popularSongs.length === 0) {
      reply.status(404).send({ error: "not found any Songs" });
    }
    reply.status(200).send(popularSongs);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
export {
  createSongController,
  updateSongController,
  deleteSongController,
  getSongController,
  getAllSongsController,
  getRecentlyPlayedSong,
  getMostPlayedSongByUser,
  getPopularSongs,
};
