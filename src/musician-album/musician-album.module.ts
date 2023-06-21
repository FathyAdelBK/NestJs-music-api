import { Module } from '@nestjs/common';
import { MusicianAlbumService } from './musician-album.service';
import { MusicianAlbumController } from './musician-album.controller';

@Module({
  controllers: [MusicianAlbumController],
  providers: [MusicianAlbumService],
})
export class MusicianAlbumModule {}
