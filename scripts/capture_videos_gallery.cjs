/**
 * BRAHMA Video Compositions Capture Script
 * Uses Puppeteer-Core with local Chrome to render and capture high-res thumbnails of all 7 compositions
 */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, '../public/videos/thumbnails');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const compositions = [
  { name: '01_hero_brand_title_takeover', width: 1280, height: 720 },
  { name: '02_empirical_benchmark_showdown', width: 1280, height: 720 },
  { name: '03_srshti_web_builder_timelapse', width: 1280, height: 720 },
  { name: '04_13_councils_neural_swarm', width: 1280, height: 720 },
  { name: '05_yantra_headless_browser_swarm', width: 1280, height: 720 },
  { name: '06_meta_coconut_latent_reasoning', width: 1280, height: 720 },
  { name: '07_viral_reels_dots_alternative', width: 420, height: 840 }
];

async function captureAll() {
  console.log('🚀 Launching Chrome for Video Compositions Thumbnail Render...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  for (const comp of compositions) {
    const filePath = path.join(__dirname, `../public/videos/${comp.name}.html`);
    const fileUrl = `file://${filePath.replace(/\\/g, '/')}`;
    console.log(`📸 Rendering ${comp.name}...`);
    
    await page.setViewport({ width: comp.width, height: comp.height, deviceScaleFactor: 2 });
    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
    
    // Wait for animations to progress 3 seconds into scene
    await new Promise(r => setTimeout(r, 3000));
    
    const outPath = path.join(OUTPUT_DIR, `${comp.name}.jpg`);
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 90 });
    console.log(`✓ Saved ${comp.name}.jpg`);
  }

  await browser.close();
  console.log('🎉 All 7 Video Compositions Thumbnails Successfully Rendered!');
}

captureAll().catch(err => {
  console.error('Error rendering thumbnails:', err);
  process.exit(1);
});
