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
export {
  createAlbumController,
  updateAlbumController,
  deleteAlbumController,
  getAlbumController,
  getAllAlbumsController,
};
