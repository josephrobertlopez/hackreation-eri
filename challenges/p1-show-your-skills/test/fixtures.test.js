/*
 * The sample data is a deliverable, not scaffolding: the 5-10 minute demo ERI
 * §8 asks for is only possible with prepared examples. So it gets tested like
 * code — including that the imagery on disk still matches the imagery the app
 * inlines, which is the thing that silently drifts.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

import { SKILLS, SKILL_GROUPS, SKILL_IDS, skillsByGroup, findSkill } from '../fixtures/skills.js';
import { WORK_EXAMPLES, examplesForSkill, toExampleInput } from '../fixtures/work-examples.js';
import { MEDIA, MEDIA_IDS } from '../fixtures/media.js';
import { INTEREST_OPTIONS, ACTIVITY_OPTIONS } from '../fixtures/profile-options.js';
import { samplePortfolio, SAMPLE_SKILL_IDS } from '../fixtures/sample-portfolio.js';
import {
  EXAMPLE_KINDS, REQUIRED_TEXT_ALTERNATIVE, textAlternativeOf, mvpStatus,
  nonTextExampleCount, PROTECTED_FIELD_PATTERN
} from '../web/portfolio.js';
import { ROOT } from './helpers/markup.js';

describe('skills vocabulary', () => {
  it('has unique ids and a real group for every skill', () => {
    assert.equal(new Set(SKILL_IDS).size, SKILLS.length);
    const groups = new Set(SKILL_GROUPS.map((g) => g.id));
    for (const skill of SKILLS) assert.ok(groups.has(skill.group), skill.id + ' has no group');
  });

  it('every skill has a plain sentence and at least one starter sentence', () => {
    for (const skill of SKILLS) {
      assert.ok(skill.plain.length > 10, skill.id + ' has no plain description');
      assert.ok(skill.starters.length >= 1, skill.id + ' has no starter sentence');
      for (const starter of skill.starters) {
        assert.match(starter, /^(I am good at|Here is something I can do)/, 'ERI §4 prompt wording');
      }
    }
  });

  it('every skill is something a person DOES, in few enough words to scan', () => {
    for (const skill of SKILLS) {
      assert.ok(skill.label.split(/\s+/).length <= 6, 'too long to scan: ' + skill.label);
      assert.doesNotMatch(skill.label, /\b(very|expert|advanced|basic|beginner|level|good at)\b/i,
        'a skill label must not grade the person: ' + skill.label);
    }
  });

  it('names no disability, diagnosis or support need anywhere (P1-D1)', () => {
    const everything = JSON.stringify({ SKILLS, SKILL_GROUPS, INTEREST_OPTIONS, ACTIVITY_OPTIONS });
    assert.doesNotMatch(everything, PROTECTED_FIELD_PATTERN);
  });

  it('groups partition the list with nothing lost', () => {
    const grouped = skillsByGroup().flatMap((g) => g.skills);
    assert.equal(grouped.length, SKILLS.length);
  });
});

describe('sample work examples', () => {
  it('has unique ids and points only at real skills', () => {
    assert.equal(new Set(WORK_EXAMPLES.map((e) => e.id)).size, WORK_EXAMPLES.length);
    for (const example of WORK_EXAMPLES) {
      assert.ok(example.skillIds.length >= 1, example.id + ' belongs to no skill');
      for (const id of example.skillIds) assert.ok(findSkill(id), example.id + ' points at unknown skill ' + id);
    }
  });

  it('every example carries the text alternative its kind requires (P1-A4)', () => {
    for (const example of WORK_EXAMPLES) {
      assert.ok(EXAMPLE_KINDS.includes(example.kind), example.id + ' has kind ' + example.kind);
      const alternative = textAlternativeOf(example);
      assert.ok(
        alternative.length > 10,
        example.id + ' (' + example.kind + ') needs one of: ' + REQUIRED_TEXT_ALTERNATIVE[example.kind].join(', ')
      );
    }
  });

  it('covers every kind ERI §4 lists: photo, video, audio and written', () => {
    const kinds = new Set(WORK_EXAMPLES.map((e) => e.kind));
    for (const kind of EXAMPLE_KINDS) assert.ok(kinds.has(kind), 'no sample of kind ' + kind);
  });

  it('every media reference resolves, and the kinds agree', () => {
    for (const example of WORK_EXAMPLES) {
      if (!example.mediaId) continue;
      assert.ok(MEDIA[example.mediaId], example.id + ' points at missing media ' + example.mediaId);
      assert.equal(MEDIA[example.mediaId].kind, example.kind, example.id + ' kind/media mismatch');
    }
  });

  it('marks its audio and video as stand-ins, since nothing is recorded', () => {
    for (const example of WORK_EXAMPLES) {
      if (example.kind === 'audio' || example.kind === 'video') {
        assert.equal(example.sampleStandIn, true, example.id + ' must say it is a stand-in');
      }
    }
  });

  it('every skill ERI’s demo needs has a sample example ready to add', () => {
    for (const id of SAMPLE_SKILL_IDS) {
      assert.ok(examplesForSkill(id).length >= 1, 'no prepared example for ' + id);
    }
  });

  it('toExampleInput keeps the alternative text when reshaping for one skill', () => {
    for (const example of WORK_EXAMPLES) {
      const input = toExampleInput(example, example.skillIds[0]);
      assert.equal(textAlternativeOf(input), textAlternativeOf(example));
      assert.equal(input.skillId, example.skillIds[0]);
    }
  });
});

describe('sample imagery', () => {
  it('is inline SVG with a title and a description, every one', () => {
    for (const [id, entry] of Object.entries(MEDIA)) {
      assert.match(entry.svg, /^<svg /, id + ' is not inline SVG');
      assert.match(entry.svg, /<title[^>]*>[^<]{8,}<\/title>/, id + ' has no useful <title>');
      assert.match(entry.svg, /<desc[^>]*>[^<]{20,}<\/desc>/, id + ' has no useful <desc>');
      assert.match(entry.svg, /role="img"/, id + ' is not announced as an image');
      assert.match(entry.svg, /aria-labelledby="/, id + ' does not point at its title and desc');
      assert.ok(entry.alt && entry.alt.length > 20, id + ' has no alt text for the HTML path');
    }
  });

  it('fetches nothing: no external image, no stylesheet, no remote href', () => {
    for (const [id, entry] of Object.entries(MEDIA)) {
      assert.doesNotMatch(entry.svg, /<image\b/i, id + ' embeds a raster image');
      assert.doesNotMatch(entry.svg, /href\s*=/i, id + ' has a link in it');
      assert.doesNotMatch(entry.svg, /https?:\/\/(?!www\.w3\.org\/2000\/svg)/i, id + ' reaches off the page');
      assert.doesNotMatch(entry.svg, /<script/i, id + ' has script in it');
    }
  });

  it('matches fixtures/media/*.svg on disk (run npm run fixtures after editing)', () => {
    const dir = join(ROOT, 'fixtures', 'media');
    const onDisk = readdirSync(dir).filter((f) => f.endsWith('.svg')).sort();
    assert.deepEqual(onDisk, MEDIA_IDS.map((id) => id + '.svg').sort());
    for (const id of MEDIA_IDS) {
      const text = readFileSync(join(dir, id + '.svg'), 'utf8');
      assert.equal(text, MEDIA[id].svg + '\n', id + '.svg has drifted from fixtures/media.js');
    }
  });
});

describe('no binary files anywhere in this challenge (P1-D2)', () => {
  const ALLOWED = new Set(['.md', '.js', '.mjs', '.json', '.html', '.css', '.svg', '.sh', '']);
  it('every tracked file is text a reviewer can read in a diff', () => {
    const walk = (dir) => {
      for (const entry of readdirSync(dir)) {
        if (entry === 'node_modules' || entry === '.git') continue;
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) {
          walk(path);
          continue;
        }
        const ext = extname(entry);
        assert.ok(
          ALLOWED.has(ext) || entry === '.gitignore',
          'unexpected file type in the challenge folder: ' + path
        );
      }
    };
    walk(ROOT);
  });
});

describe('the prepared portfolio (P1-S2)', () => {
  const p = samplePortfolio();

  it('is ERI’s own demo: organize supplies, greet customers, follow a checklist', () => {
    assert.deepEqual(p.skills.map((s) => s.label), [
      'Organize supplies', 'Greet customers', 'Follow a checklist'
    ]);
  });

  it('passes all five MVP steps, so the demo can start from it', () => {
    const status = mvpStatus(p);
    assert.deepEqual(status, {
      profile: true, threeSkills: true, oneExample: true, canPreview: true, canShare: true
    });
  });

  it('demonstrates a skill without text (P1-S4)', () => {
    assert.ok(nonTextExampleCount(p) >= 1);
  });

  it('gives every skill a sentence of its own and at least one example', () => {
    for (const skill of p.skills) {
      assert.ok(skill.statements.length >= 1, skill.id + ' has no sentence');
      assert.ok(p.examples.some((e) => e.skillId === skill.id), skill.id + ' has no example');
    }
  });

  it('uses an invented name, not a real person’s', () => {
    assert.equal(p.profile.displayName, 'Jamie R.');
  });
});
