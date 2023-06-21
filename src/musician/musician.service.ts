import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMusicianDto } from './dto/create-musician.dto';
import { MusicianResponseDto } from './dto/musician-response.dto';
import { UpdateMusicianDto } from './dto/update-musician.dto';
import { QueryMusicianDto } from './dto/query-musician.dto';
import { CreateMusicianAlbumDto } from './dto/create-album.dto';
import { MusicianAlbum } from '@prisma/client';

@Injectable()
export class MusicianService {
  constructor(private readonly prisma: PrismaService) {}

  private selectedMusicianData = {
    id: true,
    name: true,
    info: true,
    photo: true,
    type: true,
    gender: true,
    nationality: true,
    createdAt: true,
    updatedAt: true,
    musicianAlbums: { select: { id: true, name: true, image: true }, take: 1 },
  };

  async getAll(): Promise<MusicianResponseDto[]> {
    return await this.prisma.musician.findMany({
      select: this.selectedMusicianData,
    });
  }

  async getFiltered(
    musicianQuery: QueryMusicianDto,
  ): Promise<MusicianResponseDto[]> {
    return await this.prisma.musician.findMany({
      where: {
        name: musicianQuery?.name,
        type: musicianQuery?.type,
        gender: musicianQuery?.gender,
        nationality: musicianQuery?.nationality,
      },
      select: this.selectedMusicianData,
    });
  }

  async getOne(musicianId: number): Promise<MusicianResponseDto> {
    const musician = await this.prisma.musician.findUnique({
      where: { id: musicianId },
      select: this.selectedMusicianData,
    });
    if (!musician) {
      throw new NotFoundException('Musician not found!');
    }
    return musician;
  }

  async create(musicianData: CreateMusicianDto): Promise<MusicianResponseDto> {
    return await this.prisma.musician.create({
      data: musicianData,
      select: this.selectedMusicianData,
    });
  }

  async update(
    musicianId: number,
    musicianData: UpdateMusicianDto,
  ): Promise<MusicianResponseDto> {
    await this.getOne(musicianId);
    return await this.prisma.musician.update({
      where: { id: musicianId },
      select: this.selectedMusicianData,
      data: musicianData,
    });
  }

  async delete(musicianId: number): Promise<void> {
    await this.getOne(musicianId);
    // await this.prisma.musicianAlbum.deleteMany({ where: { musicianId } });
    await this.prisma.musician.delete({ where: { id: musicianId } });
  }

  async newAlbum(
    musicianId: number,
    newAlbumData: CreateMusicianAlbumDto,
  ): Promise<MusicianAlbum> {
    await this.getOne(musicianId);
    const newAlbum = { ...newAlbumData, musicianId };
    return await this.prisma.musicianAlbum.create({ data: newAlbum });
  }
}
