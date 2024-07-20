import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { IPlaylist } from "../database/interfaces/IPlaylist";
import { Playlist } from "../database/models/Playlist";
import { User } from "../database/models/User";
import { IUser } from "../database/interfaces/IUser";
import {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getPlaylist,
  getAllPlaylists,
} from "../services/playlistService";
async function createPlaylistController(obj: IPlaylist): Promise<IPlaylist> {
  const title = obj.title;
  const description = obj.description;
  const userIdCreator = obj.userIdCreator;

  try {
    const existingPlaylist: IPlaylist | null = await Playlist.findOne({
      title,
    });
    if (existingPlaylist) {
      throw new Error("playlist already exists");
    }

    const newPlaylist: IPlaylist = await createPlaylist(
      title,
      description,
      userIdCreator
    );
    return newPlaylist;
  } catch (err) {
    throw new Error("Internal server error");
  }
}
async function updatePlaylistController(
  req: Request,
  reply: Reply
): Promise<void> {
  const playlistId = (req.params as { id: string }).id;
  const updates = req.body as Partial<IPlaylist>;
  try {
    const playlist: IPlaylist | null = await Playlist.findById(playlistId);
    if (!playlist || playlist.isDeleted) {
      reply.status(404).send({ error: "Playlist not found" });
      return;
    }
    const updatedPlaylist: IPlaylist | null = await updatePlaylist(
      playlistId,
      updates
    );
    reply.status(200).send(updatedPlaylist);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function deletePlaylistController(
  req: Request,
  reply: Reply
): Promise<void> {
  const playlistId = (req.params as { id: string }).id;
  try {
    const playlist: IPlaylist | null = await Playlist.findById(playlistId);
    if (!playlist || playlist.isDeleted) {
      reply.status(404).send({ error: "Playlist not found!" });
    }
    await deletePlaylist(playlistId);
    reply.status(500).send({ message: "Playlist deleted successfully!" });
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getPlaylistController(req: Request, reply: Reply) {
  const playlistId = (req.params as { id: string }).id;
  try {
    const playlist: IPlaylist | null = await Playlist.findById(playlistId);
    if (!playlist || playlist.isDeleted) {
      reply.status(404).send({ error: "Playlist not found!" });
    }
    const playlistInfo = await getPlaylist(playlistId);
    reply.send(playlistInfo);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getAllPlaylistsController(req: Request, reply: Reply) {
  try {
    const playlists = await getAllPlaylists();
    reply.send(playlists);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function getRecentlyPlayedPlaylist(req: Request, reply: Reply) {
  const userId = (req.params as { id: string }).id;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "User not found" });
      return;
    }
    const playlists: IPlaylist[] | null = await Playlist.find({
      "play.userIdPlayer": userId,
      isDeleted: false,
    })
      .sort({ "play.playDate": -1 })
      .limit(5)
      .exec();

    if (!playlists || playlists.length === 0) {
      reply.status(404).send({ error: "User hasn't played any playlists yet" });
      return;
    }
    reply.status(200).send(playlists);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
export {
  createPlaylistController,
  updatePlaylistController,
  deletePlaylistController,
  getPlaylistController,
  getAllPlaylistsController,
  getRecentlyPlayedPlaylist,
};
