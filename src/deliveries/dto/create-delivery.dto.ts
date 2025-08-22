import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  formatId: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
