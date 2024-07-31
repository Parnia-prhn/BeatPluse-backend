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
import { IGenre } from "../database/interfaces/IGenre";
import { Genre } from "../database/models/Genre";
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
      return;
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
      return;
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
async function getPlaylistsMadeByUser(req: Request, reply: Reply) {
  const userId = (req.params as { id: string }).id;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "User not found" });
      return;
    }
    const playlists: IPlaylist[] | null = await Playlist.find({
      userIdCreator: userId,
      isDeleted: false,
    }).exec();
    if (!playlists || playlists.length === 0) {
      reply
        .status(404)
        .send({ error: "The user has not created a playlist yet" });
      return;
    }
    reply.status(200).send(playlists);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getMostPlayedPlaylistsByUser(req: Request, reply: Reply) {
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
      .sort({ "play.counter": -1 })
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
async function getPopularPlaylists(req: Request, reply: Reply) {
  try {
    const popularPlaylists = await Playlist.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: "$play" }, // Deconstruct the play array
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          description: { $first: "$description" },
          userIdCreator: { $first: "$userIdCreator" },
          created: { $first: "$created" },
          updated: { $first: "$updated" },
          isCollaboration: { $first: "$isCollaboration" },
          isDeleted: { $first: "$isDeleted" },
          genre: { $first: "$genre" },
          totalPlayCount: { $sum: "$play.counter" }, // Sum the play counters
        },
      },
      { $sort: { totalPlayCount: -1 } }, // Sort by total play count in descending order
    ]).exec();
    if (!popularPlaylists || popularPlaylists.length === 0) {
      reply.status(404).send({ error: "not found any playlists" });
      return;
    }
    reply.status(200).send(popularPlaylists);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function getPlaylistsOfGenre(req: Request, reply: Reply) {
  const genreName = (req.params as { genreName: string }).genreName;
  try {
    const genre: IGenre | null = await Genre.findOne({
      name: genreName,
    }).exec();
    if (!genre || genre.isDeleted) {
      reply.status(404).send({ error: "genre not found" });
      return;
    }
    const playlists: IPlaylist[] | null = await Playlist.find({
      genre: genreName,
      isDeleted: false,
    }).exec();

    if (!playlists || playlists.length === 0) {
      reply
        .status(404)
        .send({ error: "not found any playlists with this genre" });
      return;
    }
    reply.status(200).send(playlists);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function getPlaylistsSearchByName(req: Request, reply: Reply) {
  const name = (req.params as { name: string }).name;
  try {
    const playlists: IPlaylist[] | null = await Playlist.find({
      title: { $regex: name, $options: "i" }, //  a regular expression for partial match, case insensitive
      isDeleted: false,
    }).exec();

    if (!playlists || playlists.length === 0) {
      reply
        .status(404)
        .send({ error: "not found any playlists with this name" });
      return;
    }
    reply.status(200).send(playlists);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function editCollaboratorToPlaylist(req: Request, reply: Reply) {
  const playlistId = (req.params as { id: string }).id;

  try {
    // Fetch the playlist by ID
    const playlist: IPlaylist | null = await Playlist.findById(playlistId);
    if (!playlist || playlist.isDeleted) {
      reply.status(404).send({ error: "Playlist not found" });
      return;
    }

    // Update the playlist to set it as collaborative
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $set: { isCollaboration: !playlist.isCollaboration },
      },
      { new: true }
    );

    if (!updatedPlaylist) {
      reply.status(500).send({ error: "Failed to update playlist" });
      return;
    }

    reply.status(200).send(updatedPlaylist);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getPlaylistCustomizedForUser(req: Request, reply: Reply) {}
export {
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
};
