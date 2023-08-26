import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

abstract class CommonRateExchangeInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: Currencies;

  @Column()
  to: Currencies;

  @Column()
  date: Date;
}

export type Currencies = 'EUR' | 'USD' | 'UAH';

@Entity()
export class ExchangeOffice {
  @PrimaryColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Country, (c) => c.code)
  @JoinColumn({ referencedColumnName: 'code' })
  country: Currencies;

  @OneToMany(() => Exchange, (exchange) => exchange.exchangeOffice, {
    cascade: true,
  })
  exchanges: Exchange[];

  @OneToMany(() => Rate, (rate) => rate.exchangeOffice, {
    cascade: true,
  })
  rates: Rate[];
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

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    length: 3,
  })
  code: Currencies;

  @Column({ length: 50 })
  name: string;

  // think, if we need createdAt-field
}
