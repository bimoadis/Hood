import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  
  const bodyParser = require('body-parser');
  app.use(
    bodyParser.json({
      verify: (req: any, res: any, buf: Buffer) => {
        req.rawBody = buf;
      },
    }),
  );
  app.use(bodyParser.urlencoded({ extended: true }));

  // Enable CORS
  app.enableCors();
  await app.listen(process.env.PORT || 3001);
  console.log(`NestJS API gateway running on port ${process.env.PORT || 3001}`);
}
bootstrap();
