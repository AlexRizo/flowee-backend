import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';
import { CreateSpecialTaskDto } from './dto/create-special-task.dto';
import { SpecialTasksService } from './special-tasks.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { TasksService } from './tasks.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FilesPayloadPipe } from 'src/files/pipes/files-payload.pipe';

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
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'referenceFiles', maxCount: 5 },
        { name: 'includeFiles', maxCount: 5 },
      ],
      {
        storage: memoryStorage(),
      },
    ),
  )
  createSpecialTask(
    @Body() createSpecialTaskDto: CreateSpecialTaskDto,
    @UploadedFiles(
      new FilesPayloadPipe({
        requireReference: true,
        requireIncludes: true,
        allowEmptyArrays: false,
        maxFileSize: 50, //? 50MB
      }),
    )
    files: {
      referenceFiles: Express.Multer.File[];
      includeFiles: Express.Multer.File[];
    },
  ) {
    return this.specialTasksService.createSpecialTask(
      createSpecialTaskDto,
      files,
    );
  }

  @Get('board/:boardTerm')
  @Auth()
  findBoardTasks(@Param('boardTerm') boardTerm: string, @GetUser() user: User) {
    return this.tasksService.findBoardTasks(boardTerm, user);
  }

  @Get('board/:boardTerm/pending')
  @Auth(
    Roles.ADMIN,
    Roles.SUPER_ADMIN,
    Roles.DESIGN_MANAGER,
    Roles.PUBLISHER_MANAGER,
  )
  findBoardPendingTasks(@Param('boardTerm') boardTerm: string) {
    return this.tasksService.findBoardPendingTasks(boardTerm);
  }

  @Get('user')
  @Auth(Roles.ADMIN, Roles.SUPER_ADMIN, Roles.DESIGN_MANAGER)
  findAllUserTasks(@GetUser() user: User) {
    return this.tasksService.findAllUserTasks(user);
  }
}
