import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TaskDto } from './task.dto';

export class CreateSpecialTaskDto extends TaskDto {
  // @IsString()
  // @MaxLength(1000)
  // @IsNotEmpty()
  // idea: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  sizes: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  legals: string;
}
