import { IsDataURI, IsDecimal, IsOptional, IsString } from 'class-validator';

// 로그인 시 사용하는 DTO
export class LoginUserDto {
  @IsString()
  public uid: string;

  @IsString()
  public password: string;
}

// 사용자 생성 시 사용하는 DTO
export class CreateUserDto {
  @IsString()
  public uid: string;

  @IsString()
  public password: string;

  @IsString()
  public name: string;

  @IsString()
  public serviceNumber: string;

  @IsString()
  public enlistmentDate: Date;

  @IsString()
  public affiliatedUnit: string;

  @IsString()
  public militaryRank: string;

  @IsOptional()
  @IsDataURI()
  public image: string;
}

// 사용자 정보를 읽어올 때 사용하는 DTO
export class ReadUserDto {
  @IsDecimal()
  public userId: string;

  @IsOptional()
  @IsString()
  public uid: string;

  @IsOptional()
  @IsString()
  public password: string;

  @IsOptional()
  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  public serviceNumber: string;

  @IsOptional()
  @IsString()
  public enlistmentDate: Date;

  @IsOptional()
  @IsString()
  public affiliatedUnit: string;

  @IsOptional()
  @IsString()
  public militaryRank: string;

  @IsOptional()
  @IsDataURI()
  public image: string;
}

// 사용자 정보 갱신 시 사용하는 DTO
export class UpdateUserDto {
  @IsDecimal()
  public userId: string;

  @IsOptional()
  @IsString()
  public uid: string;

  @IsOptional()
  @IsString()
  public password: string;

  @IsOptional()
  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  public serviceNumber: string;

  @IsOptional()
  @IsString()
  public enlistmentDate: Date;

  @IsOptional()
  @IsString()
  public affiliatedUnit: string;

  @IsOptional()
  @IsString()
  public militaryRank: string;

  @IsOptional()
  @IsDataURI()
  public image: string;
}

// 사용자 검색 시 사용하는 DTO
export class SearchUserDto {
  @IsString()
  public name: string;

  @IsString()
  public serviceNumber: string;
}

// 비밀번호 갱신 시 사용하는 DTO
export class UpdatePasswordDto {
  @IsString()
  public currentPassword: string;

  @IsString()
  public password: string;
}

// 공개키 갱신 시 사용하는 DTO
export class updatePublicKeyDto {
  @IsString()
  public publicKey: string;
}
