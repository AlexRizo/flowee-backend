import { PartialType } from '@nestjs/mapped-types';
import { CreateFormatDto } from './create-format.dto';

export class UpdateFormatDto extends PartialType(CreateFormatDto) {}
