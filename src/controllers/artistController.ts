import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { IArtist } from "../database/interfaces/IArtist";
import { Artist } from "../database/models/Artist";
import {
  createArtist,
  updateArtist,
  getArtist,
  deleteArtist,
  getAllArtists,
} from "../services/artistService";
import { IUser } from "../database/interfaces/IUser";
import { User } from "../database/models/User";
async function createArtistrController(obj: IArtist): Promise<IArtist> {
  const name = obj.name;
  const description = obj.description;
  const profilePicture = obj.profilePicture;

  try {
    const existingArtist: IArtist | null = await Artist.findOne({ name });
    if (existingArtist) {
      throw new Error("artist name already exists");
    }

    const newArtist: IArtist = await createArtist(
      name,
      description,
      profilePicture
    );
    return newArtist;
  } catch (err) {
    throw new Error("Internal server error");
  }
}
async function updateArtistController(
  req: Request,
  reply: Reply
): Promise<void> {
  const artistId = (req.params as { id: string }).id;
  const updates = req.body as Partial<IArtist>;
  try {
    const artist: IArtist | null = await Artist.findById(artistId);
    if (!artist || artist.isDeleted) {
      reply.status(404).send({ error: "artist not found" });
      return;
    }
    const updatedArtist: IArtist | null = await updateArtist(artistId, updates);
    reply.status(200).send(updatedArtist);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function deleteArtistController(
  req: Request,
  reply: Reply
): Promise<void> {
  const artistId = (req.params as { id: string }).id;
  try {
    const artist: IArtist | null = await Artist.findById(artistId);
    if (!artist || artist.isDeleted) {
      reply.status(404).send({ error: "artist not found!" });
    }
    await deleteArtist(artistId);
    reply.status(500).send({ message: "artist deleted successfully!" });
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getArtistController(req: Request, reply: Reply) {
  const artistId = (req.params as { id: string }).id;
  try {
    const artist: IArtist | null = await Artist.findById(artistId);
    if (!artist || artist.isDeleted) {
      reply.status(404).send({ error: "artist not found!" });
    }
    const ArtistInfo = await getArtist(artistId);
    reply.send(artist);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getAllArtistsController(req: Request, reply: Reply) {
  try {
    const artists = await getAllArtists();
    reply.send(artists);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getRecentlyPlayedArtist(req: Request, reply: Reply) {
  const userId = (req.params as { id: string }).id;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "User not found" });
      return;
    }
    const artists: IArtist[] | null = await Artist.find({
      "play.userIdPlayer": userId,
      isDeleted: false,
    })
      .sort({ "play.playDate": -1 })
      .limit(5)
      .exec();

    if (!artists || artists.length === 0) {
      reply.status(404).send({ error: "User hasn't played any artists yet" });
      return;
    }
    reply.status(200).send(artists);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
export {
  createArtist,
  updateArtist,
  getArtist,
  deleteArtist,
  getAllArtists,
  getRecentlyPlayedArtist,
};
