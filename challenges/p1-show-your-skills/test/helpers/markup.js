/*
 * Enough HTML handling to assert on markup without a browser or a dependency.
 *
 * Honest about what it is: regex over markup, not a parser. It is good enough
 * for "does every input have a label", "is there a positive tabindex", "how
 * long are the sentences" — and it would be fooled by markup inside a comment
 * or an attribute value. Where a check needs a real browser (screen reader
 * output, computed contrast, actual focus order), spec/acceptance.md says so
 * and gives a human protocol instead of pretending.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export function readProjectFile(relativePath) {
  return readFileSync(join(ROOT, relativePath), 'utf8');
}

/** Opening tags of one element name, as raw strings. */
export function openingTags(html, tagName) {
  const re = new RegExp('<' + tagName + '\\b[^>]*>', 'gi');
  return html.match(re) || [];
}

/** Value of one attribute on a raw opening tag, or '' when absent. */
export function attr(rawTag, name) {
  const re = new RegExp('\\s' + name + '\\s*=\\s*"([^"]*)"', 'i');
  const match = rawTag.match(re);
  if (match) return match[1];
  const bare = new RegExp('\\s' + name + '(?=[\\s>])', 'i');
  return bare.test(rawTag) ? name : '';
}

/** Visible text: script, style, comments and tags removed. */
export function visibleText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&mdash;|&ndash;/g, '-')
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&hellip;/g, '...')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Rough sentence split, for a reading-ease check on UI copy. */
export function sentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

export function wordCount(sentence) {
  return sentence.split(/\s+/).filter(Boolean).length;
}

/**
 * Visible text one block at a time. Measuring sentence length over a whole
 * flattened page is wrong: a <title>, a skip link and an <h1> have no full
 * stops, so they glue into one 30-word "sentence" that nobody ever reads as
 * one. Reading ease is a property of a block.
 */
export function textBlocks(html) {
  const tags = 'title|h1|h2|h3|h4|h5|h6|p|li|legend|label|button|a|figcaption|td|th';
  const re = new RegExp('<(' + tags + ')\\b[^>]*>([\\s\\S]*?)</\\1>', 'gi');
  return [...html.matchAll(re)].map((m) => visibleText(m[2])).filter(Boolean);
}

/** Source with comments removed, for "this code contains no X" checks. */
export function stripJsComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|\s)\/\/[^\n]*/g, ' ');
}

/** Every form control in some markup, as {tag, raw, id, name, type}. */
export function formControls(html) {
  return ['input', 'textarea', 'select']
    .flatMap((tag) => openingTags(html, tag).map((raw) => ({ tag, raw })))
    .map((control) => ({
      ...control,
      id: attr(control.raw, 'id'),
      name: attr(control.raw, 'name'),
      type: attr(control.raw, 'type') || 'text'
    }));
}

/** The `for` value of every label in some markup. */
export function labelTargets(html) {
  return openingTags(html, 'label').map((raw) => attr(raw, 'for'));
}
