import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class WebhookService {
  /**
   * Performs SHA256 Webhook signature validation.
   */
  verifyXSignature(payload: string, signature: string, clientSecret: string): boolean {
    if (!signature) return false;
    const hmac = crypto.createHmac('sha256', clientSecret).update(payload).digest('base64');
    
    const hmacBuffer = Buffer.from(hmac);
    const signatureBuffer = Buffer.from(signature);
    
    if (hmacBuffer.length !== signatureBuffer.length) {
      return false;
    }
    
    return crypto.timingSafeEqual(hmacBuffer, signatureBuffer);
  }

  /**
   * Handles CRC (Challenge-Response Check) verification token hashing.
   */
  verifyCRC(crcToken: string, clientSecret: string): { response_token: string } {
    if (!crcToken) {
      throw new BadRequestException('Missing crc_token');
    }
    const hash = crypto
      .createHmac('sha256', clientSecret)
      .update(crcToken)
      .digest('base64');

    return { response_token: `sha256=${hash}` };
  }
}
