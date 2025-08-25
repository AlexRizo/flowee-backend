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
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ValidateImageFile } from 'src/common/decorators/validate-image-file-decorator.decorator';
import { UpdateDeliveryStatusDto } from './dto/update-status.dto';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Auth(Roles.ADMIN, Roles.DESIGN_MANAGER, Roles.DESIGNER, Roles.SUPER_ADMIN)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  create(
    @Body() createDeliveryDto: CreateDeliveryDto,
    @ValidateImageFile(50) file: Express.Multer.File,
  ) {
    return this.deliveriesService.create(createDeliveryDto, file);
  }

  @Get()
  findAll() {
    return this.deliveriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.deliveriesService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateDeliveryStatusDto,
  ) {
    return this.deliveriesService.updateStatus(id, updateStatusDto);
  }
}
