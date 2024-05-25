import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dtos/create-user.dto";
import { commonResponse } from "src/common/output-message.utils";
import { ApiTags } from "@nestjs/swagger";
import { LocalGuard } from "../gurads/local.gurad";
import { SignInDto } from "../dtos/sign-in.dto";
import { RefreshGuard } from "../gurads/refresh.guard";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";

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
            return commonResponse(true, 'Sign Up Successfully', res);
        } catch (error) {
            return commonResponse(false, 'Sign Up Failed', error);
        }
    }

    @Post('sign-in')
    @UseGuards(LocalGuard)
    async signIn(@Request() req: any, @Body() payload: SignInDto) {
        try {
            const res = await this.userService.login(req);
            return commonResponse(true, 'Sign in Successful', res);
        } catch (error) {
            return commonResponse(false, 'Sign in Failed', error);
        }
    }

    @Post('/refresh')
    @UseGuards(RefreshGuard)
    async refresh(@Request() req: any, @Body() payload: RefreshTokenDto) {
        try {
            const res = await this.userService.generateAccessToken(req);
            return commonResponse(true, 'Get Access Token Successfully', res);
        } catch (error) {
            return commonResponse(false, 'Get Access Token Failed', error);
        }
    }
}