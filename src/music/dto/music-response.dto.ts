import { MusicType, Playlist, Track } from '@prisma/client';

export class MusicResponseDto {
  name: string;
  description: string;
  artist: string;
  type: MusicType;
  language: string;
  rate: number;
  source: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}
