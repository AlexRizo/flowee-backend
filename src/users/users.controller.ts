import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @Auth(Roles.ADMIN, Roles.SUPER_ADMIN)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get()
  @Auth(Roles.ADMIN, Roles.READER)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string) {
    return this.usersService.findOne(term);
  }
}
