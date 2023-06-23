import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SingerResponseDto } from './dto/singer-response.dto';
import { QuerySingerDto } from './dto/query-singer.dto';
import { CreateSingerDto } from './dto/create-singer.dto';
import { UpdateSingerDto } from './dto/update-singer.dto';
import { CreateSingerAlbumDto } from 'src/singer-album/dto/create-singer-album.dto';
import { SingerAlbumResponseDto } from 'src/singer-album/dto/singer-album-response.dto';
import { DecodedUserType } from 'src/auth/decorator/user.decorator';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class SingerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  private selectedSingerData = {
    id: true,
    name: true,
    info: true,
    photo: true,
    photoName: true,
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

  async create(
    singerData: CreateSingerDto,
    photo: Express.Multer.File,
    user: DecodedUserType,
  ): Promise<SingerResponseDto> {
    return await this.prisma.singer.create({
      data: {
        ...singerData,
        photo: photo
          ? await this.uploadService.upload(photo.originalname, photo.buffer)
          : null,
        photoName: photo ? photo.originalname : null,
        userId: user.id,
      },
      select: this.selectedSingerData,
    });
  }

  async update(
    singerId: number,
    photo: Express.Multer.File,
    singerData: UpdateSingerDto,
  ): Promise<SingerResponseDto> {
    const singer = await this.getOne(singerId);
    return await this.prisma.singer.update({
      where: { id: singerId },
      select: this.selectedSingerData,
      data: {
        ...singerData,
        photo: photo
          ? await this.uploadService.upload(photo.originalname, photo.buffer)
          : singer.photo,
        photoName: photo ? photo.originalname : singer.photoName,
      },
    });
  }

  async delete(singerId: number): Promise<void> {
    const singer = await this.prisma.singer.findUnique({
      where: { id: singerId },
      include: { singerAlbums: true },
    });
    if (!singer) {
      throw new NotFoundException('Singer not found!');
    }
    singer.singerAlbums.forEach(async (singerAlbum) => {
      return await this.uploadService.delete(singerAlbum.imageName);
    });
    await this.uploadService.delete(singer.photoName);
    await await this.prisma.singer.delete({ where: { id: singerId } });
  }

  async newAlbum(
    singerId: number,
    newAlbumData: CreateSingerAlbumDto,
    image: Express.Multer.File,
    user: DecodedUserType,
  ): Promise<SingerAlbumResponseDto> {
    await this.getOne(singerId);
    const newAlbum = { ...newAlbumData, singerId };
    return await this.prisma.singerAlbum.create({
      data: {
        ...newAlbum,
        userId: user.id,
        image: await this.uploadService.upload(
          image.originalname,
          image.buffer,
        ),
        imageName: image.originalname,
      },
    });
  }
}
