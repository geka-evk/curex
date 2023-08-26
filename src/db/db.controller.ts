import { Controller, Get } from '@nestjs/common';
import { DbImportService } from './db-import.service';

@Controller('db')
export class DbController {
  constructor(private readonly dbImportService: DbImportService) {}

  @Get('import')
  async import() {
    // todo: think, which params to accept if we need to import from uploaded file
    return this.dbImportService.importFileContentToDb();
  }
}
