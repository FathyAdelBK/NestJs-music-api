import { PartialType } from '@nestjs/mapped-types';
import { CreateSingerDto } from './create-singer.dto';

export class QuerySingerDto extends PartialType(CreateSingerDto) {}
