import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMusicianDto } from './dto/create-musician.dto';
import { MusicianResponseDto } from './dto/musician-response.dto';
import { UpdateMusicianDto } from './dto/update-musician.dto';
import { QueryMusicianDto } from './dto/query-musician.dto';
import { CreateMusicianAlbumDto } from './dto/create-album.dto';
import { MusicianAlbum } from '@prisma/client';
import { UploadService } from 'src/upload/upload.service';
import { DecodedUserType } from 'src/auth/decorator/user.decorator';

@Injectable()
export class MusicianService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

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
    userId: true,
    photoName: true,
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

  async create(
    musicianData: CreateMusicianDto,
    photo: Express.Multer.File,
    user: DecodedUserType,
  ): Promise<MusicianResponseDto> {
    const { originalname, buffer } = photo;
    const { id } = user;
    return await this.prisma.musician.create({
      data: {
        ...musicianData,
        photo: await this.uploadService.upload(originalname, buffer),
        photoName: originalname,
        userId: id,
      },
      select: this.selectedMusicianData,
    });
  }

  async update(
    musicianId: number,
    musicianData: UpdateMusicianDto,
    user: DecodedUserType,
  ): Promise<MusicianResponseDto> {
    const { id } = user;
    const musician = await this.getOne(musicianId);
    if (musician.userId !== id) {
      throw new UnauthorizedException('Unautherized to update user!');
    }
    return await this.prisma.musician.update({
      where: { id: musicianId },
      select: this.selectedMusicianData,
      data: { ...musicianData },
    });
  }

  async delete(musicianId: number, user: DecodedUserType): Promise<void> {
    const { id } = user;
    const musician = await this.prisma.musician.findUnique({
      where: { id: musicianId },
      include: { musicianAlbums: true },
    });
    if (musician.userId !== id) {
      throw new UnauthorizedException('Unautherized to delete user!');
    }
    musician.musicianAlbums.forEach(async (musicianAlbum) => {
      return await this.uploadService.delete(musicianAlbum.imageName);
    });
    await this.uploadService.delete(musician.photoName);
    await this.prisma.musician.delete({ where: { id: musicianId } });
  }

  async newAlbum(
    musicianId: number,
    newAlbumData: CreateMusicianAlbumDto,
    user: DecodedUserType,
    image: Express.Multer.File,
  ): Promise<MusicianAlbum> {
    const { originalname, buffer } = image;
    await this.getOne(musicianId);
    const newAlbum = { ...newAlbumData, musicianId };
    return await this.prisma.musicianAlbum.create({
      data: {
        ...newAlbum,
        userId: user.id,
        image: await this.uploadService.upload(originalname, buffer),
        imageName: originalname,
      },
    });
  }
}
