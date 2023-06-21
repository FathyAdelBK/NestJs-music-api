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
import { SingerAlbumService } from './singer-album.service';
import { AtGuard } from 'src/auth/guard/at.guard';
import { SingerAlbumResponseDto } from './dto/singer-album-response.dto';
import { UpdateSingerAlbumDto } from './dto/update-singer-album.dto';
import { CreateSongDto } from 'src/song/dto/create-song.dto';

@Controller('singer-albums')
export class SingerAlbumController {
  constructor(private readonly singerAlbumService: SingerAlbumService) {}

  @UseGuards(AtGuard)
  @Get()
  async getAll(): Promise<SingerAlbumResponseDto[]> {
    return await this.singerAlbumService.getAll();
  }

  @UseGuards(AtGuard)
  @Get(':singerAlbumId')
  async getOne(
    @Param('singerAlbumId', ParseIntPipe) singerAlbumId: number,
  ): Promise<SingerAlbumResponseDto> {
    return await this.singerAlbumService.getOne(singerAlbumId);
  }

  @UseGuards(AtGuard)
  @Put(':singerAlbumId')
  async update(
    @Param('singerAlbumId', ParseIntPipe) singerAlbumId: number,
    @Body() singerAlbumData: UpdateSingerAlbumDto,
  ): Promise<SingerAlbumResponseDto> {
    return await this.singerAlbumService.update(singerAlbumId, singerAlbumData);
  }

  @UseGuards(AtGuard)
  @HttpCode(204)
  @Delete(':singerAlbumId')
  async delete(@Param('singerAlbumId', ParseIntPipe) singerAlbumId: number) {
    return await this.singerAlbumService.delete(singerAlbumId);
  }

  @UseGuards(AtGuard)
  @Post(':singerAlbumId/new-song')
  async newSong(
    @Param('singerAlbumId', ParseIntPipe) singerAlbumId: number,
    @Body() songData: CreateSongDto,
  ) {
    return await this.singerAlbumService.newSong(singerAlbumId, songData);
  }

  @UseGuards(AtGuard)
  @Delete(':singerAlbumId/clear-album')
  async clearAlbum(
    @Param('singerAlbumId', ParseIntPipe) singerAlbumId: number,
  ): Promise<void> {
    return await this.singerAlbumService.clearAlbum(singerAlbumId);
  }
}
