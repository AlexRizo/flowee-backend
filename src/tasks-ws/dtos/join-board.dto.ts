import { IsEnum, IsString } from 'class-validator';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';

export class JoinBoardDto {
  @IsString()
  boardId: string;

  @IsEnum(Roles)
  role: Roles;
}
