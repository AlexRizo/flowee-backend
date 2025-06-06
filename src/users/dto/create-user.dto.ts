import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
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

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/, {
    message:
      'The password must include uppercase, lowercase letters, a number, and a special character.',
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
