import compression from 'compression';
import helmet from 'helmet';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

function setupSwagger(nestApp: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('ECM M&R API Documentation')
    .setDescription('The ECM M&R API documentation with hexagonal architecture')
    .setVersion('1.0')
    .addBearerAuth();

  if (process.env.NODE_ENV !== 'local') {
    options.addServer('/apimnr');
  }

  const document = SwaggerModule.createDocument(nestApp, options.build());
  SwaggerModule.setup('docs', nestApp, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      displayOperationId: true,
      displayRequestDuration: true,
      filter: true,
    },
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(compression());

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
