import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dtos/create-user.dto";
import { commonResponse } from "src/common/output-message.utils";
import { ApiTags } from "@nestjs/swagger";
import { LocalGuard } from "../gurads/local.gurad";
import { Request } from 'express';
import { UserEntity } from "../entity/user.entity";
import { SignInDto } from "../dtos/sign-in.dto";

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Post('sign-up')
    async signUp(@Body() payload: CreateUserDto) {
        try {
            const res = await this.userService.createUser(payload);
            return commonResponse(true, 'User created successfully', res);
        } catch (error) {
            return commonResponse(false, 'User creation failed', error);
        }
    }

    @Post('sign-in')
    @UseGuards(LocalGuard)
    async signIn(@Req() req: Request, @Body() payload: SignInDto) {
        try {
            const res = await this.userService.createToken(req.user, req);
            return commonResponse(true, 'Sign in successful', res);
        } catch (error) {
            return commonResponse(false, 'Sign in failed', error);
        }
    }
}