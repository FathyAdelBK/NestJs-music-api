import { Gender, SingerType } from '@prisma/client';

export class SingerResponseDto {
  name: string;
  info: string;
  photo: string;
  type: SingerType;
  gender: Gender;
  nationality: string;
  createdAt: Date;
  updatedAt: Date;
  photoName: string;
}
