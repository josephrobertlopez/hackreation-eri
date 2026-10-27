/*
 * Prints a reload-safe share fragment for the prepared sample portfolio, so a
 * shell script can open the employer view in a real browser:
 *
 *   node test/helpers/make-link.mjs            # p=…
 *   node test/helpers/make-link.mjs --all      # the whole portfolio
 *   node test/helpers/make-link.mjs --one      # one skill only
 */

import { buildShare, fullShareSelection, defaultShareSelection, encodeShareLink } from '../../web/portfolio.js';
import { samplePortfolio } from '../../fixtures/sample-portfolio.js';

const portfolio = samplePortfolio();
const onlyOne = process.argv.includes('--one');
const selection = onlyOne
  ? { ...defaultShareSelection(), displayName: true, skillIds: ['greet-customers'] }
  : fullShareSelection(portfolio);

process.stdout.write(encodeShareLink(buildShare(portfolio, selection)));
