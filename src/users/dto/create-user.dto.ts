import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';
import { BeforeInsert, BeforeUpdate } from 'typeorm';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(3)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'El nickname solo puede contener letras, números y guiones bajos.',
  })
  nickname: string;

  @IsArray()
  @IsEnum(Roles, { each: true })
  roles: Roles[];

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/, {
    message:
      'La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales. Mínimo 6 caracteres.',
  })
  password: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @BeforeInsert()
  checkEmailBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
    this.nickname = this.nickname.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkEmailBeforeInsert();
  }
}
