import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  Delete,
  HttpCode,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SingerService } from './singer.service';
import { AtGuard } from 'src/auth/guard/at.guard';
import { SingerResponseDto } from './dto/singer-response.dto';
import { QuerySingerDto } from './dto/query-singer.dto';
import { CreateSingerDto } from './dto/create-singer.dto';
import { UpdateSingerDto } from './dto/update-singer.dto';
import { CreateSingerAlbumDto } from 'src/singer-album/dto/create-singer-album.dto';
import { SingerAlbumResponseDto } from 'src/singer-album/dto/singer-album-response.dto';
import { DecodedUserType, User } from 'src/auth/decorator/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('singers')
export class SingerController {
  constructor(private readonly singerService: SingerService) {}

  @UseGuards(AtGuard)
  @Get()
  async getAll(): Promise<SingerResponseDto[]> {
    return await this.singerService.getAll();
  }

  @UseGuards(AtGuard)
  @Get('filtered')
  async getFiltered(
    @Query() singerQuery: QuerySingerDto,
  ): Promise<SingerResponseDto[]> {
    return await this.singerService.getFiltered(singerQuery);
  }

  @UseGuards(AtGuard)
  @Get(':singerId')
  async getOne(
    @Param('singerId', ParseIntPipe) singerId: number,
  ): Promise<SingerResponseDto> {
    return await this.singerService.getOne(singerId);
  }

  @UseGuards(AtGuard)
  @UseInterceptors(FileInterceptor('photo'))
  @Post()
  async create(
    @Body() singerData: CreateSingerDto,
    @UploadedFile() photo: Express.Multer.File,
    @User() user: DecodedUserType,
  ): Promise<SingerResponseDto> {
    return await this.singerService.create(singerData, photo, user);
  }

  @UseGuards(AtGuard)
  @UseInterceptors(FileInterceptor('photo'))
  @Put(':singerId')
  async update(
    @Param('singerId', ParseIntPipe) singerId: number,
    @UploadedFile() photo: Express.Multer.File,
    @Body() singerData: UpdateSingerDto,
  ): Promise<SingerResponseDto> {
    return await this.singerService.update(singerId, photo, singerData);
  }

  @UseGuards(AtGuard)
  @HttpCode(204)
  @Delete(':singerId')
  async delete(
    @Param('singerId', ParseIntPipe) singerId: number,
  ): Promise<void> {
    return await this.singerService.delete(singerId);
  }

  @UseGuards(AtGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post(':singerId/new-album')
  async newAlbum(
    @Param('singerId', ParseIntPipe) singerId: number,
    @Body() newAlbumData: CreateSingerAlbumDto,
    @UploadedFile() image: Express.Multer.File,
    @User() user: DecodedUserType,
  ): Promise<SingerAlbumResponseDto> {
    return await this.singerService.newAlbum(
      singerId,
      newAlbumData,
      image,
      user,
    );
  }
}
