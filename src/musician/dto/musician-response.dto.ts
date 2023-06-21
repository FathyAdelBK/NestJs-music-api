import { Gender, MusicianType } from '@prisma/client';

export class MusicianResponseDto {
  name: string;
  info: string;
  photo: string;
  type: MusicianType;
  gender: Gender;
  nationality: string;
  createdAt: Date;
  updatedAt: Date;
}
