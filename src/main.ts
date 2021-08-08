import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ErrorHandlingConfig } from './config/exception/error.handling.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  addSwagger(app);
  app.useGlobalFilters(new ErrorHandlingConfig());
  const port = parseInt(process.env.PORT, 10);
  await app.listen(port, () => {
    Logger.log(`reactive-github-repositories-api service is running on port ${port}`);
  });
}
function addSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Reactive github repositories API')
    .setDescription('This API consumes GitHub APis and return repositories results in reactive style')
    .addServer(process.env.BASE_PATH)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
}

bootstrap();
