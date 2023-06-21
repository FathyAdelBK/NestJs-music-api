import { PartialType } from '@nestjs/mapped-types';
import { CreateMusicianDto } from './create-musician.dto';

export class QueryMusicianDto extends PartialType(CreateMusicianDto) {}
