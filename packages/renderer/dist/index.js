"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardRendererService = void 0;
const common_1 = require("@nestjs/common");
const canvas_1 = require("canvas");
const fs = require("fs");
const path = require("path");
let CardRendererService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CardRendererService = _classThis = class {
        async compileCard(name, species, evolution, weapon) {
            const canvas = (0, canvas_1.createCanvas)(1200, 675);
            const ctx = canvas.getContext('2d');
            // 1. Draw card layout frame background
            ctx.fillStyle = '#F2F2EC';
            ctx.fillRect(0, 0, 1200, 675);
            // Draw borders
            ctx.strokeStyle = '#10B981';
            ctx.lineWidth = 15;
            ctx.strokeRect(20, 20, 1160, 635);
            // 2. Draw layered companion assets in the center
            const uploadsDir = path.resolve(__dirname, '../../../apps/web/public/uploads');
            const assetsDir = path.resolve(__dirname, '../../../apps/web/public/assets');
            const normalizedName = name.toLowerCase().replace(' ', '_').replace('-', '_');
            const customImgPath = path.join(uploadsDir, `${normalizedName}.png`);
            const bodyPath = path.join(assetsDir, `pets/${species}/base.png`);
            const outfitPath = path.join(assetsDir, `pets/${species}/outfit_stage_${evolution}.png`);
            const weaponPath = weapon ? path.join(assetsDir, `equipments/${weapon}.png`) : '';
            let drawnImage = false;
            try {
                // Try to load custom full illustration first
                if (fs.existsSync(customImgPath)) {
                    const customImg = await (0, canvas_1.loadImage)(customImgPath);
                    ctx.drawImage(customImg, 450, 150, 300, 300);
                    drawnImage = true;
                }
                // Otherwise fallback to layered composition
                else if (fs.existsSync(bodyPath) && fs.existsSync(outfitPath)) {
                    const body = await (0, canvas_1.loadImage)(bodyPath);
                    const outfit = await (0, canvas_1.loadImage)(outfitPath);
                    ctx.drawImage(body, 450, 150, 300, 300);
                    ctx.drawImage(outfit, 450, 150, 300, 300);
                    if (weapon && fs.existsSync(weaponPath)) {
                        const weaponImg = await (0, canvas_1.loadImage)(weaponPath);
                        ctx.drawImage(weaponImg, 450, 150, 300, 300);
                    }
                    drawnImage = true;
                }
            }
            catch (err) {
                console.warn('Failed to load assets, falling back to text drawings:', err);
            }
            // Fallback vector outline if images are not present
            if (!drawnImage) {
                // Draw body base circle representation
                ctx.fillStyle = '#D1D5DB';
                ctx.beginPath();
                ctx.arc(600, 300, 120, 0, Math.PI * 2);
                ctx.fill();
                // Draw evolution jubah overlay
                ctx.fillStyle = '#047857';
                ctx.beginPath();
                ctx.arc(600, 300, 120, 0, Math.PI, false);
                ctx.fill();
                // Draw text overlays
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 24px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(`${species} Outlaw (Lvl ${evolution})`, 600, 310);
            }
            // 3. Draw Info overlays
            ctx.fillStyle = '#111827';
            ctx.font = 'bold 36px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`HOODLINGS OUTLAW REGISTRY`, 80, 100);
            ctx.fillStyle = '#4B5563';
            ctx.font = '24px monospace';
            ctx.fillText(`Species: ${species}`, 80, 480);
            ctx.fillText(`Evolution stage: ${evolution}`, 80, 520);
            if (weapon) {
                ctx.fillText(`Equipped weapon: ${weapon}`, 80, 560);
            }
            try {
                const buf = canvas.toBuffer('image/webp');
                if (buf)
                    return buf;
            }
            catch (err) {
                console.warn('WebP conversion not supported on this platform, falling back to PNG');
            }
            return canvas.toBuffer('image/png');
        }
    };
    __setFunctionName(_classThis, "CardRendererService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CardRendererService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CardRendererService = _classThis;
})();
exports.CardRendererService = CardRendererService;
