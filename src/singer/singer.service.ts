import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SingerResponseDto } from './dto/singer-response.dto';
import { QuerySingerDto } from './dto/query-singer.dto';
import { CreateSingerDto } from './dto/create-singer.dto';
import { UpdateSingerDto } from './dto/update-singer.dto';
import { SingerAlbum } from '@prisma/client';
import { CreateSingerAlbumDto } from 'src/singer-album/dto/create-singer-album.dto';
import { SingerAlbumResponseDto } from 'src/singer-album/dto/singer-album-response.dto';

@Injectable()
export class SingerService {
  constructor(private readonly prisma: PrismaService) {}

  private selectedSingerData = {
    id: true,
    name: true,
    info: true,
    photo: true,
    type: true,
    gender: true,
    nationality: true,
    createdAt: true,
    updatedAt: true,
    singerAlbums: { select: { id: true, name: true, image: true }, take: 1 },
  };

  async getAll(): Promise<SingerResponseDto[]> {
    return await this.prisma.singer.findMany({
      select: this.selectedSingerData,
    });
  }

  async getFiltered(singerQuery: QuerySingerDto): Promise<SingerResponseDto[]> {
    return await this.prisma.singer.findMany({
      where: {
        name: singerQuery?.name,
        type: singerQuery?.type,
        gender: singerQuery?.gender,
        nationality: singerQuery?.nationality,
      },
      select: this.selectedSingerData,
    });
  }

  async getOne(singerId: number): Promise<SingerResponseDto> {
    const singer = await this.prisma.singer.findUnique({
      where: { id: singerId },
      select: this.selectedSingerData,
    });
    if (!singer) {
      throw new NotFoundException('Singer not found!');
    }
    return singer;
  }

  async create(singerData: CreateSingerDto): Promise<SingerResponseDto> {
    return await this.prisma.singer.create({
      data: singerData,
      select: this.selectedSingerData,
    });
  }

  async update(
    singerId: number,
    singerData: UpdateSingerDto,
  ): Promise<SingerResponseDto> {
    await this.getOne(singerId);
    return await this.prisma.singer.update({
      where: { id: singerId },
      select: this.selectedSingerData,
      data: singerData,
    });
  }

  async delete(singerId: number): Promise<void> {
    await this.getOne(singerId);
    // await this.prisma.singerAlbum.deleteMany({ where: { singerId } });
    await this.prisma.singer.delete({ where: { id: singerId } });
  }

  async newAlbum(
    singerId: number,
    newAlbumData: CreateSingerAlbumDto,
  ): Promise<SingerAlbumResponseDto> {
    await this.getOne(singerId);
    const newAlbum = { ...newAlbumData, singerId };
    return await this.prisma.singerAlbum.create({ data: newAlbum });
  }
}
