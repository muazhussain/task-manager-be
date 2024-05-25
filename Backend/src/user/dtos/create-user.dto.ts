import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        required: false,
        type: 'string',
    })
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty({
        required: true,
        type: 'string',
    })
    @IsString()
    username: string;

    @ApiProperty({
        required: true,
        type: 'string',
    })
    @IsString()
    password: string;
}