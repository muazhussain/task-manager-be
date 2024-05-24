import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { commonResponse } from 'src/common/output-message.utils';
import { GetUserTask } from '../dtos/get-user-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { JwtGuard } from 'src/user/gurads/jwt.guard';

@ApiTags('TASK')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('task')
export class TaskController {
    constructor(
        private readonly taskService: TaskService,
    ) { }

    @Post()
    async createTask(@Body() payload: CreateTaskDto) {
        try {
            const res = await this.taskService.createTask(payload);
            return commonResponse(true, 'Task created successfully', res);
        } catch (error) {
            return commonResponse(false, 'Task creation failed', error);
        }
    }

    @Get(':id')
    async getTaskById(@Param('id') id: string) {
        try {
            const res = await this.taskService.getTaskById(id);
            return commonResponse(true, 'Task found successfully', res);
        } catch (error) {
            return commonResponse(false, 'Task not found', error);
        }
    }

    @Get()
    async getUserTasks(@Query() payload: GetUserTask) {
        try {
            const res = await this.taskService.getUserTasks(payload);
            return commonResponse(true, 'Tasks found successfully', res);
        } catch (error) {
            return commonResponse(false, 'Tasks not found', error);
        }
    }

    @Patch(':id')
    async updateTask(@Param('id') id: string, @Body() payload: UpdateTaskDto) {
        try {
            const res = await this.taskService.updateTask(id, payload);
            return commonResponse(true, 'Task updated successfully', res);
        } catch (error) {
            return commonResponse(false, 'Task not found', error);
        }
    }

    @Delete(':id')
    async deleteTask(@Param('id') id: string) {
        try {
            const res = await this.taskService.deleteTask(id);
            return commonResponse(true, 'Task deleted successfully', res);
        } catch (error) {
            return commonResponse(false, 'Task not found', error);
        }
    }
}