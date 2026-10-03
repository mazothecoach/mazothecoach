// Renderiza precios.html a PNG 1080px de ancho (x2 para nitidez en IG).
// Uso: node render.js   ->  servicios-precios.png
const path = require('path');
let puppeteer;
try { puppeteer = require('puppeteer'); }
catch { puppeteer = require('C:/Users/fbast/OneDrive/Freelance/Linked In/node_modules/puppeteer'); }

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--allow-file-access-from-files']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1000, deviceScaleFactor: 2 });
  await page.goto(require('url').pathToFileURL(path.join(__dirname, 'precios.html')).href, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  const el = await page.$('#sheet');
  await el.screenshot({ path: path.join(__dirname, 'servicios-precios-v3.png') });
  const box = await el.boundingBox();
  console.log('ok', Math.round(box.width), 'x', Math.round(box.height), '(@2x)');
  await browser.close();
})();
