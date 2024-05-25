import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";

export class GetUserTask {
    @ApiProperty({
        required: false,
        type: 'number',
        default: 1,
    })
    @IsOptional()
    page: number;

    @ApiProperty({
        required: false,
        type: 'number',
        default: 0,
    })
    @IsOptional()
    take: number;

    @ApiProperty({
        required: true,
        format: 'uuid',
    })
    @IsUUID()
    user: string;
}