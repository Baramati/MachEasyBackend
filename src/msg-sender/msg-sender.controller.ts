import { MsgSenderService } from './msg-sender.service';
import { readdirSync } from 'fs';
import { Controller, Post, Body, Get, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
@Controller('sender')
export class MsgSenderController {
  constructor(private readonly msgSenderService: MsgSenderService,) { }
  @Post('Email_send')
  async sendMail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
    @Body('htmlContent') htmlContent: string,
    @Body('attachments') attachments: Array<{ filename: string; path: string }>
  ) {
    await this.msgSenderService.sendMail(to, subject, text, htmlContent, attachments);
    return { message: 'Email sent successfully' };
  }



  @Post('upload_single')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, file.originalname);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { message: 'File uploaded successfully', file };
  }
}
