// run-features.mjs — a Gherkin runner in 90 lines, with no dependencies.
//
// Why not cucumber-js: this challenge ships zero npm packages on purpose
// (no install, no lockfile, no build — it has to run on a locked-down
// laptop in a few hours). The repo's suite contract still wants BDD
// scenarios tagged with acceptance ids, and the scenarios are worth more
// to ERI than the test runner underneath them, so here is the runner.
//
// Behaviour that matters: an UNMATCHED step is a FAILURE, never a skip.
// A scenario that silently does nothing is the fake-green shape.
//
//   node scripts/run-features.mjs features/workday.feature

import { readFileSync } from 'node:fs';
import { defs } from '../features/steps.mjs';

const KEYWORDS = /^(Given|When|Then|And|But)\s+(.*)$/;

export function parseFeature(text) {
  const feature = { name: '', background: [], scenarios: [] };
  let tags = [];
  let target = null;

  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (line === '' || line.startsWith('#')) continue;

    if (line.startsWith('@')) {
      tags = tags.concat(line.split(/\s+/).filter((t) => t.startsWith('@')));
      continue;
    }
    if (line.startsWith('Feature:')) {
      feature.name = line.slice('Feature:'.length).trim();
      tags = [];
      target = null;
      continue;
    }
    if (line.startsWith('Background:')) {
      target = feature.background;
      tags = [];
      continue;
    }
    if (line.startsWith('Scenario:')) {
      const scenario = { name: line.slice('Scenario:'.length).trim(), tags, steps: [] };
      feature.scenarios.push(scenario);
      target = scenario.steps;
      tags = [];
      continue;
    }
    const step = line.match(KEYWORDS);
    if (step && target) {
      target.push({ keyword: step[1], text: step[2].trim() });
      continue;
    }
    // Narrative lines under Feature: are documentation, not steps.
    if (!step && target === null) continue;
  }
  return feature;
}

function runStep(world, step) {
  for (const def of defs) {
    const match = step.text.match(def.pattern);
    if (match) {
      def.fn(world, ...match.slice(1));
      return;
    }
  }
  throw new Error(`no step definition for: ${step.keyword} ${step.text}`);
}

function main(argv) {
  const file = argv[2];
  if (!file) {
    console.log('Usage: node scripts/run-features.mjs features/workday.feature');
    return 2;
  }
  const feature = parseFeature(readFileSync(file, 'utf8'));
  console.log(`Feature: ${feature.name}`);

  let passed = 0;
  const failures = [];

  for (const scenario of feature.scenarios) {
    const world = {};
    try {
      for (const step of [...feature.background, ...scenario.steps]) {
        runStep(world, step);
      }
      passed += 1;
      console.log(`  ok   ${scenario.tags.join(' ')} ${scenario.name}`);
    } catch (error) {
      failures.push({ scenario, error });
      console.log(`  FAIL ${scenario.tags.join(' ')} ${scenario.name}`);
      console.log(`         ${error.message.split('\n')[0]}`);
    }
  }

  console.log(`\n${passed} scenario(s) passed, ${failures.length} failed`);
  if (feature.scenarios.length === 0) {
    console.log('No scenarios found. Refusing to report a pass.');
    return 2;
  }
  return failures.length === 0 ? 0 : 1;
}

process.exitCode = main(process.argv);
