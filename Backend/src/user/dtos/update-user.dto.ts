import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({
        required: false,
        type: 'string',
    })
    @IsString()
    username: string;

    @ApiProperty({
        required: false,
        type: 'string',
    })
    @IsString()
    name: string;
}