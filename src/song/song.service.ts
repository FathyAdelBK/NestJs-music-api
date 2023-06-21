import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SongResponseDto } from './dto/song-response.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongFavourites, SongPlaylists } from '@prisma/client';

@Injectable()
export class SongService {
  constructor(private readonly prisma: PrismaService) {}

  private selectedSongData = {
    id: true,
    name: true,
    description: true,
    artist: true,
    type: true,
    language: true,
    rate: true,
    source: true,
    image: true,
    createdAt: true,
    updatedAt: true,
    playlists: true,
    favourites: true,
    tracks: {
      select: {
        id: true,
        title: true,
        link: true,
        index: true,
      },
    },
  };

  async getAll(): Promise<SongResponseDto[]> {
    return await this.prisma.song.findMany({ select: this.selectedSongData });
  }

  async getOne(songId: number): Promise<SongResponseDto> {
    const song = await this.prisma.song.findUnique({
      where: { id: songId },
      select: this.selectedSongData,
    });
    if (!song) {
      throw new NotFoundException('Song not found!');
    }
    return song;
  }

  async update(
    songId: number,
    songData: UpdateSongDto,
  ): Promise<SongResponseDto> {
    await this.getOne(songId);
    return await this.prisma.song.update({
      where: { id: songId },
      data: songData,
      select: this.selectedSongData,
    });
  }

  async delete(songId: number): Promise<void> {
    await this.prisma.song.delete({ where: { id: songId } });
  }

  async addToPlaylist(
    songId: number,
    playlistId: number,
  ): Promise<SongPlaylists> {
    await this.getOne(songId);
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
      select: { songs: true },
    });
    if (!playlist) {
      throw new NotFoundException('Playlist is not found!');
    }

    const playlistSong = playlist.songs.find((song) => {
      return song.songId == songId;
    });

    if (playlistSong) {
      throw new BadRequestException('Song is already exists!');
    }

    return await this.prisma.songPlaylists.create({
      data: {
        songId,
        playlistId,
      },
    });
  }

  async removeFromPlaylist(songId: number, playlistId: number): Promise<void> {
    await this.getOne(songId);
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
      select: { songs: true },
    });
    if (!playlist) {
      throw new NotFoundException('Playlist is not found!');
    }

    const playlistSong = playlist.songs.find((song) => {
      return song.songId == songId;
    });

    if (!playlistSong) {
      throw new BadRequestException('Song is already removed!');
    }

    await this.prisma.songPlaylists.delete({
      where: { songId_playlistId: { songId, playlistId } },
    });
  }

  async addToFavourite(
    songId: number,
    favouriteId: number,
  ): Promise<SongFavourites> {
    await this.getOne(songId);
    console.log('test');
    const favourite = await this.prisma.favourite.findUnique({
      where: { id: favouriteId },
      select: { songs: true },
    });

    if (!favourite) {
      throw new NotFoundException('Favourite is not found!');
    }

    const favouriteSong = favourite.songs.find((song) => {
      return song.songId == songId;
    });

    if (favouriteSong) {
      throw new BadRequestException('Song is already exists!');
    }

    return await this.prisma.songFavourites.create({
      data: {
        songId,
        favouriteId,
      },
    });
  }

  async removeFromFavourite(
    songId: number,
    favouriteId: number,
  ): Promise<void> {
    await this.getOne(songId);
    const favourite = await this.prisma.favourite.findUnique({
      where: { id: favouriteId },
      select: { songs: true },
    });

    if (!favourite) {
      throw new NotFoundException('Favourite is not found!');
    }

    const favouriteSong = favourite.songs.find((song) => {
      return song.songId == songId;
    });

    if (!favouriteSong) {
      throw new BadRequestException('Song is already removed!');
    }

    await this.prisma.songFavourites.delete({
      where: { songId_favouriteId: { songId, favouriteId } },
    });
  }
}
