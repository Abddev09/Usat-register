import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Barcha domenlarga ruxsat
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Ruxsat berilgan HTTP metodlar
    credentials: false, // Cookie yuborilishini ruxsat berma (agar kerak bo‘lsa true qil)
  });
  app.setGlobalPrefix('api')
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
