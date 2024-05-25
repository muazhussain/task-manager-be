import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../services/user.service";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
            ignoreExpiration: false,
            // secretOrKey: 'abc123',
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
        const currentUserAgent = req.headers['user-agent'];
        const currentDeviceId = req.headers['x-device-id'];
        if (payload.userAgent !== currentUserAgent || payload.deviceId !== currentDeviceId) {
            throw new UnauthorizedException();
        }
        return { userId: payload.sub };
    }
}