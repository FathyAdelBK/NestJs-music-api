import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AtGuard } from 'src/auth/guard/at.guard';
import { MusicianAlbumResponseDto } from './dto/musician-album-response.dto';
import { MusicianAlbumService } from './musician-album.service';
import { UpdateMusicianAlbumDto } from './dto/update-musician-album.dto';
import { CreateMusicDto } from 'src/music/dto/create-music.dto';
import { MusicResponseDto } from 'src/music/dto/music-response.dto';

@Controller('musician-albums')
export class MusicianAlbumController {
  constructor(private readonly musicianAlbumService: MusicianAlbumService) {}

  @UseGuards(AtGuard)
  @Get()
  async getAll(): Promise<MusicianAlbumResponseDto[]> {
    return await this.musicianAlbumService.getAll();
  }

  @UseGuards(AtGuard)
  @Get(':musicianAlbumId')
  async getOne(
    @Param('musicianAlbumId', ParseIntPipe) musicianAlbumId: number,
  ): Promise<MusicianAlbumResponseDto> {
    return await this.musicianAlbumService.getOne(musicianAlbumId);
  }

  @UseGuards(AtGuard)
  @Put(':musicianAlbumId')
  async update(
    @Param('musicianAlbumId', ParseIntPipe) musicianAlbumId: number,
    @Body() musicianAlbumData: UpdateMusicianAlbumDto,
  ): Promise<MusicianAlbumResponseDto> {
    return await this.musicianAlbumService.update(
      musicianAlbumId,
      musicianAlbumData,
    );
  }

  @UseGuards(AtGuard)
  @HttpCode(204)
  @Delete(':musicianAlbumId')
  async delete(
    @Param('musicianAlbumId', ParseIntPipe) musicianAlbumId: number,
  ) {
    return await this.musicianAlbumService.delete(musicianAlbumId);
  }

  @UseGuards(AtGuard)
  @Post(':musicianAlbumId/new-music')
  async newMusic(
    @Param('musicianAlbumId', ParseIntPipe) musicianAlbumId: number,
    @Body() musicData: CreateMusicDto,
  ): Promise<MusicResponseDto> {
    return await this.musicianAlbumService.newMusic(musicianAlbumId, musicData);
  }

  @UseGuards(AtGuard)
  @Delete(':musicianAlbumId/clear-album')
  async clearAlbum(
    @Param('musicianAlbumId', ParseIntPipe) musicianAlbumId: number,
  ): Promise<void> {
    return await this.musicianAlbumService.clearAlbum(musicianAlbumId);
  }
}
