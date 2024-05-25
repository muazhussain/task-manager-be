import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { TaskPriority, TaskStatus } from "../entity/task.entity";

export class CreateTaskDto {
    @ApiProperty({
        required: true,
        type: 'string',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        required: false,
        type: 'string',
    })
    @IsOptional()
    description: string;

    @ApiProperty({
        required: false,
        type: 'enum',
        example: TaskStatus,
    })
    @IsOptional()
    status: string;

    @ApiProperty({
        required: false,
        type: 'enum',
        example: TaskPriority,
    })
    @IsOptional()
    priority: string;

    @ApiProperty({
        required: false,
        format: 'date',
        default: 'YYYY-MM-DD',
        description: 'YYYY-MM-DD',

    })
    @IsOptional()
    dueDate: string;

    @ApiProperty({
        required: true,
        format: 'uuid',
    })
    @IsUUID()
    user: string;
}