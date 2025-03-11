import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  BadRequestException, Body, Controller, Delete, Get, Param,
  Patch, Post, Query, Res, UploadedFile, UseInterceptors, UploadedFiles
} from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';
import { CloudService } from './cloud.service';

@Controller('cloud')
export class CloudController {
  constructor(
    private readonly cloudService: CloudService
  ) {

  }
  //----------- Document module - Drive - Cloud

  @Post('create-folder')
  createFolder(@Body('path') folderPath: string): string {
    return this.cloudService.createFolder(folderPath);
  }

  @Get('list-files/:folderPath')
  listFiles(@Param('folderPath') folderPath: string): string[] {
    return this.cloudService.listFiles(folderPath);
  }

  @Get('folders')
  getAllFolders(): string[] {
    return this.cloudService.getAllFolders();
  }

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folderName') folderName: string
  ): string {
    console.log(folderName);
    console.log(file);

    if (!folderName) {
      throw new BadRequestException('Folder name is required');
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.cloudService.uploadFile(folderName, file);
  }

  @Get('search-files')
  searchFiles(@Query('term') searchTerm: string): string[] {
    return this.cloudService.searchItems(searchTerm);
  }

  @Get('drive-structure')
  getDriveStructure(): any {
    return this.cloudService.getDriveStructure();
  }

  @Delete('delete-file')
  deleteFile(
    @Body('folderPath') folderPath: string,
    @Body('fileName') fileName: string,
  ): string {
    return this.cloudService.deleteFile(folderPath);
  }

  @Delete('delete-folder')
  deleteFolder(@Body('path') folderPath: string): string {
    return this.cloudService.deleteFolder(folderPath);
  }

  @Get('download-file')
  downloadFile(
    @Query('folderPath') folderPath: string,

  ) {
    return this.cloudService.downloadFile(folderPath);
  }

  @Get('download-folder')
  downloadFolder(@Query('folderPath') folderPath: string) {
    return this.cloudService.downloadFolder(folderPath);
  }
  @Patch('rename')
  rename(@Body('oldPath') oldPath: string, @Body('newName') newName: string) {
    this.cloudService.rename(oldPath, newName);
    return { message: 'Renamed successfully' };
  }
  @Post('create-file')
  createFile(
    @Body('folderPath') folderPath: string,
    @Body('fileName') fileName: string,
    @Body('content') content: string,
  ): string {
    return this.cloudService.createFile(folderPath, fileName, content);
  }
  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join('D:/c/Typescript/Compserv_MiniProjects/drive/drive', filename);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(404).send('File not found');
      }
    });
  }
  //----------- Document module - Drive - Cloud End
}

