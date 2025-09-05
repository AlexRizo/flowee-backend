import { PartialType } from '@nestjs/mapped-types';
import { CreateVersionDto } from './create-version.dto';
import { VersionStatus } from '../interfaces/version.interface';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateVersionStatusDto extends PartialType(CreateVersionDto) {
  @IsEnum(VersionStatus)
  @IsNotEmpty()
  status: VersionStatus;

  @IsString()
  @IsOptional()
  comments: string;
}
