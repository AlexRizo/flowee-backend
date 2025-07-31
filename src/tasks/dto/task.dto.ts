import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Priority, Status, Type } from '../utils/utils';
import { Type as TransformerType } from 'class-transformer';

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
  authorId: string;

  @IsString()
  @IsNotEmpty()
  assignedToId: string;

  @IsString()
  @IsNotEmpty()
  boardId: string;
}
