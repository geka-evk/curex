import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export type Currencies = 'CAD' | 'AUD' | 'EUR' | 'UAH' | 'USD';

abstract class CommonRateExchangeInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 3 })
  from: Currencies;

  @Column({ length: 3 })
  to: Currencies;

  @Column()
  date: Date;
}

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    length: 3,
  })
  code: string;

  @Column({ length: 50 })
  name: string;
}

@Entity()
export class ExchangeOffice {
  @PrimaryColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Country, (c) => c.code, { nullable: false })
  @JoinColumn({
    name: 'country',
    referencedColumnName: 'code',
  })
  country: Country;

  @OneToMany(() => Exchange, (exchange) => exchange.exchangeOffice, {
    cascade: true,
  })
  exchanges: Exchange[];

  @OneToMany(() => Rate, (rate) => rate.exchangeOffice, {
    cascade: true,
  })
  rates: Rate[];
  // think, if we need createdAt/updateAd-fields
}

@Entity()
export class Exchange extends CommonRateExchangeInfo {
  @Column('float')
  ask: number;

  @ManyToOne(() => ExchangeOffice, (eo) => eo.exchanges, {
    nullable: false,
  })
  @JoinColumn()
  exchangeOffice: ExchangeOffice;
}

@Entity()
export class Rate extends CommonRateExchangeInfo {
  @Column('float')
  in: number;

  @Column('float')
  out: number;

  @Column('float')
  reserve: number;

  @ManyToOne(() => ExchangeOffice, (eo) => eo.rates, {
    nullable: false,
  })
  @JoinColumn()
  exchangeOffice: ExchangeOffice;
}
