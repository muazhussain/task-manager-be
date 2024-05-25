import { Body, Controller, Delete, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { commonResponse } from 'src/common/output-message.utils';
import { JwtGuard } from '../gurads/jwt.guard';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UpdatePasswordDto } from '../dtos/update-password.dto';

@ApiTags('USER')
@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @UseGuards(JwtGuard)
    @Get(':id')
    async getUserById(@Request() req, @Param('id') id: string) {
        try {
            const res = await this.userService.getUserById(id);
            return commonResponse(true, 'Get User Successfully', res);
        } catch (error) {
            return commonResponse(false, 'Get User Failed', error);
        }
    }

    @UseGuards(JwtGuard)
    @Patch(':id')
    async updateUser(@Request() req, @Param('id') id: string, @Body() payload: UpdateUserDto) {
        try {
            const res = await this.userService.updateUser(id, payload);
            return commonResponse(true, 'Update User Successfully', res);
        } catch (error) {
            return commonResponse(false, 'Update User Failed', error);
        }
    }

    @UseGuards(JwtGuard)
    @Patch(':id/password')
    async updatePassword(@Request() req, @Param('id') id: string, @Body() payload: UpdatePasswordDto) {
        try {
            const res = await this.userService.updatePassword(id, payload);
            return commonResponse(true, 'Update Password Successfully', res);
        } catch (error) {
            return commonResponse(false, 'Update Password Failed', error);
        }
    }

    @UseGuards(JwtGuard)
    @Delete(':id')
    async deleteUser(@Request() req, @Param('id') id: string) {
        try {
            const res = await this.userService.deleteUser(id);
            return commonResponse(true, 'Delete User Successfully', res);
        } catch (error) {
            return commonResponse(false, 'Delete User Failed', error);
        }
    }
}
