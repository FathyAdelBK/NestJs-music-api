import { Module } from '@nestjs/common';
import { SingerService } from './singer.service';
import { SingerController } from './singer.controller';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [SingerController],
  providers: [SingerService],
})
export class SingerModule {}
