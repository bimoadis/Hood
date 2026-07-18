"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2Service = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let R2Service = class R2Service {
    async uploadCard(companionId, cardBuffer) {
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
};
exports.R2Service = R2Service;
exports.R2Service = R2Service = __decorate([
    (0, common_1.Injectable)()
], R2Service);
//# sourceMappingURL=r2.service.js.map