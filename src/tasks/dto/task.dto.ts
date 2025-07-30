import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Priority, Type } from '../utils/utils';

export class TaskDto {
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
  status: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Type)
  type: string;

  @IsDate()
  @IsNotEmpty()
  dueDate: Date;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  assignedToId: string;

  @IsString()
  @IsNotEmpty()
  boardId: string;
}
