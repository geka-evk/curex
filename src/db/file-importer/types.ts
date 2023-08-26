export const countriesField = 'countries';
export const exchangeOfficesField = 'exchange-offices';

// raw JSON structures
export type TCountryList = { code: string }[];
export type TExchangeOfficeList = { id: string }[];

export type TJsonContent = {
  [countriesField]?: TCountryList;
  [exchangeOfficesField]?: TExchangeOfficeList;
};
