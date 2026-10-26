// Browser test: accessibility (axe) + behaviour + no network calls. Spec: AC-02.7, AC-02.8
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const root = new URL('../web/', import.meta.url).pathname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
let server, browser, base;

before(async () => {
  server = createServer(async (req, res) => {
    const p = join(root, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
    try { const body = await readFile(p); res.writeHead(200, { 'content-type': types[extname(p)] || 'text/plain' }); res.end(body); }
    catch { res.writeHead(404); res.end(); }
  }).listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
});
after(async () => { await browser?.close(); server?.close(); });

test('AC-02.7 page has no axe violations before and after a check', async () => {
  const page = await (await browser.newContext()).newPage();  // axe needs a page from a context
  await page.goto(base);
  assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations.map(v => v.id), []);
  await page.fill('#hours', '20'); await page.fill('#wage', '15');
  await page.check('input[value=SSI]'); await page.click('button[type=submit]');
  assert.equal(await page.evaluate(() => document.activeElement.tagName), 'H2');
  assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations.map(v => v.id), []);
});

test('AC-02.8 makes no requests beyond its own files', async () => {
  const page = await (await browser.newContext()).newPage();  // axe needs a page from a context
  const external = [];
  page.on('request', r => { if (!r.url().startsWith(base)) external.push(r.url()); });
  await page.goto(base);
  await page.fill('#hours', '20'); await page.fill('#wage', '15');
  await page.check('input[value=SSDI]'); await page.click('button[type=submit]');
  assert.deepEqual(external, []);
});
