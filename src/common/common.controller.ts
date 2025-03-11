import { CommonService } from './common.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  BadRequestException, Body, Controller, Delete, Get, Param,
  Patch, Post, Query, Res, UploadedFile, UseInterceptors, UploadedFiles
} from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';

@Controller('common')
export class CommonController {
  constructor(
    private readonly commonService: CommonService
  ) { }

  @Get('/MenusNav')
  getMenuNavDetails() {
    return this.commonService.menuNavDetails()
  }

  @Post('/menuDetails')
  menuDetails(@Body() data) {
    return this.commonService.menuDetails(data);
  }

  @Post('/MenuDocWiseNevigation')
  menuDocWiseNevigation(@Body() data) {
    return this.commonService.menuDocWiseNevigation(data);
  }
  @Post('/MSTMenuDocWiseNevigation')
  MSTDocWiseNevigation(@Body() data) {
    return this.commonService.MSTDocWiseNevigation(data);
  }
  @Post('/GetHelpList')
  getHelpList(@Body() data) {
    return this.commonService.getHelpList(data);
  }
  @Post('/MenuNevigationBtnAccessDataAsPerUser')
  getUserAccess(@Body() data) {
    return this.commonService.getUserAccess(data);
  }
  @Post('/GET_VOUTYPE_FROM_MENUDOC')
  async GET_VOUTYPE_FROM_MENUDOC(@Body() data) {
    return this.commonService.GET_VOUTYPE_FROM_MENUDOC(data);
  }

  @Post('/getSpData')
  async getSpData(@Body() data) {
    return this.commonService.getSpData(data);
  }

  @Post('/getSp')
  async getSp(@Body() data) {
    return this.commonService.getSp(data);
  }
  @Post('/getUserSpdata')
  async getUserSpdata(@Body() data) {
    return this.commonService.getUserSpdata(data);
  }
}

