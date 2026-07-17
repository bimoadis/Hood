import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from './webhook.service';
import { BadRequestException } from '@nestjs/common';

describe('WebhookService', () => {
  let service: WebhookService;
  const testSecret = 'secret_key_123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookService],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
  });

  describe('verifyCRC', () => {
    it('should generate a valid challenge token hash', () => {
      const result = service.verifyCRC('token_abc', testSecret);
      expect(result.response_token).toContain('sha256=');
    });

    it('should throw BadRequestException if crc_token is missing', () => {
      expect(() => service.verifyCRC('', testSecret)).toThrow(BadRequestException);
    });
  });

  describe('verifyXSignature', () => {
    it('should validate matching payload signature hashes', () => {
      const payload = JSON.stringify({ event: 'test' });
      const crypto = require('crypto');
      const signature = crypto
        .createHmac('sha256', testSecret)
        .update(payload)
        .digest('base64');

      const isValid = service.verifyXSignature(payload, signature, testSecret);
      expect(isValid).toBe(true);
    });

    it('should reject invalid mismatched signatures', () => {
      const payload = JSON.stringify({ event: 'test' });
      const isValid = service.verifyXSignature(payload, 'wrong_sign', testSecret);
      expect(isValid).toBe(false);
    });
  });
});
