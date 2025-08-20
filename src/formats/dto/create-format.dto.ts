import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateFormatDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 25)
  description: string;

  @IsUUID()
  @IsNotEmpty()
  taskId: string;
}
