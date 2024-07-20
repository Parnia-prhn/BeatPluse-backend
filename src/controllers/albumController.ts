import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { IAlbum } from "../database/interfaces/IAlbum";
import { Album } from "../database/models/Album";
import {
  createAlbum,
  updateAlbum,
  deleteAlbum,
  getAlbum,
  getAllAlbums,
} from "../services/albumService";
import { IUser } from "../database/interfaces/IUser";
import { User } from "../database/models/User";
async function createAlbumController(obj: IAlbum): Promise<IAlbum> {
  const title = obj.title;
  const artistId = obj.artistId;
  const coverPicture = obj.coverPicture;

  try {
    const existingAlbum: IAlbum | null = await Album.findOne({
      title,
      artistId,
    });
    if (existingAlbum) {
      throw new Error("album already exists");
    }

    const newAlbum: IAlbum = await createAlbum(title, artistId, coverPicture);
    return newAlbum;
  } catch (err) {
    throw new Error("Internal server error");
  }
}
async function updateAlbumController(
  req: Request,
  reply: Reply
): Promise<void> {
  const albumId = (req.params as { id: string }).id;
  const updates = req.body as Partial<IAlbum>;
  try {
    const album: IAlbum | null = await Album.findById(albumId);
    if (!album || album.isDeleted) {
      reply.status(404).send({ error: "Album not found" });
      return;
    }
    const updatedAlbum: IAlbum | null = await updateAlbum(albumId, updates);
    reply.status(200).send(updatedAlbum);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function deleteAlbumController(
  req: Request,
  reply: Reply
): Promise<void> {
  const albumId = (req.params as { id: string }).id;
  try {
    const album: IAlbum | null = await Album.findById(albumId);
    if (!album || album.isDeleted) {
      reply.status(404).send({ error: "Album not found!" });
    }
    await deleteAlbum(albumId);
    reply.status(500).send({ message: "Album deleted successfully!" });
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getAlbumController(req: Request, reply: Reply) {
  const albumId = (req.params as { id: string }).id;
  try {
    const album: IAlbum | null = await Album.findById(albumId);
    if (!album || album.isDeleted) {
      reply.status(404).send({ error: "Album not found!" });
    }
    const albumInfo = await getAlbum(albumId);
    reply.send(album);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getAllAlbumsController(req: Request, reply: Reply) {
  try {
    const albums = await getAllAlbums();
    reply.send(albums);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getRecentlyPlayedAlbum(req: Request, reply: Reply) {
  const userId = (req.params as { id: string }).id;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "User not found" });
      return;
    }
    const albums: IAlbum[] | null = await Album.find({
      "play.userIdPlayer": userId,
      isDeleted: false,
    })
      .sort({ "play.playDate": -1 })
      .limit(5)
      .exec();

    if (!albums || albums.length === 0) {
      reply.status(404).send({ error: "User hasn't played any albums yet" });
      return;
    }
    reply.status(200).send(albums);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function getMostPlayedAlbumByUser(req: Request, reply: Reply) {
  const userId = (req.params as { id: string }).id;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "User not found" });
      return;
    }
    const albums: IAlbum[] | null = await Album.find({
      "play.userIdPlayer": userId,
      isDeleted: false,
    })
      .sort({ "play.counter": -1 })
      .limit(5)
      .exec();

    if (!albums || albums.length === 0) {
      reply.status(404).send({ error: "User hasn't played any albums yet" });
      return;
    }
    reply.status(200).send(albums);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function getPopularAlbums(req: Request, reply: Reply) {
  try {
    const popularAlbums = await Album.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: "$play" }, // Deconstruct the play array
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          artistId: { $first: "$artistId" },
          releaseDate: { $first: "$releaseDate" },
          coverPicture: { $first: "$coverPicture" },
          created: { $first: "$created" },
          updated: { $first: "$updated" },
          isDeleted: { $first: "$isDeleted" },
          totalPlayCount: { $sum: "$play.counter" }, // Sum the play counters
        },
      },
      { $sort: { totalPlayCount: -1 } }, // Sort by total play count in descending order
    ]).exec();
    if (!popularAlbums || popularAlbums.length === 0) {
      reply.status(404).send({ error: "not found any Albums" });
    }
    reply.status(200).send(popularAlbums);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
export {
  createAlbumController,
  updateAlbumController,
  deleteAlbumController,
  getAlbumController,
  getAllAlbumsController,
  getRecentlyPlayedAlbum,
  getMostPlayedAlbumByUser,
  getPopularAlbums,
};
