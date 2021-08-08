import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorHandlingConfig } from './config/exception/error.handling.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ErrorHandlingConfig());
  await app.listen(3000);
}
bootstrap();
