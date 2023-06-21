import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SingerAlbumResponseDto } from './dto/singer-album-response.dto';
import { UpdateSingerAlbumDto } from './dto/update-singer-album.dto';
import { CreateSongDto } from 'src/song/dto/create-song.dto';
import { SongResponseDto } from 'src/song/dto/song-response.dto';

@Injectable()
export class SingerAlbumService {
  constructor(private readonly prisma: PrismaService) {}

  private selectedSingerAlbumData = {
    id: true,
    name: true,
    image: true,
    createdAt: true,
    updatedAt: true,
    songs: {
      select: {
        id: true,
        name: true,
        description: true,
        artist: true,
        type: true,
        language: true,
        rate: true,
        source: true,
        image: true,
      },
      take: 3,
    },
  };

  async getAll(): Promise<SingerAlbumResponseDto[]> {
    return await this.prisma.singerAlbum.findMany({
      select: this.selectedSingerAlbumData,
    });
  }

  async getOne(singerAlbumId: number): Promise<SingerAlbumResponseDto> {
    const singerAlbum = await this.prisma.singerAlbum.findUnique({
      where: { id: singerAlbumId },
      select: this.selectedSingerAlbumData,
    });
    if (!singerAlbum) {
      throw new NotFoundException('Singer album not found!');
    }
    return singerAlbum;
  }

  async update(
    singerAlbumId: number,
    singerAlbumData: UpdateSingerAlbumDto,
  ): Promise<SingerAlbumResponseDto> {
    await this.getOne(singerAlbumId);
    return await this.prisma.singerAlbum.update({
      where: { id: singerAlbumId },
      data: singerAlbumData,
      select: this.selectedSingerAlbumData,
    });
  }

  async delete(singerAlbumId: number): Promise<void> {
    await this.getOne(singerAlbumId);
    // await this.prisma.song.deleteMany({ where: { singerAlbumId } });
    await this.prisma.singerAlbum.delete({ where: { id: singerAlbumId } });
  }

  async newSong(
    singerAlbumId,
    songData: CreateSongDto,
  ): Promise<SongResponseDto> {
    await this.getOne(singerAlbumId);
    return await this.prisma.song.create({
      data: { ...songData, singerAlbumId },
    });
  }

  async clearAlbum(singerAlbumId: number): Promise<void> {
    await this.prisma.song.deleteMany({ where: { singerAlbumId } });
  }
}
