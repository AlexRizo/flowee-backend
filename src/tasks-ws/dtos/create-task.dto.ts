import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type as TransformerType } from 'class-transformer';
import { Priority, Status, Type } from 'src/tasks/utils/utils';
import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Priority)
  priority: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Status)
  status: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Type)
  type: string;

  @IsDate()
  @IsNotEmpty()
  @TransformerType(() => Date)
  dueDate: Date;

  @IsString()
  @IsNotEmpty()
  author: User;

  @IsString()
  @IsOptional()
  assignedTo: User;

  @IsString()
  @IsNotEmpty()
  board: Board;
}
