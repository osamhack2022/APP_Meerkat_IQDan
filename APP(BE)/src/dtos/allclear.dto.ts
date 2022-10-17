import { AllClearResponseType } from '@prisma/client';
import { IsString, IsNumber, IsEnum, } from 'class-validator';

export class FindAllClearDto{
    @IsNumber()
    public messageId: number;
}

export class CreateAllClearDto{
    @IsNumber()
    public messageId: number;
}

export class CreateAllClearResponseDto{
    @IsNumber()
    public messageId: number;

    @IsEnum(AllClearResponseType)
    public allClearResponseType: AllClearResponseType;

    @IsString()
    public content: string;
}