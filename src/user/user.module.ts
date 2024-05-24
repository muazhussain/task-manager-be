import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalGuard } from './gurads/local.gurad';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [
    AuthController,
    UserController,
  ],
  providers: [
    UserService,
    LocalGuard,
    LocalStrategy,
  ],
  exports: [
    UserService,
  ]
})
export class UserModule { }
