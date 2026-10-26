// Browser test: accessibility (axe) + no network calls, for the PHP-rendered
// gap table. Mirrors challenge 02's e2e/a11y.test.mjs so both challenges are
// judged against rule 6 the same way; the only difference is that this page is
// served by `php -S` rather than a static node server.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer, connect } from 'node:net';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const docroot = new URL('../public/', import.meta.url).pathname;
let php, browser, base;

/** Ask the OS for a port nothing is using, then release it for php -S. */
function freePort() {
  return new Promise((resolve, reject) => {
    const s = createServer();
    s.once('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });
}

/** Poll until the server accepts a connection, rather than sleeping a guess. */
async function waitForPort(port, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const up = await new Promise((resolve) => {
      const c = connect(port, '127.0.0.1');  // a real connection attempt, not a sleep
      c.once('connect', () => { c.end(); resolve(true); });
      c.once('error', () => resolve(false));
    });
    if (up) return;
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error(`php -S never accepted a connection on ${port}`);
}

before(async () => {
  const port = await freePort();
  base = `http://127.0.0.1:${port}`;
  php = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', docroot], { stdio: 'ignore' });
  php.on('error', (e) => { throw new Error(`could not start php -S: ${e.message}`); });
  await waitForPort(port);
  browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
  );
});

after(async () => {
  await browser?.close();
  php?.kill();
});

test('AC-01.a11y page has no axe violations, unfiltered and filtered', async () => {
  const page = await (await browser.newContext()).newPage();  // axe needs a page from a context
  await page.goto(base);
  assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations.map((v) => v.id), []);

  // The filter is a full page reload, so re-scan the rendered result.
  await page.selectOption('#funder', 'DVR');
  await page.click('form button');
  await page.waitForLoadState('load');
  assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations.map((v) => v.id), []);
});

test('rule 1 is visible to the user, not only true in the data', async () => {
  const page = await (await browser.newContext()).newPage();
  await page.goto(base);
  assert.match(await page.textContent('body'), /synthetic data/i);
});

test('rule 5 is visible: flags are for human review, nothing bills itself', async () => {
  const page = await (await browser.newContext()).newPage();
  await page.goto(base);
  const body = await page.textContent('body');
  assert.match(body, /human review/i);
  assert.match(body, /nothing is billed automatically/i);
});

test('makes no requests beyond its own files', async () => {
  const page = await (await browser.newContext()).newPage();
  const external = [];
  page.on('request', (r) => { if (!r.url().startsWith(base)) external.push(r.url()); });
  await page.goto(base);
  await page.selectOption('#funder', 'Ticket');
  await page.click('form button');
  await page.waitForLoadState('load');
  assert.deepEqual(external, []);
});
