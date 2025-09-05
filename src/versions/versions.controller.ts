import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { VersionsService } from './versions.service';
import { CreateVersionDto } from './dto/create-version.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ValidateImageFile } from 'src/common/decorators/validate-image-file-decorator.decorator';
import { UpdateVersionStatusDto } from './dto/update-status.dto';

@Controller('versions')
export class VersionsController {
  constructor(private readonly versionsService: VersionsService) {}

  @Auth(Roles.ADMIN, Roles.DESIGN_MANAGER, Roles.DESIGNER, Roles.SUPER_ADMIN)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  create(
    @Body() createDeliveryDto: CreateVersionDto,
    @ValidateImageFile(50) file: Express.Multer.File,
  ) {
    return this.versionsService.create(createDeliveryDto, file);
  }

  @Get()
  findAll() {
    return this.versionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.versionsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateVersionStatusDto,
  ) {
    return this.versionsService.updateStatus(id, updateStatusDto);
  }
}
