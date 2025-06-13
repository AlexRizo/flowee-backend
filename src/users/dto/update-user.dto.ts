import { IsOptional, IsUUID } from 'class-validator';

import {
  IsArray,
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';
import { BeforeInsert, BeforeUpdate } from 'typeorm';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  nickname: string;

  @IsArray()
  @IsEnum(Roles, { each: true })
  @IsOptional()
  roles: Roles[];

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/, {
    message:
      'La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales. Mínimo 6 caracteres.',
  })
  @IsOptional()
  password: string;

  @IsArray()
  @IsString({ each: true })
  @IsUUID(4, { each: true })
  @IsOptional()
  boards: string[];

  @BeforeInsert()
  checkEmailBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkEmailBeforeInsert();
  }
}
