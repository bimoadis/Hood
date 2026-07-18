"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanionSchema = void 0;
const zod_1 = require("zod");
exports.CompanionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string(),
    name: zod_1.z.string(),
    species: zod_1.z.string(),
    personality: zod_1.z.string(),
    evolutionLvl: zod_1.z.number().default(1),
    level: zod_1.z.number().default(1),
    xp: zod_1.z.number().default(0),
    mood: zod_1.z.string().default('Happy'),
    energy: zod_1.z.number().default(100),
    health: zod_1.z.number().default(100),
    hunger: zod_1.z.number().default(0),
    happiness: zod_1.z.number().default(50),
    strength: zod_1.z.number().default(10),
    intelligence: zod_1.z.number().default(10),
    luck: zod_1.z.number().default(10),
    friendship: zod_1.z.number().default(0),
});
__exportStar(require("./roles"), exports);
