import {
  Controller,
  Get, HttpCode,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import { fileUploadOptions } from '../config';
import { DbImportService } from './db-import.service';
import { FileUploadDto, ImportResponseDto } from './io.dto';

@ApiTags('import')
@Controller('db')
export class DbController {
  constructor(private readonly dbImportService: DbImportService) {}

  @Get('import')
  @ApiQuery({ name: 'filename', required: false })
  async import(
    @Query('filename') fileName?: string,
  ): Promise<ImportResponseDto> {
    return this.dbImportService.importFileFromDiskToDb(fileName);
  }

  @Post('import-file')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file', fileUploadOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to import',
    type: FileUploadDto,
  })
  async handleFileImport(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImportResponseDto> {
    return this.dbImportService.uploadFileToDb(file.buffer.toString());
  }
}
