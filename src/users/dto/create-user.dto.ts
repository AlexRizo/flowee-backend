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

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(3)
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

  @BeforeInsert()
  checkEmailBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkEmailBeforeInsert();
  }
}
