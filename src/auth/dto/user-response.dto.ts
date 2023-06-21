import { Role } from '@prisma/client';

class Playlist {
  name: string;
}

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  facebookId: string;
  gmailId: string;
  playlists: Playlist[];
}
