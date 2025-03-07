import { Injectable } from '@nestjs/common';
import { Config } from '../config/config';
@Injectable()
export class AuthService {
    constructor(private config :Config){}
    async findOne(username){
        return await this.config.executeUserQuery(`select * from USERS where USER_ID='${username}'`);
    }

    
}
