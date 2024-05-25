import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { commonResponse } from 'src/common/output-message.utils';
import { JwtGuard } from '../gurads/jwt.guard';

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
            return commonResponse(true, 'User found successfully', res);
        } catch (error) {
            return commonResponse(false, 'User not found', error);
        }
    }
}
