"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let WebhookService = class WebhookService {
    verifyXSignature(payload, signature, clientSecret) {
        if (!signature)
            return false;
        const cleanSignature = signature.startsWith('sha256=') ? signature.substring(7) : signature;
        const hmac = crypto.createHmac('sha256', clientSecret).update(payload).digest('base64');
        const hmacBuffer = Buffer.from(hmac);
        const signatureBuffer = Buffer.from(cleanSignature);
        if (hmacBuffer.length !== signatureBuffer.length) {
            return false;
        }
        return crypto.timingSafeEqual(hmacBuffer, signatureBuffer);
    }
    verifyCRC(crcToken, clientSecret) {
        if (!crcToken) {
            throw new common_1.BadRequestException('Missing crc_token');
        }
        const hash = crypto
            .createHmac('sha256', clientSecret)
            .update(crcToken)
            .digest('base64');
        return { response_token: `sha256=${hash}` };
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = __decorate([
    (0, common_1.Injectable)()
], WebhookService);
//# sourceMappingURL=webhook.service.js.map