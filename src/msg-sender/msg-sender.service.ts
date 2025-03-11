import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { SQL } from 'src/database/sql.sql';
import { __FROM_MAIL, __FROM_MAIL_PASSWORD } from 'src/config/config.config';
const axios = require('axios').default;


@Injectable()
export class MsgSenderService {
  private transporter: nodemailer.Transporter;

  private readonly __fromMail = __FROM_MAIL;
  private readonly __fromMail_Password = __FROM_MAIL_PASSWORD;
  constructor(
    private sql: SQL,
    private httpService: HttpService
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // e.g., 'Gmail'
      auth: {
        user: `mailto:${this.__fromMail}`, // your email address
        pass: this.__fromMail_Password, // your email password
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, htmlContent: string, attachments: Array<{ filename: string; path: string }>) {
    const mailOptions = {
      from: `mailto:${this.__fromMail}`,
      to,
      subject,
      text,
      html: htmlContent,
      attachments,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email: ' + error);
    }
  }
}
