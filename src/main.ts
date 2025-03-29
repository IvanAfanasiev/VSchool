import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Укажите адрес вашего фронтенда * http://localhost:5173
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Укажите разрешенные HTTP методы
    credentials: true, // Включите, если работаете с cookies
  });
  await app.listen(process.env.PORT ?? 3000);
  app.enableCors();
}
bootstrap();
