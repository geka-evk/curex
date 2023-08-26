import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DbImportService } from './db/db-import.service';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dbImportService = app.get(DbImportService);
  await dbImportService.importFileContentToDb();
  process.exit(0);
}
bootstrap();
