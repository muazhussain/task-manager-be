import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshTokenDto {
    @ApiProperty({
        required: true,
        type: 'string',
    })
    @IsString()
    refreshToken: string;
}