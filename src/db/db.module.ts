import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DbController } from './db.controller';
import { DbImportService } from './db-import.service';
import { FileImporter } from './file-importer';
import { Country, Exchange, ExchangeOffice, Rate } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country, ExchangeOffice, Exchange, Rate]),
  ],
  controllers: [DbController],
  providers: [DbImportService, FileImporter],
})
export class DbModule {}
