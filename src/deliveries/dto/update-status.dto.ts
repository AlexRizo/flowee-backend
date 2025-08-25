import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliveryDto } from './create-delivery.dto';
import { DeliveryStatus } from '../interfaces/deliveries.interface';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDeliveryStatusDto extends PartialType(CreateDeliveryDto) {
  @IsEnum(DeliveryStatus)
  @IsNotEmpty()
  status: DeliveryStatus;

  @IsString()
  @IsOptional()
  comments: string;
}
