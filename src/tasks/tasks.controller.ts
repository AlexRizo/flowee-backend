import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';
import { CreateSpecialTaskDto } from './dto/create-special-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('special')
  @Auth(
    Roles.ADMIN,
    Roles.DESIGN_MANAGER,
    Roles.PUBLISHER,
    Roles.PUBLISHER_MANAGER,
  )
  createSpecialTask(@Body() createSpecialTaskDto: CreateSpecialTaskDto) {
    return this.tasksService.createSpecialTask(createSpecialTaskDto);
  }

  @Get('board/:term')
  findBoardTasks(@Param('term') term: string) {
    return this.tasksService.findBoardTasks(term);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
