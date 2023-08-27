import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { pgDbConfig } from './config';
import { DbModule } from './db/db.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  Country,
  Currency,
  Exchange,
  ExchangeOffice,
  Rate,
} from './db/entities';

@Module({
  imports: [
    DbModule,
    ConfigModule.forRoot({
      load: [pgDbConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRoot({
      ...pgDbConfig(),
      entities: [Country, ExchangeOffice, Exchange, Rate, Currency],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
