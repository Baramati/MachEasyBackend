import { Injectable } from '@nestjs/common';
import { SQL } from 'src/database/sql.sql';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    private vector: Buffer = Buffer.from([240, 3, 45, 29, 0, 76, 173, 59]);
    private cryptoKey: string;


    constructor(
        private config: SQL
    ) {
        this.cryptoKey = "A quick brown fox jumped over lazy dog.";
    }
    async findOne(username) {
        return await this.config.executeUserQuery(`select * from USERS where USER_ID='${username}'`);
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
