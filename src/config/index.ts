import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const { env } = process;

export const pgDbConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT, 10),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: env.DB_SYNCHRONIZE === 'true',
});

export const fileUploadOptions = Object.freeze({
  limits: {
    fileSize: parseInt(env.UPLOAD_FILE_MAX_SIZE_BITES, 10) || 800,
  },
});
