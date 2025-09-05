import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  @Auth(
    Roles.PUBLISHER,
    Roles.PUBLISHER_MANAGER,
    Roles.ADMIN,
    Roles.SUPER_ADMIN,
  )
  create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveriesService.create(createDeliveryDto);
  }

  @Get('task/:id')
  findByTaskId(@Param('id', ParseUUIDPipe) id: string) {
    return this.deliveriesService.findByTaskId(id);
  }
}
