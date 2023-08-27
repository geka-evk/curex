import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('curex-app')
    .setDescription('AYA task to parse file with indents and store it in DB')
    .setVersion('1.0')
    .addTag('import')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  const config = app.get(ConfigService);
  const port = config.get<number>('HTTP_PORT');
  await app.listen(port);
}
bootstrap();
