import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class R2Service {
  async uploadCard(companionId: string, cardBuffer: Buffer): Promise<string> {
    // If Cloudflare R2 credentials are set up, we would upload to the R2 bucket.
    // For local fallback and testing, we save the generated card to the public directory.
    const uploadsDir = path.resolve(__dirname, '../../../../apps/web/public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `companion_${companionId}_card.webp`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, cardBuffer);

    const r2Url = process.env.R2_ENDPOINT 
      ? `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${filename}`
      : `http://localhost:3000/uploads/${filename}`;
      
    console.log(`[R2 Service] Saved card buffer to: ${filepath}`);
    return r2Url;
  }
}
