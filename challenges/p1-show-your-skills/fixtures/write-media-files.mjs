/*
 * Writes fixtures/media/<id>.svg from fixtures/media.js, so a judge can open
 * the sample imagery on its own without running the app.
 *
 *   node fixtures/write-media-files.mjs
 *
 * media.js is the single source of truth (the app and the exported portfolio
 * inline the markup, so they need it as a string). test/fixtures.test.js fails
 * if the files on disk and the strings in media.js disagree.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MEDIA } from './media.js';

const dir = join(dirname(fileURLToPath(import.meta.url)), 'media');
mkdirSync(dir, { recursive: true });

for (const [id, entry] of Object.entries(MEDIA)) {
  const path = join(dir, id + '.svg');
  writeFileSync(path, entry.svg + '\n', 'utf8');
  console.log('wrote', path);
}
