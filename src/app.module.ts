import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { SingerModule } from './singer/singer.module';
import { MusicianModule } from './musician/musician.module';
import { FavouriteModule } from './favourite/favourite.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlaylistModule } from './playlist/playlist.module';
import { MusicModule } from './music/music.module';
import { MusicianAlbumModule } from './musician-album/musician-album.module';
import { SingerAlbumModule } from './singer-album/singer-album.module';
import { NotificationModule } from './notification/notification.module';
import { SongModule } from './song/song.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ProfileModule,
    SingerModule,
    MusicianModule,
    FavouriteModule,
    PrismaModule,
    PlaylistModule,
    MusicModule,
    MusicianAlbumModule,
    SingerAlbumModule,
    NotificationModule,
    SongModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
