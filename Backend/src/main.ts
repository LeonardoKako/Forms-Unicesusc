import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita validação global nos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão no DTO
      transform: true, // Converte tipos automaticamente (ex: string para número se decorado com Type)
    }),
  );

  // Habilita CORS para conexão com o Frontend
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
