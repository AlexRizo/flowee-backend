import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateVersionDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  deliveryId: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
