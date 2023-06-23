import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMusicianAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
