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
import { IGenre } from "../database/interfaces/IGenre";
import { Genre } from "../database/models/Genre";
import { IPlaylist } from "../database/interfaces/IPlaylist";
import { Playlist } from "../database/models/Playlist";
import { PlaylistSong } from "../database/models/PlaylistSong";
import { IArtist } from "../database/interfaces/IArtist";
import { Artist } from "../database/models/Artist";
import { Album } from "../database/models/Album";
import { IAlbum } from "../database/interfaces/IAlbum";
import { IPlaylistSong } from "../database/interfaces/IPlaylistSong";
import { IFollow } from "../database/interfaces/IFollow";
import { Follow } from "../database/models/Follow";
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
          genre: { $first: "$genre" },
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
async function getSongsOfGenre(req: Request, reply: Reply) {
  const genreName = (req.params as { genreName: string }).genreName;
  try {
    const genre: IGenre | null = await Genre.findOne({
      name: genreName,
    }).exec();
    if (!genre || genre.isDeleted) {
      reply.status(404).send({ error: "genre not found" });
      return;
    }
    const songs: ISong[] | null = await Song.find({
      genre: genreName,
      isDeleted: false,
    }).exec();

    if (!songs || songs.length === 0) {
      reply.status(404).send({ error: "not found any songs with this genre" });
      return;
    }
    reply.status(200).send(songs);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function getSongsSearchByName(req: Request, reply: Reply) {
  const name = (req.params as { name: string }).name;
  try {
    const songs: ISong[] | null = await Song.find({
      title: { $regex: name, $options: "i" }, //  a regular expression for partial match, case insensitive
      isDeleted: false,
    }).exec();

    if (!songs || songs.length === 0) {
      reply.status(404).send({ error: "not found any songs with this name" });
      return;
    }
    reply.status(200).send(songs);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function getSongsOfPlaylist(req: Request, reply: Reply) {
  const playlistId = (req.params as { id: string }).id;
  try {
    const playlist: IPlaylist | null = await Playlist.findById(playlistId);
    if (!playlist || playlist.isDeleted) {
      reply.status(404).send({ error: "the playlist was not found" });
      return;
    }
    const playlistSongs: IPlaylistSong | null = await PlaylistSong.findOne({
      playlistId,
    }).exec();

    if (!playlistSongs) {
      reply.status(404).send({ error: "The playlist is empty" });
      return;
    }

    const songIds = playlistSongs.songs
      .filter((song) => !song.isDeleted)
      .map((song) => song.songId);
    const songs: ISong[] = await Song.find({
      _id: { $in: songIds },
      isDeleted: false,
    }).exec();
    if (!songs || songs.length === 0) {
      reply.status(404).send({ error: "the playlist is empty" });
      return;
    }
    reply.status(200).send(songs);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function getSongsOfArtist(req: Request, reply: Reply) {
  const artistId = (req.params as { id: string }).id;
  try {
    const artist: IArtist | null = await Artist.findById(artistId);
    if (!artist || artist.isDeleted) {
      reply.status(404).send({ error: "The artist was not found" });
      return;
    }
    const songs: ISong[] | null = await Song.find({
      artistId: artistId,
      isDeleted: false,
    }).exec();

    if (!songs || songs.length === 0) {
      reply.status(404).send({ error: "No songs found for this artist" });
      return;
    }

    reply.status(200).send(songs);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function getSongsOfAlbum(req: Request, reply: Reply) {
  const albumId = (req.params as { id: string }).id;
  try {
    const album: IAlbum | null = await Album.findById(albumId);
    if (!album || album.isDeleted) {
      reply.status(404).send({ error: "The album was not found" });
      return;
    }
    const songs: ISong[] | null = await Song.find({
      albumId: albumId,
      isDeleted: false,
    }).exec();

    if (!songs || songs.length === 0) {
      reply.status(404).send({ error: "the album is empty" });
      return;
    }

    reply.status(200).send(songs);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function getSongInformation(req: Request, reply: Reply) {
  const songId = (req.params as { id: string }).id;
  try {
    const song: ISong | null = await Song.findById(songId);
    if (!song || song.isDeleted) {
      reply.status(404).send({ error: "the song was not found" });
    }
    reply.status(200).send(song);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function streamSong(req: Request, reply: Reply) {
  const userId = (req.params as { id: string }).id;
  const songId = (req.params as { id: string }).id;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "user not found. login first" });
      return;
    }
    const song: ISong | null = await Song.findById(songId);
    if (!song || song.isDeleted) {
      reply.status(404).send({ error: "song not found" });
      return;
    }
    // if the user has already played the song
    const playEntry = song.play.find((entry) => entry.userIdPlayer === userId);

    if (playEntry) {
      // Increment the counter if the user has already played the song
      playEntry.counter += 1;
      playEntry.isPlayed = true;
      playEntry.playDate = new Date();
    } else {
      // Add a new play entry if the user hasn't played the song
      song.play.push({
        userIdPlayer: userId,
        isPlayed: true,
        playDate: new Date(),
        counter: 1,
      });
    }

    // Set isPlaying to true
    song.isPlaying = true;

    await song.save();

    // Set a timeout to reset isPlaying to false after the duration of the song
    const songDuration = parseInt(song.duration, 10) * 1000; // duration is in seconds
    setTimeout(async () => {
      song.isPlaying = false;
      await song.save();
    }, songDuration);

    reply
      .status(200)
      .send({ message: "Streaming started", songUrl: song.fileUrl });
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function addSongToPlaylist(req: Request, reply: Reply) {
  const userId = (req.params as { id: string }).id;
  const songId = (req.params as { id: string }).id;
  const playlistId = (req.params as { id: string }).id;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "user not found. login first" });
      return;
    }
    const song: ISong | null = await Song.findById(songId);
    if (!song || song.isDeleted) {
      reply.status(404).send({ error: "song not found" });
      return;
    }
    const playlist: IPlaylist | null = await Playlist.findOne({
      _id: playlistId,
      $or: [{ userIdCreator: userId }, { isCollaboration: true }],
      isDeleted: false,
    });

    if (!playlist) {
      reply.status(404).send({ error: "Playlist not found." });
      return;
    }

    // Fetch the PlaylistSong
    const playlistSongs: IPlaylistSong | null = await PlaylistSong.findOne({
      playlistId,
    });

    if (!playlistSongs) {
      reply.status(404).send({ error: "internal error" });
      return;
    }

    //  if the song is already in the playlist
    const songInPlaylist = playlistSongs.songs.find(
      (song) => song.songId === songId
    );
    if (songInPlaylist) {
      reply.status(400).send({ error: "Song already exists in the playlist." });
      return;
    }

    playlistSongs.songs.push({ songId, isDeleted: false });

    await playlistSongs.save();

    reply.status(200).send({ message: "Song added successfully" });
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function getNewSongsForNotifications(req: Request, reply: Reply) {
  const userId = (req.params as { id: string }).id;

  try {
    const user: IUser | null = await User.findById(userId);
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "User not found" });
      return;
    }

    const follows: IFollow[] = await Follow.find({
      followerId: userId,
      isDeleted: false,
    }).exec();

    if (!follows || follows.length === 0) {
      reply.status(404).send({ error: "User is not following any artists" });
      return;
    }

    const followedArtistIds = follows.map((follow) => follow.followedId);

    const songs: ISong[] = await Song.find({
      artistId: { $in: followedArtistIds },
      isDeleted: false,
    })
      .sort({ created: -1 })
      .limit(10)
      .exec();

    if (!songs || songs.length === 0) {
      reply.status(404).send({ error: "No new songs from followed artists" });
      return;
    }

    reply.status(200).send(songs);
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
};
