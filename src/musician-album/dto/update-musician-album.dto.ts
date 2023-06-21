import { PartialType } from '@nestjs/mapped-types';
import { CreateMusicianAlbumDto } from 'src/musician/dto/create-album.dto';

export class UpdateMusicianAlbumDto extends PartialType(
  CreateMusicianAlbumDto,
) {}
