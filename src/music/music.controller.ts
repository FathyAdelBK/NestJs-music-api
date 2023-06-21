import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicResponseDto } from './dto/music-response.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { AtGuard } from 'src/auth/guard/at.guard';
import { MusicFavourites, MusicPlaylists } from '@prisma/client';

@Controller('musics')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get()
  @UseGuards(AtGuard)
  async getAll(): Promise<MusicResponseDto[]> {
    return await this.musicService.getAll();
  }

  @Get(':musicId')
  @UseGuards(AtGuard)
  async getOne(
    @Param('musicId', ParseIntPipe) musicId: number,
  ): Promise<MusicResponseDto> {
    return await this.musicService.getOne(musicId);
  }

  @Put(':musicId')
  @UseGuards(AtGuard)
  async update(
    @Param('musicId', ParseIntPipe) musicId: number,
    @Body() musicData: UpdateMusicDto,
  ): Promise<MusicResponseDto> {
    return await this.musicService.update(musicId, musicData);
  }

  @Delete(':musicId')
  @UseGuards(AtGuard)
  @HttpCode(204)
  async delete(@Param('musicId', ParseIntPipe) musicId: number): Promise<void> {
    return await this.musicService.delete(musicId);
  }

  @Post(':musicId/add-to-playlist/:playlistId')
  @UseGuards(AtGuard)
  async addToPlaylist(
    @Param('musicId', ParseIntPipe) musicId: number,
    @Param('playlistId', ParseIntPipe) playlistId: number,
  ): Promise<MusicPlaylists> {
    return await this.musicService.addToPlaylist(musicId, playlistId);
  }

  @Delete(':musicId/remove-from-playlist/:playlistId')
  @UseGuards(AtGuard)
  async removeFromPlaylist(
    @Param('musicId', ParseIntPipe) musicId: number,
    @Param('playlistId', ParseIntPipe) playlistId: number,
  ): Promise<void> {
    return await this.musicService.removeFromPlaylist(musicId, playlistId);
  }

  @Post(':musicId/add-to-favourite/:favouriteId')
  async addToFavourite(
    @Param('musicId', ParseIntPipe) musicId: number,
    @Param('favouriteId', ParseIntPipe) favouriteId: number,
  ): Promise<MusicFavourites> {
    return await this.musicService.addToFavourite(musicId, favouriteId);
  }

  @Delete(':musicId/remove-from-favourite/:favouriteId')
  async removeFromFavourite(
    @Param('musicId', ParseIntPipe) musicId: number,
    @Param('favouriteId', ParseIntPipe) favouriteId: number,
  ): Promise<void> {
    return await this.musicService.removeFromFavourite(musicId, favouriteId);
  }
}
