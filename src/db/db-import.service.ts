import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Country, ExchangeOffice } from './entities';
import { FileImporter } from './file-importer';
import {
  TJsonContent,
  TCountryList,
  TExchangeOfficeList,
  countriesField,
  exchangeOfficesField,
} from './file-importer/types';

@Injectable()
export class DbImportService {
  private readonly logger = new Logger(DbImportService.name);

  constructor(
    private readonly fileImporter: FileImporter,

    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,

    @InjectRepository(ExchangeOffice)
    private readonly exchangeOfficeRepo: Repository<ExchangeOffice>,
  ) {}

  async importFileContentToDb() {
    const content: TJsonContent = await this.loadContentFromFile();
    if (!content) {
      this.logger.warn(`Failed to load content from import file`);
      return {
        countries: [],
        offices: [],
      };
    }

    const countries = await this.importCountries(content[countriesField]);
    const offices = await this.importExchangeOffices(
      content[exchangeOfficesField],
    );
    this.logger.log('importFromFile is done');

    return {
      countries,
      offices,
    };
  }

  async importCountries(countryList: TCountryList): Promise<Country[] | []> {
    const codes = countryList.map((c) => c.code);
    const dbData = await this.countryRepo.findBy({ code: In(codes) });

    const codesInDb: string[] = dbData.map((c) => c.code);
    const newCountries = countryList.filter((c) => !codesInDb.includes(c.code));
    if (!newCountries.length) {
      this.logger.log('No new countries to import');
      return [];
    }
    const countries = newCountries.map((c) => Object.assign(new Country(), c));

    return this.countryRepo.save(countries);
  }

  async importExchangeOffices(
    eoList: TExchangeOfficeList,
  ): Promise<ExchangeOffice[] | []> {
    const ids = eoList.map((eo) => Number(eo.id));
    const dbData = await this.exchangeOfficeRepo.findBy({ id: In(ids) });

    const idsInDb: number[] = dbData.map((eo) => eo.id);
    const newEOs = eoList.filter((eo) => !idsInDb.includes(Number(eo.id)));
    if (!newEOs.length) {
      this.logger.log('No new exchangeOffices to import');
      return [];
    }
    const offices = newEOs.map((eo) => Object.assign(new ExchangeOffice(), eo));

    return this.exchangeOfficeRepo.save(offices);
  }
  // todo: move common logic of filtering existing entities to one place

  async loadContentFromFile(fileName?: string): Promise<TJsonContent | null> {
    return this.fileImporter.importFromFile(fileName);
  }
}
