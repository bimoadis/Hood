"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const webhook_service_1 = require("./webhook.service");
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
describe('WebhookService', () => {
    let service;
    const testSecret = 'secret_key_123';
    beforeEach(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [webhook_service_1.WebhookService],
        }).compile();
        service = moduleRef.get(webhook_service_1.WebhookService);
    });
    describe('verifyCRC', () => {
        it('should generate a valid challenge token hash', () => {
            const result = service.verifyCRC('token_abc', testSecret);
            expect(result.response_token).toContain('sha256=');
        });
        it('should throw BadRequestException if crc_token is missing', () => {
            expect(() => service.verifyCRC('', testSecret)).toThrow(common_1.BadRequestException);
        });
    });
    describe('verifyXSignature', () => {
        it('should validate matching payload signature hashes', () => {
            const payload = JSON.stringify({ event: 'test' });
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
//# sourceMappingURL=webhook.service.spec.js.map