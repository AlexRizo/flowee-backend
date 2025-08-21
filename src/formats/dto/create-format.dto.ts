import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateFormatDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 35)
  description: string;

  @IsUUID()
  @IsNotEmpty()
  taskId: string;
}
