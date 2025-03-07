import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '../config/config';
@Module({
  imports : [JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '2d' },
  }),],
  controllers: [AuthController],
  providers: [AuthService,Config]
})
export class AuthModule {}
