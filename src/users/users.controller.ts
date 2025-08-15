import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { ValidateImageFile } from 'src/common/decorators/validate-image-file-decorator.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':term')
  @Auth()
  update(
    @Param('term') term: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.usersService.update(term, updateUserDto, user);
  }

  @Patch(':term/avatar')
  @Auth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadAvatar(
    @Param('term') term: string,
    @ValidateImageFile()
    file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(file, term);
  }

  @Get()
  @Auth(Roles.ADMIN, Roles.SUPER_ADMIN, Roles.READER)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string) {
    return this.usersService.findOne(term);
  }

  @Get('designers/board/:boardId')
  @Auth(
    Roles.ADMIN,
    Roles.SUPER_ADMIN,
    Roles.DESIGN_MANAGER,
    Roles.PUBLISHER_MANAGER,
  )
  findDesignersByBoard(@Param('boardId', ParseUUIDPipe) boardId: string) {
    return this.usersService.findDesignersByBoard(boardId);
  }
}
