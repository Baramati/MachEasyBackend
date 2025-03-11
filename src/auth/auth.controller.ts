import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService
  ) {
  }
  @Post()
  async signIn(@Body() data) {
    const user = await this.authService.findOne(data.username);
    let result: boolean = false
    if (user.length != 0) {
      let temp: any = this.authService.encrypt3DES(data.pass);
      if (user[0]?.PASSWORD == temp) {
        //------------ password mathc
        result = true;
      }
    } else {
      throw new UnauthorizedException({
        STATUS_CODE: 21,
        message: 'Invalid User Name',
      });
    }

    if (!result) {
      throw new UnauthorizedException({
        STATUS_CODE: 22,
        message: 'Invalid Password',
      });
    }
    const payload = { sub: user[0].userId, username: user[0].username };
    let session_id = await this.generateRandamString(12);
    delete user[0].NEW_PASSWORD

    return {
      access_token: await this.jwtService.sign(payload, { secret: 'BDS', expiresIn: '1h' }),
      session_id: session_id,
      userInfo: user[0],
      STATUS_CODE: '0'
    };
  }


  async generateRandamString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
