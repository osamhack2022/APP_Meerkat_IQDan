import { IsDataURI, IsDate, IsDecimal, IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginUserDto{
  @IsString()
  public uid: string;
  
  @IsString()
  public password: string;
}

export class CreateUserDto {
  
  @IsString()
  public uid: string;
  
  @IsString()
  public password: string;

  @IsString()
  public name:string;

  @IsString()
  public serviceNumber: string;

  @IsString()
  public enlistmentDate: Date;

  @IsString()
  public affiliatedUnit:string;

  @IsString()
  public militaryRank:string;

  @IsOptional()
  @IsDataURI()
  public image:string;
}

export class ReadUserDto {
  
  @IsDecimal()
  public userId:string;
  
  @IsOptional()
  @IsString()
  public uid: string;
  
  @IsOptional()
  @IsString()
  public password: string;

  @IsOptional()
  @IsString()
  public name:string;

  @IsOptional()
  @IsString()
  public serviceNumber: string;

  @IsOptional()
  @IsString()
  public enlistmentDate: Date;

  @IsOptional()
  @IsString()
  public affiliatedUnit:string;

  @IsOptional()
  @IsString()
  public militaryRank:string;

  @IsOptional()
  @IsDataURI()
  public image:string;
}

export class UpdateUserDto {
  
  @IsDecimal()
  public userId:string;
  
  @IsOptional()
  @IsString()
  public uid: string;
  
  @IsOptional()
  @IsString()
  public password: string;

  @IsOptional()
  @IsString()
  public name:string;

  @IsOptional()
  @IsString()
  public serviceNumber: string;

  @IsOptional()
  @IsString()
  public enlistmentDate: Date;

  @IsOptional()
  @IsString()
  public affiliatedUnit:string;

  @IsOptional()
  @IsString()
  public militaryRank:string;

  @IsOptional()
  @IsDataURI()
  public image:string;
}