import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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

    async createToken(curUser, req): Promise<any> {
        try {
            const accessToken = this.jwtService.sign(
                {
                    id: curUser.id,
                    username: curUser.username,
                    userAgent: req.headers['user-agent'],
                    deviceId: req.headers['x-device-id'],
                },
                { expiresIn: '1h' },
            );
            const refreshToken = this.jwtService.sign(
                {
                    id: curUser.id,
                    username: curUser.username,
                    userAgent: req.headers['user-agent'],
                    deviceId: req.headers['x-device-id'],
                },
                { expiresIn: '1d' },
            );
            return { accessToken, refreshToken };
        } catch (error) {
            throw error;
        }
    }
}
