import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors();
  await app.listen(process.env.PORT || 3001);
  console.log(`NestJS API gateway running on port ${process.env.PORT || 3001}`);
}
bootstrap();
