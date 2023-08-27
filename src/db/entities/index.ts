import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export type TCurrencies = 'CAD' | 'AUD' | 'EUR' | 'UAH' | 'USD';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    unique: true,
    length: 3,
  })
  code: TCurrencies;

  @Column({ length: 50 })
  title: string;
}

abstract class CommonRateExchangeInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @ManyToOne(() => Currency, (cur) => cur.code)
  @JoinColumn({
    name: 'from',
    referencedColumnName: 'code',
  })
  from: Currency;

  @ApiProperty({ type: String })
  @ManyToOne(() => Currency, (cur) => cur.code)
  @JoinColumn({
    name: 'to',
    referencedColumnName: 'code',
  })
  to: Currency;

  @ApiProperty()
  @Column()
  date: Date;
}

@Entity()
export class Country {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    unique: true,
    length: 3,
  })
  code: string;

  @ApiProperty()
  @Column({ length: 50 })
  name: string;
}

@Entity()
export class ExchangeOffice {
  @ApiProperty()
  @PrimaryColumn()
  id: number;

  @ApiProperty()
  @Column({ length: 100 })
  name: string;

  @ApiProperty()
  @ManyToOne(() => Country, (c) => c.code, { nullable: false })
  @JoinColumn({
    name: 'country',
    referencedColumnName: 'code',
  })
  country: Country;

  @ApiProperty({ type: () => [Exchange] })
  @OneToMany(() => Exchange, (exchange) => exchange.exchangeOffice, {
    cascade: true,
  })
  exchanges: Exchange[];

  @ApiProperty({ type: () => [Rate] })
  @OneToMany(() => Rate, (rate) => rate.exchangeOffice, {
    cascade: true,
  })
  rates: Rate[];
  // think, if we need createdAt/updateAd-fields
}

@Entity()
export class Exchange extends CommonRateExchangeInfo {
  @ApiProperty()
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
  @ApiProperty()
  @Column('float')
  in: number;

  @ApiProperty()
  @Column('float')
  out: number;

  @ApiProperty()
  @Column('float')
  reserve: number;

  @ManyToOne(() => ExchangeOffice, (eo) => eo.rates, {
    nullable: false,
  })
  @JoinColumn()
  exchangeOffice: ExchangeOffice;
}
