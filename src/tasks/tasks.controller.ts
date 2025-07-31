import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';
import { CreateSpecialTaskDto } from './dto/create-special-task.dto';
import { SpecialTasksService } from './special-tasks.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly specialTasksService: SpecialTasksService,
    private readonly tasksService: TasksService,
  ) {}

  @Post('special')
  @Auth(
    Roles.ADMIN,
    Roles.SUPER_ADMIN,
    Roles.DESIGN_MANAGER,
    Roles.PUBLISHER,
    Roles.PUBLISHER_MANAGER,
  )
  createSpecialTask(@Body() createSpecialTaskDto: CreateSpecialTaskDto) {
    return this.specialTasksService.createSpecialTask(createSpecialTaskDto);
  }

  @Get('board/:boardTerm')
  @Auth()
  findBoardTasks(@Param('boardTerm') boardTerm: string, @GetUser() user: User) {
    return this.tasksService.findBoardTasks(boardTerm, user);
  }
}
