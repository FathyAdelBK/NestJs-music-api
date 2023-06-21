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
import { SongService } from './song.service';
import { SongResponseDto } from './dto/song-response.dto';
import { AtGuard } from 'src/auth/guard/at.guard';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongFavourites } from '@prisma/client';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get()
  @UseGuards(AtGuard)
  async getAll(): Promise<SongResponseDto[]> {
    return await this.songService.getAll();
  }

  @Get(':songId')
  @UseGuards(AtGuard)
  async getOne(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<SongResponseDto> {
    return await this.songService.getOne(songId);
  }

  @Put(':songId')
  @UseGuards(AtGuard)
  async update(
    @Param('songId', ParseIntPipe) songId: number,
    @Body() songData: UpdateSongDto,
  ): Promise<SongResponseDto> {
    return await this.songService.update(songId, songData);
  }

  @Delete(':songId')
  @UseGuards(AtGuard)
  @HttpCode(204)
  async delete(@Param('songId', ParseIntPipe) songId: number): Promise<void> {
    return await this.songService.delete(songId);
  }

  @Post(':songId/add-to-playlist/:playlistId')
  async addToPlaylist(
    @Param('songId', ParseIntPipe) songId: number,
    @Param('playlistId', ParseIntPipe) playlistId: number,
  ) {
    return await this.songService.addToPlaylist(songId, playlistId);
  }

  @Delete(':songId/remove-from-playlist/:playlistId')
  async removeFromPlaylist(
    @Param('songId', ParseIntPipe) songId: number,
    @Param('playlistId', ParseIntPipe) playlistId: number,
  ): Promise<void> {
    return await this.songService.removeFromPlaylist(songId, playlistId);
  }

  @Post(':songId/add-to-favourite/:favouriteId')
  async addToFavourite(
    @Param('songId', ParseIntPipe) songId: number,
    @Param('favouriteId', ParseIntPipe) favouriteId: number,
  ): Promise<SongFavourites> {
    return await this.songService.addToFavourite(songId, favouriteId);
  }

  @Delete(':songId/remove-from-favourite/:favouriteId')
  async removeFromFavourite(
    @Param('songId', ParseIntPipe) songId: number,
    @Param('favouriteId', ParseIntPipe) favouriteId: number,
  ): Promise<void> {
    return await this.songService.removeFromFavourite(songId, favouriteId);
  }
}
