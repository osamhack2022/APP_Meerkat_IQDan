import { AllClearResponseType } from '@prisma/client';
import { IsString, IsNumber, IsEnum, } from 'class-validator';

// AllClear를 찾을 때 사용하는 DTO
export class FindAllClearDto{
    @IsNumber()
    public messageId: number;
}

// AllClear를 생성할 때 사용하는 DTO
export class CreateAllClearDto{
    @IsNumber()
    public messageId: number;
}

// AllClear 응답을 생성할 때 사용하는 DTO
export class CreateAllClearResponseDto{
    @IsNumber()
    public messageId: number;

    @IsEnum(AllClearResponseType)
    public allClearResponseType: AllClearResponseType;

    @IsString()
    public content: string;
}