import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
    @ApiProperty({
        required: true,
        type: 'string',
    })
    username: string;

    @ApiProperty({
        required: true,
        type: 'string',
    })
    password: string;
}