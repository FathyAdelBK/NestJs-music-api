import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSingerAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  image: string;
}
