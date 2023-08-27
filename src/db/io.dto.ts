import { Country, ExchangeOffice } from './entities';
import { ApiProperty } from '@nestjs/swagger';

export class ImportResponseDto {
  countries: Country[];
  offices: ExchangeOffice[];
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
