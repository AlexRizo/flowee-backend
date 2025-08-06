import { IsEnum, IsString, IsUUID } from 'class-validator';
import { Status } from 'src/tasks/utils/utils';

export class UpdateTaskStatusDto {
  @IsString()
  taskId: string;

  @IsEnum(Status)
  status: Status;

  @IsUUID()
  boardId: string;
}
