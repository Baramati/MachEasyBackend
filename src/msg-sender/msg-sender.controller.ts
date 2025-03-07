import { MsgSenderService } from './msg-sender.service';
// src/file-upload/file-upload.controller.ts
import { readdirSync } from 'fs';
import { Controller, Post,Body,Get , UploadedFile,UploadedFiles, UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor,FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { join } from 'path';
import { Config } from '../config/config';

@Controller('sender')
export class MsgSenderController {
  constructor(private readonly msgSenderService: MsgSenderService,private config: Config) {}
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

  @Post('validate_cutomer')
  async validate_cutomer(@Body() data) {
    return await this.
    msgSenderService.validate_cutomer(data)
  }

  
  @Post('upload_single')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'uploads', // Change this to your desired folder
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        callback(null, file.originalname);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { message: 'File uploaded successfully', file };
  }

  @Post('upload_multi')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: diskStorage({
    //   destination: './uploads', // Directory to save files
    destination: (req, file, callback) => {
        // Absolute path to another drive (e.g., D: drive)
        const uploadPath = 'D:/COMPSERVE/SITE/BARAMATI_SOFTWARE/ERPREPORT/attachfile';  // Replace with your desired path
        callback(null, uploadPath);
      },
      filename: (req, file, callback) => {
        const parts = file.originalname.split('.');
    const lastValue = parts[parts.length - 1].trim();
        // const uniqueSuffix = ( req.body.uniqueSuffix +'-'+Date.now()+'.'+lastValue);
        const uniqueSuffix = ( req.body.uniqueSuffix +'-'+file.originalname);
        callback(null, `${uniqueSuffix}`);
        // callback(null, `${req.body.TRAN_NO}`);
      }
    })
  }))
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    this.msgSenderService.insTable(files)
    return { message: 'Files uploaded successfully', files };
  }

  
  @Post('/getReportCommon')
  async getReportCommon(@Body() data) {
    console.log(data)
    return await this.msgSenderService.getReportCommon(data);
  }
  
  //------------ Payroll report access temp - shubham 05122024
  @Post('/getReportCommon_PAYROLL')
  async getReportCommon_PAYROLL(@Body() data) {
    console.log(data)
    return await this.msgSenderService.getReportCommon_PAYROLL(data);
  }
}
