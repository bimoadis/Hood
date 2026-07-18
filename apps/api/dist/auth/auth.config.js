"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetterAuthConfig = void 0;
const common_1 = require("@nestjs/common");
let BetterAuthConfig = class BetterAuthConfig {
    getStrategies() {
        return {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID || 'mock_google_id',
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock_google_secret',
            },
            discord: {
                clientId: process.env.DISCORD_CLIENT_ID || 'mock_discord_id',
                clientSecret: process.env.DISCORD_CLIENT_SECRET || 'mock_discord_secret',
            },
            twitter: {
                clientId: process.env.X_CLIENT_ID || 'mock_x_id',
                clientSecret: process.env.X_CLIENT_SECRET || 'mock_x_secret',
            },
        };
    }
};
exports.BetterAuthConfig = BetterAuthConfig;
exports.BetterAuthConfig = BetterAuthConfig = __decorate([
    (0, common_1.Injectable)()
], BetterAuthConfig);
//# sourceMappingURL=auth.config.js.map