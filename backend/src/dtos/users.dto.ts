import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public password: string;

  @IsString()
  public serviceNumber: string;
}
