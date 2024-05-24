import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'abc123',
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