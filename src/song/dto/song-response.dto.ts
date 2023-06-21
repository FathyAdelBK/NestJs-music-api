import { SongType } from '@prisma/client';

export class SongResponseDto {
  name: string;
  description: string;
  artist: string;
  type: SongType;
  language: string;
  rate: number;
  source: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}
