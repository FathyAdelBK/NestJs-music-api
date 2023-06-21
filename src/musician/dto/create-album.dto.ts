import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMusicianAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  image: string;
}
