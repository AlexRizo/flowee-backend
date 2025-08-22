import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FormatsService } from './formats.service';
import { CreateFormatDto } from './dto/create-format.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';

@Controller('formats')
export class FormatsController {
  constructor(private readonly formatsService: FormatsService) {}

  @Post()
  @Auth(
    Roles.PUBLISHER,
    Roles.PUBLISHER_MANAGER,
    Roles.ADMIN,
    Roles.SUPER_ADMIN,
  )
  create(@Body() createFormatDto: CreateFormatDto) {
    return this.formatsService.create(createFormatDto);
  }

  @Get('task/:id')
  findOneByTaskId(@Param('id', ParseUUIDPipe) id: string) {
    return this.formatsService.findOneByTaskId(id);
  }
}
