import { Injectable } from '@nestjs/common';
import { createCanvas, loadImage } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CardRendererService {
  async compileCard(species: string, evolution: number, weapon?: string): Promise<Buffer> {
    const canvas = createCanvas(1200, 675);
    const ctx = canvas.getContext('2d');
    
    // 1. Draw card layout frame background
    ctx.fillStyle = '#F2F2EC';
    ctx.fillRect(0, 0, 1200, 675);

    // Draw borders
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 15;
    ctx.strokeRect(20, 20, 1160, 635);
    
    // 2. Draw layered companion assets in the center
    const assetsDir = path.resolve(__dirname, '../../../apps/web/public/assets');
    const bodyPath = path.join(assetsDir, `pets/${species}/base.png`);
    const outfitPath = path.join(assetsDir, `pets/${species}/outfit_stage_${evolution}.png`);
    const weaponPath = weapon ? path.join(assetsDir, `equipments/${weapon}.png`) : '';

    let drawnImage = false;

    try {
      // Check if files exist to draw them
      if (fs.existsSync(bodyPath) && fs.existsSync(outfitPath)) {
        const body = await loadImage(bodyPath);
        const outfit = await loadImage(outfitPath);
        
        ctx.drawImage(body, 450, 150, 300, 300);
        ctx.drawImage(outfit, 450, 150, 300, 300);

        if (weapon && fs.existsSync(weaponPath)) {
          const weaponImg = await loadImage(weaponPath);
          ctx.drawImage(weaponImg, 450, 150, 300, 300);
        }
        drawnImage = true;
      }
    } catch (err) {
      console.warn('Failed to load layered sprites, falling back to text drawings:', err);
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
      const buf = canvas.toBuffer('image/webp' as any);
      if (buf) return buf;
    } catch (err) {
      console.warn('WebP conversion not supported on this platform, falling back to PNG');
    }
    return canvas.toBuffer('image/png');
  }
}
