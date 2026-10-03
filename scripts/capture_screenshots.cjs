const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, '../docs/screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function captureAll() {
  console.log('🚀 Launching Chrome at:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // Pre-seed session storage to bypass splash screen directly to sovereign workspace
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem('hasSeenBrahmaSplash', 'true');
    localStorage.setItem('brahma-theme', 'obsidian');
  });

  console.log('🌐 Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Capture Main Cosmic Gold / Obsidian Workspace
  console.log('📸 1. Capturing Main Cosmic Gold Workspace...');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_cosmic_gold_workspace.png') });

  // 2. Switch to Mayura Teal Theme
  console.log('📸 2. Capturing Mayūra Teal Theme...');
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'teal');
    localStorage.setItem('brahma-theme', 'teal');
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_mayura_teal_theme.png') });

  // 3. Switch to Cyberpunk Kashi Theme
  console.log('📸 3. Capturing Cyberpunk Kashi Theme...');
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'cyberpunk');
    localStorage.setItem('brahma-theme', 'cyberpunk');
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_cyberpunk_kashi_theme.png') });

  // 4. Switch to Surya Solarized Theme
  console.log('📸 4. Capturing Sūrya Solarized Theme...');
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'surya');
    localStorage.setItem('brahma-theme', 'surya');
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_surya_solarized_theme.png') });

  // 5. Switch to Himalaya Zen Theme
  console.log('📸 5. Capturing Himālaya Zen Theme...');
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'zen');
    localStorage.setItem('brahma-theme', 'zen');
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_himalaya_zen_theme.png') });

  // 6. Capture Header Quick Actions Menu
  console.log('📸 6. Capturing Quick Actions Menu...');
  // Click the Sliders button (4th button in header-right)
  const buttons = await page.$$('.header-right .icon-action-btn');
  if (buttons.length >= 4) {
    await buttons[3].click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_header_quick_actions_menu.png') });
  }

  // 7. Capture 5-Minute Feedback Modal
  console.log('📸 7. Capturing 5-Minute Sovereign Feedback Modal...');
  // Click "Share Feedback" inside the quick actions or header
  const feedbackBtn = await page.$('button[title*="Feedback"], .header-right button:nth-child(4)');
  if (feedbackBtn) {
    // Or trigger via evaluating state / click
    await page.evaluate(() => {
      const allButtons = Array.from(document.querySelectorAll('button'));
      const fbBtn = allButtons.find(b => b.textContent.includes('Feedback') || b.title?.includes('Feedback'));
      if (fbBtn) fbBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_feedback_modal.png') });
  }

  console.log('✅ All screenshots captured successfully in:', SCREENSHOT_DIR);
  await browser.close();
}

captureAll().catch(err => {
  console.error('❌ Error capturing screenshots:', err);
  process.exit(1);
});
