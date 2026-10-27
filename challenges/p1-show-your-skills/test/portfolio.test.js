/*
 * Unit tests for the portfolio rules. IDs refer to spec/acceptance.md.
 * Run: node --test test/*.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  emptyPortfolio, setProfile, addSkill, removeSkill, addStatement, removeStatement,
  addExample, removeExample, examplesOf, mvpStatus, nonTextExampleCount,
  textAlternativeOf, previewShape, slugify, PortfolioError, PROFILE_FIELDS
} from '../web/portfolio.js';

const named = () => setProfile(emptyPortfolio(), { displayName: 'Jamie R.' });

describe('profile (P1-F1, P1-M1)', () => {
  it('keeps a display name without ever asking for a legal name', () => {
    const p = setProfile(emptyPortfolio(), { displayName: 'Jamie R.' });
    assert.equal(p.profile.displayName, 'Jamie R.');
    assert.deepEqual(PROFILE_FIELDS, ['displayName', 'interests', 'activities']);
  });

  it('takes interests and preferred work activities as lists or comma text', () => {
    const p = setProfile(emptyPortfolio(), {
      interests: ['Plants and gardens', 'Music'],
      activities: 'Mornings, Working with people'
    });
    assert.deepEqual(p.profile.interests, ['Plants and gardens', 'Music']);
    assert.deepEqual(p.profile.activities, ['Mornings', 'Working with people']);
  });

  it('P1-D1 refuses a field that is not one of ERI’s three', () => {
    assert.throws(() => setProfile(emptyPortfolio(), { disabilityType: 'x' }), PortfolioError);
    assert.throws(() => setProfile(emptyPortfolio(), { diagnosis: 'x' }), PortfolioError);
    assert.throws(() => setProfile(emptyPortfolio(), { accommodations: 'x' }), PortfolioError);
    assert.throws(() => setProfile(emptyPortfolio(), { supportNeeds: 'x' }), PortfolioError);
    assert.throws(() => setProfile(emptyPortfolio(), { favouriteColour: 'blue' }), PortfolioError);
  });

  it('does NOT censor the person’s own words about their own life', () => {
    // ERI's rule is that disclosure is never REQUIRED. It is not a rule that an
    // adult may not write a sentence. "Therapy" is also a workplace.
    const p = setProfile(emptyPortfolio(), { displayName: 'Sam', interests: ['Helping people'] });
    const withSkill = addSkill(p, { label: 'Reception work at a physical therapy clinic', source: 'custom' });
    assert.equal(withSkill.skills.length, 1);
  });
});

describe('skills (P1-F2, P1-M2)', () => {
  it('adds a skill from the list and a custom skill', () => {
    let p = named();
    p = addSkill(p, { id: 'greet-customers', label: 'Greet customers', source: 'list' });
    p = addSkill(p, { label: 'Water the plants', source: 'custom' });
    assert.deepEqual(p.skills.map((s) => s.source), ['list', 'custom']);
    assert.equal(p.skills[1].id, 'water-the-plants');
  });

  it('records three skills', () => {
    let p = named();
    for (const label of ['Organize supplies', 'Greet customers', 'Follow a checklist']) {
      p = addSkill(p, { label, source: 'list' });
    }
    assert.equal(p.skills.length, 3);
    assert.equal(mvpStatus(p).threeSkills, true);
  });

  it('refuses a blank skill and a duplicate skill, in plain words', () => {
    let p = addSkill(named(), { label: 'Greet customers', source: 'list' });
    assert.throws(() => addSkill(p, { label: '  ' }), /Give the skill a name first/);
    assert.throws(() => addSkill(p, { label: 'greet CUSTOMERS' }), /already on your portfolio/);
  });

  it('removing a skill takes its examples with it, leaving no orphans', () => {
    let p = addSkill(named(), { id: 'tidy', label: 'Tidy up', source: 'list' });
    p = addExample(p, { skillId: 'tidy', kind: 'written', title: 'Reset the tables', body: 'I clear and wipe each table.' });
    assert.equal(p.examples.length, 1);
    p = removeSkill(p, 'tidy');
    assert.equal(p.skills.length, 0);
    assert.equal(p.examples.length, 0);
  });

  it('slugify keeps ids simple and stable', () => {
    assert.equal(slugify('Greet Customers!'), 'greet-customers');
    assert.equal(slugify('  Follow a checklist  '), 'follow-a-checklist');
  });
});

describe('describe abilities (P1-F4)', () => {
  it('stores the person’s own sentence against a skill', () => {
    let p = addSkill(named(), { id: 'tidy', label: 'Tidy up', source: 'list' });
    p = addStatement(p, 'tidy', 'I am good at leaving a space clean.');
    assert.deepEqual(p.skills[0].statements, ['I am good at leaving a space clean.']);
  });

  it('is idempotent, and a sentence can be removed again', () => {
    let p = addSkill(named(), { id: 'tidy', label: 'Tidy up', source: 'list' });
    p = addStatement(p, 'tidy', 'I am good at this.');
    p = addStatement(p, 'tidy', 'I am good at this.');
    assert.equal(p.skills[0].statements.length, 1);
    p = removeStatement(p, 'tidy', 'I am good at this.');
    assert.equal(p.skills[0].statements.length, 0);
  });

  it('refuses an empty sentence and an unknown skill', () => {
    const p = addSkill(named(), { id: 'tidy', label: 'Tidy up', source: 'list' });
    assert.throws(() => addStatement(p, 'tidy', '   '), /Write or pick a sentence first/);
    assert.throws(() => addStatement(p, 'nope', 'Hello'), /Add that skill first/);
  });
});

describe('examples (P1-F3, P1-M3, P1-A4)', () => {
  const withSkill = () => addSkill(named(), { id: 'stock', label: 'Stock shelves', source: 'list' });

  it('adds a photo example that carries what the picture shows', () => {
    const p = addExample(withSkill(), {
      skillId: 'stock', kind: 'photo', title: 'A shelf I stocked',
      mediaId: 'photo-supply-shelf', alt: 'A shelf with boxes in a row and labels facing out.'
    });
    assert.equal(examplesOf(p, 'stock').length, 1);
    assert.match(textAlternativeOf(p.examples[0]), /boxes in a row/);
  });

  it('P1-A4 refuses a photo with no description', () => {
    assert.throws(
      () => addExample(withSkill(), { skillId: 'stock', kind: 'photo', title: 'A shelf', mediaId: 'x' }),
      /what the picture shows/
    );
  });

  it('P1-A4 refuses audio with no transcript and video with no captions', () => {
    assert.throws(
      () => addExample(withSkill(), { skillId: 'stock', kind: 'audio', title: 'Me talking' }),
      /transcript/
    );
    assert.throws(
      () => addExample(withSkill(), { skillId: 'stock', kind: 'video', title: 'Me working' }),
      /captions/
    );
  });

  it('accepts video with captions only, or with a transcript only', () => {
    const captioned = addExample(withSkill(), {
      skillId: 'stock', kind: 'video', title: 'Stocking', caption: 'I open the box. I face the labels out.'
    });
    assert.equal(captioned.examples.length, 1);
    const transcribed = addExample(withSkill(), {
      skillId: 'stock', kind: 'video', title: 'Stocking', transcript: 'Here is how I stock a shelf.'
    });
    assert.equal(transcribed.examples.length, 1);
  });

  it('refuses an unknown kind, a missing skill and a nameless example', () => {
    assert.throws(() => addExample(withSkill(), { skillId: 'stock', kind: 'hologram', title: 'x' }), /photo, a video/);
    assert.throws(() => addExample(withSkill(), { skillId: 'ghost', kind: 'written', title: 'x', body: 'y' }), /which skill/);
    assert.throws(() => addExample(withSkill(), { skillId: 'stock', kind: 'written', title: '', body: 'y' }), /short name/);
  });

  it('counts non-text examples for ERI §8, and written ones do not count', () => {
    let p = addExample(withSkill(), {
      skillId: 'stock', kind: 'written', title: 'What I do', body: 'I stock the shelves each morning.'
    });
    assert.equal(nonTextExampleCount(p), 0);
    p = addExample(p, {
      skillId: 'stock', kind: 'photo', title: 'A shelf', mediaId: 'm', alt: 'A stocked shelf.'
    });
    assert.equal(nonTextExampleCount(p), 1);
  });

  it('an example can be removed without touching the skill', () => {
    let p = addExample(withSkill(), {
      skillId: 'stock', kind: 'written', title: 'Morning run', body: 'I stock before we open.'
    });
    p = removeExample(p, p.examples[0].id);
    assert.equal(p.examples.length, 0);
    assert.equal(p.skills.length, 1);
  });
});

describe('progress (P1-M4) is a checklist, never a score', () => {
  it('reports the five MVP steps as booleans only', () => {
    const status = mvpStatus(emptyPortfolio());
    assert.deepEqual(Object.keys(status), ['profile', 'threeSkills', 'oneExample', 'canPreview', 'canShare']);
    for (const value of Object.values(status)) assert.equal(typeof value, 'boolean');
  });

  it('needs a name, three skills and an example before it says ready to share', () => {
    let p = named();
    assert.equal(mvpStatus(p).canShare, false);
    for (const label of ['Organize supplies', 'Greet customers', 'Follow a checklist']) {
      p = addSkill(p, { label, source: 'list' });
    }
    assert.equal(mvpStatus(p).canShare, false);
    p = addExample(p, {
      skillId: 'organize-supplies', kind: 'written', title: 'The shelf', body: 'I set up the supply shelf.'
    });
    assert.equal(mvpStatus(p).canShare, true);
  });
});

describe('preview (P1-F5)', () => {
  it('shows every skill with its own sentences and examples', () => {
    let p = addSkill(named(), { id: 'tidy', label: 'Tidy up', source: 'list' });
    p = addStatement(p, 'tidy', 'I am good at leaving a space clean.');
    p = addExample(p, { skillId: 'tidy', kind: 'written', title: 'Tables', body: 'I reset the tables.' });
    const shape = previewShape(p);
    assert.equal(shape.skills[0].statements.length, 1);
    assert.equal(shape.skills[0].examples.length, 1);
    assert.equal(shape.preview, true);
  });
});
