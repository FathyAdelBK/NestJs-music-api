import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MusicResponseDto } from './dto/music-response.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { MusicFavourites, MusicPlaylists } from '@prisma/client';

@Injectable()
export class MusicService {
  constructor(private readonly prisma: PrismaService) {}

  private selectedMusicData = {
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
    playlists: {
      take: 1,
    },
    tracks: {
      take: 1,
    },
    favourites: {
      take: 1,
    },
  };

  async getAll(): Promise<MusicResponseDto[]> {
    return await this.prisma.music.findMany({ select: this.selectedMusicData });
  }

  async getOne(musicId: number): Promise<MusicResponseDto> {
    const music = await this.prisma.music.findUnique({
      where: { id: musicId },
      select: this.selectedMusicData,
    });

    if (!music) {
      throw new NotFoundException('Music not found!');
    }

    return music;
  }

  async update(
    musicId: number,
    musicData: UpdateMusicDto,
  ): Promise<MusicResponseDto> {
    await this.getOne(musicId);
    return await this.prisma.music.update({
      where: { id: musicId },
      data: musicData,
      select: this.selectedMusicData,
    });
  }

  async delete(musicId: number): Promise<void> {
    await this.getOne(musicId);
    await this.prisma.music.delete({ where: { id: musicId } });
  }

  async addToPlaylist(
    musicId: number,
    playlistId: number,
  ): Promise<MusicPlaylists> {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    const music = await this.prisma.music.findUnique({
      where: { id: musicId },
      select: { playlists: true },
    });

    const playlistMusic = music.playlists.find((playlist) => {
      return playlist.playlistId == playlistId;
    });

    if (playlistMusic) {
      throw new BadRequestException('music is already exist');
    }

    return await this.prisma.musicPlaylists.create({
      data: {
        musicId,
        playlistId,
      },
    });
  }

  async removeFromPlaylist(musicId: number, playlistId: number): Promise<void> {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    const music = await this.prisma.music.findUnique({
      where: { id: musicId },
      select: { playlists: true },
    });

    if (!music) {
      throw new NotFoundException('Music not found!');
    }

    const playlistMusic = music.playlists.find((playlist) => {
      return playlist.playlistId == playlistId;
    });

    if (!playlistMusic) {
      throw new BadRequestException('Already removed from playlist');
    }

    await this.prisma.musicPlaylists.delete({
      where: {
        musicId_playlistId: {
          musicId,
          playlistId,
        },
      },
    });
  }

  async addToFavourite(
    musicId: number,
    favouriteId: number,
  ): Promise<MusicFavourites> {
    const favourite = await this.prisma.favourite.findUnique({
      where: { id: favouriteId },
    });

    if (!favourite) {
      throw new NotFoundException('Favourite not found');
    }

    const music = await this.prisma.music.findUnique({
      where: { id: musicId },
      select: { favourites: true },
    });

    if (!music) {
      throw new NotFoundException('Music not found!');
    }

    const favouriteMusic = music.favourites.find((fav) => {
      return fav.favouriteId == favouriteId;
    });

    if (favouriteMusic) {
      throw new BadRequestException('music already exists!');
    }

    return await this.prisma.musicFavourites.create({
      data: {
        musicId,
        favouriteId,
      },
    });
  }

  async removeFromFavourite(
    musicId: number,
    favouriteId: number,
  ): Promise<void> {
    const music = await this.prisma.music.findUnique({
      where: { id: musicId },
      select: { favourites: true },
    });

    if (!music) {
      throw new NotFoundException('music not found');
    }

    const favourite = await this.prisma.favourite.findUnique({
      where: { id: favouriteId },
      select: { musics: true },
    });

    if (!favourite) {
      throw new NotFoundException('Favourite not found!');
    }

    const musicFavourite = await favourite.musics.find((music) => {
      return music.favouriteId == favouriteId;
    });

    if (!musicFavourite) {
      throw new BadRequestException('Music already removed');
    }

    await this.prisma.musicFavourites.delete({
      where: {
        musicId_favouriteId: {
          musicId,
          favouriteId,
        },
      },
    });
  }
}
