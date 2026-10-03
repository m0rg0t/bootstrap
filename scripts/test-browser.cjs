'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
(async () => {
  const root = process.cwd();
  const server = http.createServer(async (req, res) => {
    try {
      const file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
      if (!file.startsWith(root + path.sep)) throw new Error('Outside fixture root');
      let body = await fs.readFile(file);
      const suite = new URL(req.url, 'http://localhost').searchParams.get('suite');
      if (file.endsWith('/js/tests/index.html') && (suite === 'dist' || suite === 'min')) {
        body = body.toString().replace(/<!--  plugin sources -->[\s\S]*?<!-- unit tests -->/, '<script src="/dist/js/bootstrap' + (suite === 'min' ? '.min' : '') + '.js"></script><!-- unit tests -->');
      }
      res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html');
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
    for (const suite of ['source', 'dist', 'min']) {
    const page = await browser.newPage();
    const origin = `http://127.0.0.1:${server.address().port}`;
    const errors = [];
    page.on('pageerror', error => errors.push(error.stack || String(error)));
    await page.route('**/*', route => route.request().url().startsWith(origin + '/') ? route.continue() : route.abort());
    await page.goto(origin + '/js/tests/index.html?suite=' + suite);
    await page.waitForFunction(() => window.__results && window.__results.summary, null, { timeout: 120000 });
    const results = await page.evaluate(() => window.__results);
    results.pageErrors = errors;
    await fs.mkdir('test-results', { recursive: true });
    await fs.writeFile(`test-results/qunit-${suite}.json`, JSON.stringify(results, null, 2));
    await page.screenshot({ path: `test-results/qunit-${suite}.png`, fullPage: true });
    console.log(suite, JSON.stringify(results.summary));
    if (!results.summary.total || results.summary.failed || errors.length) throw new Error(JSON.stringify({ failures: results.failures, errors }));
    await page.close();
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
