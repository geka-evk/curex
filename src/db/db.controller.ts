import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import { fileUploadOptions } from '../config';
import { DbImportService } from './db-import.service';

@Controller('db')
export class DbController {
  constructor(private readonly dbImportService: DbImportService) {}

  @Get('import')
  async import(@Query('filename') fileName?: string) {
    return this.dbImportService.importFileFromDiskToDb(fileName);
  }

  @Post('import-file')
  @UseInterceptors(FileInterceptor('file', fileUploadOptions))
  async handleFileImport(@UploadedFile() file: Express.Multer.File) {
    return this.dbImportService.uploadFileToDb(file.buffer.toString());
  }
}
