import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity, TaskPriority, TaskStatus } from '../entity/task.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { GetUserTask } from '../dtos/get-user-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity) private readonly taskRepo: Repository<TaskEntity>,
    ) { }

    async createTask(payload: CreateTaskDto): Promise<TaskEntity> {
        try {
            const task = this.taskRepo.create({
                title: payload.title,
                description: payload.description,
                status: TaskStatus[payload.status],
                priority: TaskPriority[payload.priority],
                dueDate: payload.dueDate,
                user: { id: payload.user },
            });
            return await this.taskRepo.save(task);
        } catch (error) {
            throw error;
        }
    }

    async getTaskById(id: string): Promise<TaskEntity> {
        try {
            return await this.taskRepo.findOne({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async getUserTasks(payload: GetUserTask): Promise<TaskEntity[]> {
        try {
            return await this.taskRepo.find({
                where: {
                    user: {
                        id: payload.user,
                    },
                },
                order: {
                    createdAt: 'DESC',
                },
                take: payload?.take ?? 0,
                skip: payload?.take * (payload?.page - 1) ?? 0,

            });
        } catch (error) {
            throw error;
        }
    }

    async updateTask(id: string, payload: UpdateTaskDto): Promise<TaskEntity> {
        try {
            const task = await this.getTaskById(id);
            if (!task) {
                throw new NotFoundException('Task not found');
            }
            Object.assign(task, payload);
            if (payload.status) {
                task.status = TaskStatus[payload.status];
            }
            if (payload.priority) {
                task.priority = TaskPriority[payload.priority];
            }
            await this.taskRepo.update({ id }, task);
            return task;
        } catch (error) {
            throw error;
        }
    }

    async deleteTask(id: string): Promise<DeleteResult> {
        try {
            const task = await this.getTaskById(id);
            if (!task) {
                throw new NotFoundException('Task not found');
            }
            return await this.taskRepo.softDelete({ id });
        } catch (error) {
            throw error;
        }
    }
}
