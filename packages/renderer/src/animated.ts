import { createCanvas, loadImage } from 'canvas';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import * as path from 'path';
import * as fs from 'fs';

const W = 1200;
const H = 675;
const FPS = 12;
const FRAMES = 24; // 2 seconds at 12 FPS

export async function renderAnimatedCard(
  name: string,
  species: string,
  evolution: number,
  weapon?: string,
  health: number = 100,
  energy: number = 100,
  hunger: number = 0
): Promise<Buffer> {
  const rootDir = process.cwd();
  
  // 1. Render the static background layer ONCE
  const bgCanvas = createCanvas(W, H);
  const bgCtx = bgCanvas.getContext('2d');
  
  // Background style
  bgCtx.fillStyle = '#F2F2EC';
  bgCtx.fillRect(0, 0, W, H);

  // Borders
  bgCtx.strokeStyle = '#10B981';
  bgCtx.lineWidth = 15;
  bgCtx.strokeRect(20, 20, W - 40, H - 40);

  // Outlaw Registry text
  bgCtx.fillStyle = '#111827';
  bgCtx.font = 'bold 36px monospace';
  bgCtx.textAlign = 'left';
  bgCtx.fillText(`HOODIEWORLD OUTLAW REGISTRY`, 80, 100);

  bgCtx.fillStyle = '#4B5563';
  bgCtx.font = '24px monospace';
  bgCtx.fillText(`Species: ${species}`, 80, 480);
  bgCtx.fillText(`Evolution stage: ${evolution}`, 80, 520);
  if (weapon) {
    bgCtx.fillText(`Equipped weapon: ${weapon}`, 80, 560);
  }

  // Load assets
  const assetsDir = path.join(rootDir, 'apps/web/public/assets');
  const bodyPath = path.join(assetsDir, `pets/${species}/base.png`);
  const outfitPath = path.join(assetsDir, `pets/${species}/outfit_stage_${evolution}.png`);
  const weaponPath = weapon ? path.join(assetsDir, `equipments/${weapon}.png`) : '';

  let body: any = null;
  let outfit: any = null;
  let weaponImg: any = null;

  try {
    if (fs.existsSync(bodyPath) && fs.existsSync(outfitPath)) {
      body = await loadImage(bodyPath);
      outfit = await loadImage(outfitPath);
      if (weapon && fs.existsSync(weaponPath)) {
        weaponImg = await loadImage(weaponPath);
      }
    }
  } catch (err) {
    console.warn('Failed to load assets for animation, using fallback outlines:', err);
  }

  // Initialize GIF Encoder
  const gif = new GIFEncoder();
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < FRAMES; f++) {
    const t = f / FRAMES;
    ctx.clearRect(0, 0, W, H);
    
    // Draw the pre-composited background image/canvas
    ctx.drawImage(bgCanvas, 0, 0);

    // Draw Stats Text & Background Tracks
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('HEALTH', 80, 180);
    ctx.fillText('ENERGY', 80, 260);
    ctx.fillText('HUNGER', 80, 340);

    ctx.fillStyle = '#E5E7EB';
    ctx.fillRect(80, 195, 300, 15);
    ctx.fillRect(80, 275, 300, 15);
    ctx.fillRect(80, 355, 300, 15);

    // Animated progress multiplier (fills first 1 second, then holds)
    const fillProgress = Math.min(1, t * 2);

    // Draw Stats Filled Values
    ctx.fillStyle = '#EF4444'; // Health
    ctx.fillRect(80, 195, 300 * fillProgress * (health / 100), 15);

    ctx.fillStyle = '#3B82F6'; // Energy
    ctx.fillRect(80, 275, 300 * fillProgress * (energy / 100), 15);

    ctx.fillStyle = '#F59E0B'; // Hunger
    ctx.fillRect(80, 355, 300 * fillProgress * (hunger / 100), 15);

    // Sine-wave breathing / bobbing effect (amplitude: 3px)
    const bob = Math.sin(t * Math.PI * 2) * 3;

    if (body && outfit) {
      // Draw standard animated layers
      ctx.drawImage(body, 450, 150 + bob, 300, 300);
      ctx.drawImage(outfit, 450, 150 + bob, 300, 300);
      if (weaponImg) {
        ctx.drawImage(weaponImg, 450, 150 + bob, 300, 300);
      }
    } else {
      // Draw vector fallback animation
      ctx.fillStyle = '#D1D5DB';
      ctx.beginPath();
      ctx.arc(600, 300 + bob, 120, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.arc(600, 300 + bob, 120, 0, Math.PI, false);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${species} Outlaw (Lvl ${evolution})`, 600, 310 + bob);
    }

    // Capture RGBA pixel data
    const imgData = ctx.getImageData(0, 0, W, H);
    const pixelData = new Uint8Array(imgData.data);

    // Quantize and write frame
    const palette = quantize(pixelData, 256);
    const index = applyPalette(pixelData, palette);
    gif.writeFrame(index, W, H, {
      palette,
      delay: Math.round(1000 / FPS),
    });
  }

  gif.finish();
  return Buffer.from(gif.bytes());
}
