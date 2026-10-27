/*
 * The interaction budget, the menu depth, and the link between the model and
 * the screen.
 *
 * ERI section 8: "An employee can submit a request for assistance in three
 * interactions or fewer using predefined options."
 *
 * INTERACTION, defined (the same definition as src/flow.js and spec/acceptance.md):
 * one activation of one control by the employee - a tap, a click, or Enter or
 * Space on a focused control - counted from the home screen up to and
 * including the press that submits. Reading, scrolling, moving focus with Tab
 * and typing into the optional message box are not interactions.
 *
 * The shortest path is computed here, not asserted from a hard-coded list, so
 * adding a step anywhere in the flow turns this red.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  SCREENS, ALL_ACTIONS, REQUEST_PATH_SCREENS, createFlow,
  shortestPath, screenDepths, allSimplePaths, HOME, SUBMITTED
} from '../src/flow.js';
import { employeeScreen, EMPLOYEE_SCREEN_NAMES } from '../src/views.js';
import { read } from './helpers.mjs';

const INTERACTION_BUDGET = 3;

describe('P3-S1 three interactions or fewer', () => {
  it('the shortest route from the home screen to a submitted request is within budget', () => {
    const path = shortestPath(HOME, SUBMITTED);
    assert.ok(path, 'there is no route from the home screen to a submitted request at all');
    assert.ok(path.length <= INTERACTION_BUDGET,
      'submitting takes ' + path.length + ' interactions: ' + path.join(' -> '));
  });

  it('walking that route really does submit, and the counter agrees', () => {
    const flow = createFlow();
    for (const action of shortestPath(HOME, SUBMITTED)) flow.act(action);
    assert.equal(flow.screen, SUBMITTED);
    assert.ok(flow.count <= INTERACTION_BUDGET, 'counted ' + flow.count + ' interactions');
    assert.deepEqual(flow.interactions, ['need-help', 'pick-need', 'send']);
  });

  it('the route uses predefined options only - no typing is required', () => {
    assert.ok(!shortestPath(HOME, SUBMITTED).some((a) => /type|write|keyboard/.test(a)),
      'the shortest route requires typing, which ERI’s criterion rules out');
  });

  it('P3-A7 no screen is more than three interactions from the start', () => {
    const depths = screenDepths();
    for (const [screen, depth] of Object.entries(depths)) {
      assert.ok(depth <= INTERACTION_BUDGET, screen + ' is ' + depth + ' interactions deep');
    }
    assert.equal(Object.keys(depths).length, Object.keys(SCREENS).length, 'a screen is unreachable');
  });

  it('refuses an action that does not exist on the current screen', () => {
    const flow = createFlow();
    assert.throws(() => flow.act('send'), /does not exist on screen "home"/);
  });
});

describe('P3-P4 the emergency path is a different path', () => {
  it('is reachable in one interaction from every screen that is not itself the emergency screen', () => {
    for (const [name, screen] of Object.entries(SCREENS)) {
      if (name === 'emergency') continue;
      assert.ok('open-emergency' in screen.actions, name + ' has no way to reach the emergency screen');
    }
    assert.equal(screenDepths().emergency, 1);
  });

  it('is never a step on the way to sending a request', () => {
    const routes = allSimplePaths(HOME, SUBMITTED);
    assert.ok(routes.length > 0);
    for (const route of routes) {
      assert.ok(!route.screens.includes('emergency'),
        'a route to a submitted request goes through the emergency screen: ' + route.actions.join(' -> '));
    }
    assert.deepEqual(REQUEST_PATH_SCREENS.includes('emergency'), false);
  });

  it('does not feed back into the request flow', () => {
    const onward = Object.values(SCREENS.emergency.actions);
    assert.deepEqual(onward, ['home'],
      'the emergency screen leads somewhere other than back to the start: ' + onward.join(', '));
  });
});

describe('the screen and the model cannot drift apart', () => {
  // Every screen is rendered for real and read back, plus the static markup in
  // index.html. This is the rendered HTML a browser would get, not a grep of
  // the source that produces it.
  const rendered = EMPLOYEE_SCREEN_NAMES
    .map((name) => employeeScreen(name, {
      draft: { needId: 'task', messageId: 't1', text: 'I am not sure what to do first.' },
      request: null,
      requests: []
    }))
    .concat([read('web/index.html')])
    .join('\n');
  const used = Array.from(new Set(
    [...rendered.matchAll(/data-action="([a-z-]+)"/g)].map((m) => m[1])
  )).sort();

  it('every data-action on the employee screen is an action in src/flow.js', () => {
    assert.ok(used.length > 0, 'no data-action attributes found: the screen is not driven by the flow model');
    for (const action of used) {
      assert.ok(ALL_ACTIONS.includes(action), 'the screen uses "' + action + '", which the flow model does not define');
    }
  });

  it('every action in the flow model is on the screen somewhere', () => {
    for (const action of ALL_ACTIONS) {
      assert.ok(used.includes(action), 'the flow model defines "' + action + '" but no button uses it');
    }
  });

  it('the three interactions in the budget are real buttons', () => {
    for (const action of shortestPath(HOME, SUBMITTED)) {
      assert.ok(used.includes(action), 'the shortest route needs "' + action + '" and no button offers it');
    }
  });

  it('every navigation goes through the flow, so the count is honest', () => {
    const js = read('web/employee.js');
    assert.match(js, /flow\.act\(action\)/, 'employee.js does not route clicks through flow.act()');
    assert.match(js, /if \(!flow\.can\(action\)\) return;/, 'employee.js does not check the action against the model');
  });
});
