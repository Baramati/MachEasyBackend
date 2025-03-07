import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Controller('auth')
export class AuthController {
  private vector: Buffer = Buffer.from([240, 3, 45, 29, 0, 76, 173, 59]);
  private cryptoKey: string;

  constructor(private readonly authService: AuthService, private jwtService: JwtService) {
    this.cryptoKey = "A quick brown fox jumped over lazy dog.";
  }
  @Post()
  async signIn(@Body() data) {
    const user = await this.authService.findOne(data.username);
    let result: boolean = false
    if (user.length != 0) {
      // result = await bcrypt.compare(data.pass, user[0]?.NEW_PASSWORD)
      let temp :any = this.encrypt3DES(data.pass);
      if(user[0]?.PASSWORD == temp){
        //------------ password mathc
        result = true;
      }
    }else{
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
      STATUS_CODE:'0'
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

  // Method to encrypt a string using 3DES
  public encrypt3DES(inputText: string): string {
    const md5Key = crypto.createHash('md5').update(this.cryptoKey).digest();
    const tripleDesKey = Buffer.concat([md5Key, md5Key.slice(0, 8)]); // Create a 24-byte key
    const cipher = crypto.createCipheriv('des-ede3-cbc', tripleDesKey, this.vector);

    let encrypted = cipher.update(inputText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  // Method to decrypt a string using 3DES
  public decrypt3DES(encryptedText: string): string {
    const md5Key = crypto.createHash('md5').update(this.cryptoKey).digest();
    const tripleDesKey = Buffer.concat([md5Key, md5Key.slice(0, 8)]); // Create a 24-byte key
    const decipher = crypto.createDecipheriv('des-ede3-cbc', tripleDesKey, this.vector);

    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  
}
