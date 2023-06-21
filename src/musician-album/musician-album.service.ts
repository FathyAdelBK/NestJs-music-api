import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMusicDto } from 'src/music/dto/create-music.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MusicianAlbumResponseDto } from './dto/musician-album-response.dto';
import { UpdateMusicianAlbumDto } from './dto/update-musician-album.dto';
import { MusicResponseDto } from 'src/music/dto/music-response.dto';

@Injectable()
export class MusicianAlbumService {
  constructor(private readonly prisma: PrismaService) {}

  private selectedMusicianAlbumData = {
    id: true,
    name: true,
    image: true,
    createdAt: true,
    updatedAt: true,
    musics: {
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

  async getAll(): Promise<MusicianAlbumResponseDto[]> {
    return await this.prisma.musicianAlbum.findMany({
      select: this.selectedMusicianAlbumData,
    });
  }

  async getOne(musicianAlbumId: number): Promise<MusicianAlbumResponseDto> {
    const musicianAlbum = await this.prisma.musicianAlbum.findUnique({
      where: { id: musicianAlbumId },
      select: this.selectedMusicianAlbumData,
    });
    if (!musicianAlbum) {
      throw new NotFoundException('Musician album not found!');
    }
    return musicianAlbum;
  }

  async update(
    musicianAlbumId: number,
    musicianAlbumData: UpdateMusicianAlbumDto,
  ): Promise<MusicianAlbumResponseDto> {
    await this.getOne(musicianAlbumId);
    return await this.prisma.musicianAlbum.update({
      where: { id: musicianAlbumId },
      data: musicianAlbumData,
      select: this.selectedMusicianAlbumData,
    });
  }

  async delete(musicianAlbumId: number): Promise<void> {
    await this.getOne(musicianAlbumId);
    // await this.prisma.music.deleteMany({ where: { musicianAlbumId } });
    await this.prisma.musicianAlbum.delete({ where: { id: musicianAlbumId } });
  }

  async newMusic(
    musicianAlbumId,
    musicData: CreateMusicDto,
  ): Promise<MusicResponseDto> {
    await this.getOne(musicianAlbumId);
    return await this.prisma.music.create({
      data: { ...musicData, musicianAlbumId },
    });
  }

  async clearAlbum(musicianAlbumId: number): Promise<void> {
    await this.prisma.music.deleteMany({ where: { musicianAlbumId } });
  }
}
