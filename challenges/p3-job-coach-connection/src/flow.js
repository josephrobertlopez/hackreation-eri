/*
 * The employee screen's navigation, written down as data so ERI's success
 * criterion can be measured instead of asserted.
 *
 *   ERI section 8: "An employee can submit a request for assistance in three
 *   interactions or fewer using predefined options."
 *
 * INTERACTION, defined: one activation of one control by the employee -
 * a tap, a click, Enter or Space on a focused control - counted from the home
 * screen up to and including the press that submits the request. Scrolling,
 * reading, moving focus with Tab and typing into the optional message box are
 * not interactions; typing is already optional, and counting keystrokes would
 * punish the employees this tool is for.
 *
 * The shortest path is not hard-coded in the test. test/flow.test.mjs walks
 * this graph breadth-first and fails if the shortest home -> submitted path is
 * longer than three, so adding a confirmation step or a "how urgent is it?"
 * question breaks the suite rather than the promise.
 *
 * web/employee.js renders every button from this graph (`data-action`), so the
 * model and the screen cannot drift apart silently.
 */

export const HOME = 'home';
export const SUBMITTED = 'sent';

export const SCREENS = {
  home: {
    heading: 'Ask for help',
    actions: {
      'need-help': 'choose-need',
      'open-history': 'history',
      'open-emergency': 'emergency'
    }
  },
  'choose-need': {
    heading: 'What do you need help with?',
    actions: {
      'pick-need': 'compose',
      back: 'home',
      'open-emergency': 'emergency'
    }
  },
  compose: {
    heading: 'Send this to Maria Delgado?',
    actions: {
      send: 'sent',
      'pick-message': 'compose',
      'clear-message': 'compose',
      back: 'choose-need',
      'open-emergency': 'emergency'
    }
  },
  sent: {
    heading: 'Your message is sent',
    actions: {
      'open-history': 'history',
      home: 'home',
      'open-emergency': 'emergency'
    }
  },
  history: {
    heading: 'My messages',
    actions: {
      'need-help': 'choose-need',
      home: 'home',
      'open-emergency': 'emergency'
    }
  },
  emergency: {
    heading: 'Is someone hurt or in danger?',
    // Deliberately a dead end for the request flow: from the emergency screen
    // you go back to the start. It never feeds into send, so an emergency can
    // never be mistaken for "I filed a ticket".
    actions: {
      home: 'home'
    }
  }
};

/** Screens that are part of making a request. Emergency is not one of them. */
export const REQUEST_PATH_SCREENS = Object.freeze(['home', 'choose-need', 'compose', 'sent']);

export const ALL_ACTIONS = Object.freeze(
  Array.from(new Set(Object.values(SCREENS).flatMap((s) => Object.keys(s.actions)))).sort()
);

/** A live cursor over the graph. The UI holds one; it counts interactions. */
export function createFlow(start = HOME) {
  let screen = start;
  let interactions = [];
  return {
    get screen() { return screen; },
    get interactions() { return interactions.slice(); },
    get count() { return interactions.length; },
    can(action) { return Object.prototype.hasOwnProperty.call(SCREENS[screen].actions, action); },
    act(action) {
      if (!this.can(action)) {
        throw new Error('Action "' + action + '" does not exist on screen "' + screen + '".');
      }
      interactions = interactions.concat([action]);
      screen = SCREENS[screen].actions[action];
      return screen;
    },
    restart() { screen = start; interactions = []; return screen; }
  };
}

/** Breadth-first shortest action path between two screens, or null. */
export function shortestPath(from = HOME, to = SUBMITTED) {
  const queue = [[from, []]];
  const seen = new Set([from]);
  while (queue.length) {
    const [screen, path] = queue.shift();
    if (screen === to) return path;
    for (const [action, next] of Object.entries(SCREENS[screen].actions)) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push([next, path.concat([action])]);
    }
  }
  return null;
}

/** Interactions from home to every screen - the "no deep menus" measurement. */
export function screenDepths(from = HOME) {
  const depths = { [from]: 0 };
  const queue = [from];
  while (queue.length) {
    const screen = queue.shift();
    for (const next of Object.values(SCREENS[screen].actions)) {
      if (next in depths) continue;
      depths[next] = depths[screen] + 1;
      queue.push(next);
    }
  }
  return depths;
}

/** Every path from `from` to `to` with no repeated screen. Used to prove the
 *  emergency screen is not on any route to a submitted request. */
export function allSimplePaths(from = HOME, to = SUBMITTED) {
  const out = [];
  (function walk(screen, visited, path) {
    if (screen === to) { out.push({ screens: visited.slice(), actions: path.slice() }); return; }
    for (const [action, next] of Object.entries(SCREENS[screen].actions)) {
      if (visited.includes(next)) continue;
      walk(next, visited.concat([next]), path.concat([action]));
    }
  })(from, [from], []);
  return out;
}

export default { SCREENS, createFlow, shortestPath, screenDepths, allSimplePaths };
