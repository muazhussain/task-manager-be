import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UpdatePasswordDto } from '../dtos/update-password.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) { }

    async createUser(payload: CreateUserDto): Promise<UserEntity> {
        try {
            const found = await this.userRepo.findOne({ where: { username: payload.username } });
            if (found) {
                throw new BadRequestException('User already exists');
            }
            const hashedPassword = await bcrypt.hash(payload.password, 10);
            payload.password = hashedPassword;
            const user = this.userRepo.create(payload);
            return await this.userRepo.save(user);
        } catch (error) {
            throw error;
        }
    }

    async validateUser(username: string, password: string) {
        try {
            const user = await this.userRepo.findOne({ where: { username } });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new BadRequestException('Invalid credentials');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async login(req: any): Promise<any> {
        try {
            const accessToken = this.jwtService.sign(
                {
                    id: req.user.id,
                    username: req.user.username,
                    userAgent: req.headers['user-agent'],
                    deviceId: req.headers['x-device-id'],
                },
                { expiresIn: '1h' },
            );
            const refreshToken = this.jwtService.sign(
                {
                    id: req.user.id,
                    username: req.user.username,
                    userAgent: req.headers['user-agent'],
                    deviceId: req.headers['x-device-id'],
                },
                { expiresIn: '1d' },
            );
            return {
                id: req.user.id,
                username: req.user.username,
                accessToken,
                refreshToken,
            };
        } catch (error) {
            throw error;
        }
    }

    async generateAccessToken(req: any) {
        try {
            const accessToken = this.jwtService.sign(
                {
                    id: req.user.id,
                    username: req.user.username,
                    userAgent: req.headers['user-agent'],
                    deviceId: req.headers['x-device-id'],
                },
                { expiresIn: '1h' },
            );
            return {
                id: req.user.id,
                username: req.user.username,
                accessToken,
            };
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id: string): Promise<any> {
        try {
            const user = await this.userRepo.findOne({
                where: {
                    id: id,
                },
            });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            const { password, ...result } = user;
            return result;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id: string, payload: UpdateUserDto): Promise<any> {
        try {
            const user = await this.userRepo.findOne({ where: { id } });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            if (payload.username) {
                const found = await this.userRepo.findOne({ where: { username: payload.username } });
                if (found) {
                    throw new BadRequestException('User already exists');
                }
            }
            Object.assign(user, payload);
            await this.userRepo.update({ id }, user);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async updatePassword(id: string, payload: UpdatePasswordDto) {
        try {
            const user = await this.userRepo.findOne({ where: { id } });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            const isMatch = await bcrypt.compare(payload.oldPassword, user.password);
            if (!isMatch) {
                throw new BadRequestException('Invalid old password');
            }
            const hashedPassword = await bcrypt.hash(payload.newPassword, 10);
            payload.newPassword = hashedPassword;
            Object.assign(user, payload);
            await this.userRepo.update({ id }, user);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id: string): Promise<DeleteResult> {
        try {
            const user = await this.userRepo.findOne({ where: { id } });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return await this.userRepo.softDelete({ id });
        } catch (error) {
            throw error;
        }
    }
}
