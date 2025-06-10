import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'El slug no puede tener espacios ni caracteres especiales',
  })
  slug: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  prefix: string;
}
