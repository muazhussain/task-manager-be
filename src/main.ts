import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ['*'],
          'frame-ancestors': ['*'],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
      frameguard: false,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );

  app.enableCors({ exposedHeaders: ['Content-Disposition'] });

  const basicAuthUser = process.env.BASIC_AUTH_USER || 'task_manager_api';
  const basicAuthPassword = process.env.BASIC_AUTH_PASSWORD || '123456';

  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [basicAuthUser]: basicAuthPassword,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'TASK MANAGER API')
    .setDescription(process.env.SWAGGER_DESCRIPTION || 'Task Manager Backend API using Microservice')
    .setVersion(process.env.SWAGGER_VERSION || '1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      caches: 'no-cache',
    },
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => console.log(`API server is running at ${PORT} 🚀`));
}
bootstrap();
