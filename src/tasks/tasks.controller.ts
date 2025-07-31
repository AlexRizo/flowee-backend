import { Controller, Post, Body } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';
import { CreateSpecialTaskDto } from './dto/create-special-task.dto';
import { SpecialTasksService } from './special-tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly specialTasksService: SpecialTasksService) {}

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

  // @Get('board/:term')
  // findBoardTasks(@Param('term') term: string) {
  //   return this.tasksService.findBoardTasks(term);
  // }
}
