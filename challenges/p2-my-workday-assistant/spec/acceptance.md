# Acceptance: My Workday Assistant (ERI project 2)

**Source of truth:** [`docs/eri-problem-statements.md`](../../../docs/eri-problem-statements.md),
section "Project 2: My Workday Assistant". Where this file disagrees with
ERI's words, ERI wins and this file is the bug. The PRD with `AC-P2.x` ids
is at [`wiki/prds/p2-my-workday-assistant.md`](../../../wiki/prds/p2-my-workday-assistant.md);
the mapping to it is at the bottom.

One row per requirement ERI actually wrote. Nothing here is invented, and
nothing ERI wrote is missing.

| id range | ERI section | count |
| --- | --- | --- |
| `P2-F1` … `P2-F8` | 4. Core features | 8 |
| `P2-M1` … `P2-M6` | 6. Minimum viable product | 6 |
| `P2-A1` … `P2-A8` | 7. Accessibility requirements | 8 |
| `P2-S1` … `P2-S5` | 8. Success criteria | 5 |
| `P2-X1` … `P2-X6` | 9. Out of scope for the hackathon | 6 |

**Disposition** means:

| disposition | meaning |
| --- | --- |
| `mvp` | built today, and a test fails if it breaks |
| `stretch` | not built today; it is on the README's pick-one list |
| `forbidden` | ERI ruled it out; a test fails if it appears |
| `human` | only a person can judge it; no test can |

Rows can carry two dispositions (`mvp` + `human`) when a machine can
check the mechanism but only a person can judge the experience.

---

## The contradiction in ERI's document, and how this build resolves it

ERI's **section 6** MVP says the prototype "displays a list of three
sample workplace tasks". There is no authoring step in the MVP at all.
ERI's **section 8** success criteria then open with "a job coach can
create a basic task guide using a simple interface or template."

Build section 6 exactly and you fail success criterion one. Build an
authoring UI and you have gone past the MVP ERI asked for, in the few
hours available, at the cost of the worker-facing flow that is the whole
point. ERI's own PRD note agrees that the authoring side "is the part
that decides adoption".

**Resolution: take ERI's word "template" literally.** The task guides are
not a database and not a code file in disguise — they are a documented,
heavily commented **template** a non-programmer edits:

1. [`fixtures/TEMPLATE.task.js`](../fixtures/TEMPLATE.task.js) is a
   copy-me file. Every field has a comment above it saying, in plain
   words, what to type there. The writing rules (short sentences, no
   hurry words, a picture description for every step) are stated in the
   file, not hidden in a style guide.
2. [`fixtures/tasks.js`](../fixtures/tasks.js) is the day's list. Adding
   a guide is **two lines**, and the file says which two.
3. [`scripts/validate-task.mjs`](../scripts/validate-task.mjs) is the
   feedback loop: `node scripts/validate-task.mjs fixtures/my-task.js`
   prints plain-language problems ("Step 3 is missing the words that tell
   the worker what to do", "Keep sentences to 12 words or fewer").
   Without this, "a coach can edit the file" would be a hope. With it,
   editing has a check that answers in seconds.
4. [`fixtures/README.md`](../fixtures/README.md) is the walkthrough for a
   coach who has never opened a text editor on purpose.

**What this resolution does NOT claim.** It is a template, not an
interface. ERI's sentence says "a simple interface **or** template", so
the template half is honestly met and the interface half is not. A real
coach has still never used it — that is the `human` half of `P2-S1`, and
the authoring UI is the first item on the README's pick-one list
(`P2-F1`). Judge this resolution by whether a coach can produce a working
guide from the template in one sitting. If they cannot, `P2-S1` is red,
whatever the tests say.

---

## 1. Core features — ERI section 4 (8 rows)

| id | ERI's requirement | disposition | what proves it |
| --- | --- | --- | --- |
| P2-F1 | Create a task: add a workplace task and describe its steps | `stretch` + `human` | Not built as an interface. The commented **template** path is built and tested (`test/validate-task.test.js`, `test/fixtures.test.js` "the template a coach copies is itself valid and commented"). An authoring screen is pick-one item 1 in the README. See the contradiction note above and `P2-S1` |
| P2-F2 | Visual instructions: include an image or icon for each step | `mvp` | `test/fixtures.test.js` "every step has text, a picture and an audio transcript"; `test/view.test.js` "every step carries text and a picture" |
| P2-F3 | Audio support: allow users to hear task instructions | `mvp` | `test/speech.test.js` — asserts speech is **invoked** and reports `voiceCount`. It cannot assert audibility; see the audio note below |
| P2-F4 | Step-by-step navigation: one step at a time with Back and Next | `mvp` | `test/step-machine.test.js` "shows exactly one step at a time", "Next stops at the last step", "Back stops at the first step"; `test/conformance.test.js` button markup |
| P2-F5 | Task completion: mark individual steps or tasks complete | `mvp` | `test/step-machine.test.js` "marking a step complete records it and moves to the next step", "a mistake can be undone" |
| P2-F6 | Daily routine: display a simple list of assigned tasks for the day | `mvp` | `test/view.test.js` "shows three tasks, each with a labelled way to open it"; this is the same screen as `P2-M1` |
| P2-F7 | Reminders: optional reminders or prompts for scheduled activities | `stretch` | Not built, on purpose. A reminder needs a clock, and a clock in this tool is one refactor away from a stopwatch on a disabled worker. If built, it must be set by the worker, dismissible, and never reported anywhere. Pick-one item 3 |
| P2-F8 | Request help: an easy way to indicate when assistance is needed | `mvp` | `test/conformance.test.js` "I Need Help is in the header, so it is one action from any screen"; `test/view.test.js` help panel options. Sending the request to a coach is ERI project 3, not this one |

## 2. Minimum viable product — ERI section 6 (6 rows)

| id | ERI's MVP step | disposition | what proves it |
| --- | --- | --- | --- |
| P2-M1 | Displays a list of three sample workplace tasks | `mvp` | `test/fixtures.test.js` "there are exactly three sample tasks"; `test/view.test.js` task-list tests |
| P2-M2 | Allows the user to select a task | `mvp` | `test/step-machine.test.js` "a fresh task starts on step one"; `test/conformance.test.js` asserts the list renders real `<button>` elements, not clickable divs |
| P2-M3 | Shows that task in manageable steps with pictures and text | `mvp` | `test/view.test.js` "names the current step and what comes next", "every step carries text and a picture"; three guides of 5, 4 and 3 steps |
| P2-M4 | Allows each step to be marked complete | `mvp` | `test/step-machine.test.js` mark/undo tests; `test/view.test.js` "the complete control is labelled and reversible"; announcement test |
| P2-M5 | Shows task completion progress | `mvp` | `test/step-machine.test.js` "progress counts steps done out of the total" and "progress has no field that measures time or speed"; `test/conformance.test.js` progress markup |
| P2-M6 | Includes a simple "I Need Help" option | `mvp` | `test/conformance.test.js` header test; `test/view.test.js` "help and repeat are available on every step" |

## 3. Accessibility — ERI section 7 (8 rows)

| id | ERI's requirement | disposition | what proves it |
| --- | --- | --- | --- |
| P2-A1 | Provide large, clearly labeled controls | `mvp` + `human` | `test/conformance.test.js` "controls are at least 48px in both directions", "body text starts at 18px". Whether the labels are *clear* is a person's call |
| P2-A2 | Support images, text, video, and optional audio instructions | `mvp` (images, text, audio) · `stretch` (video) | `test/view.test.js` formats test; `test/speech.test.js` "the step text is on screen whether or not speech works". **Video is not built** — pick-one item 2 |
| P2-A3 | Use plain language and short sentences | `mvp` + `human` | `scripts/validate-task.mjs` caps sentences at 12 words and bans hurry/scoring/diagnosis words; `test/validate-task.test.js` proves the cap fails a long sentence; `test/fixtures.test.js` runs it over all three guides. A reading-level judgement is still human |
| P2-A4 | Support keyboard and screen-reader navigation | `mvp` + `human` | `test/conformance.test.js` markup tests (one `h1`, named sections, real buttons, skip link, `role="status"` live region, `aria-labelledby` on every picture). **A real screen-reader pass is human and has not been done** |
| P2-A5 | Avoid requiring fast responses or completing steps within a set time | `mvp` | `test/conformance.test.js` "nothing in the shipped code can time a worker" (no `setTimeout`, `setInterval`, `Date`, `performance.now`) and "no page expires or refreshes itself" |
| P2-A6 | Allow workers to repeat instructions | `mvp` | `test/speech.test.js` "repeating is unlimited; nothing counts the repeats"; `test/view.test.js` `repeatAvailable` on every step |
| P2-A7 | Minimize unnecessary distractions and complicated navigation | `mvp` + `human` | `test/conformance.test.js` "no animation and no transition"; two screens total, one column at every width. Whether it *feels* calm is human |
| P2-A8 | Support use on a smartphone or tablet | `mvp` + `human` | `test/conformance.test.js` viewport meta, narrow-phone media query, no fixed width over 320px, `box-sizing: border-box`. **Tested on a real phone: not yet** |

## 4. Success criteria — ERI section 8 (5 rows)

| id | ERI's criterion | disposition | what proves it |
| --- | --- | --- | --- |
| P2-S1 | A job coach can create a basic task guide using a simple interface or **template** | `mvp` (template) + `human` (a coach has not tried it) | **This is the contradiction row — read the section above.** Built: `fixtures/TEMPLATE.task.js` (commented copy-me file), `fixtures/README.md` (coach walkthrough), two-line registration in `fixtures/tasks.js`, and `scripts/validate-task.mjs` as the feedback loop. Proven by `test/validate-task.test.js` (19 tests, each driving a real failure) and `test/fixtures.test.js` template tests. NOT proven: that a non-programmer succeeds. That needs one coach and twenty minutes |
| P2-S2 | An employee can follow and complete a sample five-step task | `mvp` | `test/fixtures.test.js` "at least one task has five steps" (Stock the Shelves); `test/step-machine.test.js` "a five-step task can be completed end to end"; `test/view.test.js` finished message |
| P2-S3 | The tool provides at least two instruction formats, such as text and pictures | `mvp` | `test/view.test.js` asserts every step of every guide carries text + picture + transcript (three), never fewer than two |
| P2-S4 | The employee can repeat steps or request help | `mvp` | `test/view.test.js` "help and repeat are available on every step"; `test/speech.test.js` repeat test |
| P2-S5 | The employee can easily identify their current step and what comes next | `mvp` + `human` | `test/view.test.js` "Step 3 of 5" + "Next: Put the product on the shelf", and "on the last step it says so instead of inventing a next step"; `buildAnnouncement` test for the screen-reader wording. "Easily" is human |

## 5. Out of scope — ERI section 9 (6 rows)

These are `forbidden`, not merely unbuilt. A test fails if one appears.

| id | ERI ruled out | disposition | what proves it |
| --- | --- | --- | --- |
| P2-X1 | Full employee scheduling or time tracking | `forbidden` | `test/conformance.test.js` "nothing in the shipped code can time a worker"; `test/view.test.js` "the view model carries no time, place or score field"; `test/step-machine.test.js` "progress has no field that measures time or speed" |
| P2-X2 | Payroll integration | `forbidden` | `test/conformance.test.js` "no sender of any kind in the shipped code" and "nothing is loaded from the internet" — there is no channel a payroll system could be on |
| P2-X3 | Automated employee performance evaluation | `forbidden` | `test/conformance.test.js` "nothing scores, rates or ranks the worker"; progress counts steps only, and only the worker sees it |
| P2-X4 | Location tracking | `forbidden` | `test/conformance.test.js` "no location tracking" (no `geolocation`) plus the no-network tests |
| P2-X5 | Extensive employer management features | `forbidden` | `test/conformance.test.js` "the prototype collects no input at all: no form, no text box" — there are no accounts, no roles and no employer view to manage |
| P2-X6 | Advanced AI-generated task analysis | `forbidden` | `test/conformance.test.js` no-network tests: with no outbound call and no bundled model, no AI analysis is reachable. Task text comes only from a human-written guide |

---

## 6. The privacy guardrail (ERI section 10) — not optional

ERI: the tool is "designed as a support for employees, **not as a way for
employers to monitor or measure workers without their knowledge**".

| claim | what proves it |
| --- | --- |
| Progress never leaves the browser | `test/conformance.test.js` no-sender and no-remote-URL tests over every shipped file |
| What is stored is step ids and a position, nothing about the person | `test/storage.test.js` "what is stored is only step ids and a position" |
| The worker can erase it | `test/storage.test.js` "the worker can erase everything"; the Forget button in `web/index.html` |
| The worker is told, in plain words, on every screen | `test/conformance.test.js` "the worker is told where their progress lives" |
| Nothing asks about a disability or diagnosis | `test/conformance.test.js` "no disability or diagnosis field anywhere"; `scripts/validate-task.mjs` rejects those words in a guide |
| Nobody is timed, scored or ranked | the `P2-X1` and `P2-X3` rows |

## 7. The audio note — read before trusting any audio claim

`speechSynthesis` on a Linux box with no voices installed **exists**,
returns an empty `getVoices()` list, and `speak()` silently does nothing.
The hackathon workspaces are Linux containers, so that is the assumed
case.

Therefore:

- The step text is always on screen. Audio is an enhancement, never a
  substitute. `P2-A2` depends on text + pictures, not on audio.
- Every audio test asserts speech was **invoked** (`{invoked: true}`),
  and reports `voiceCount`. No test asserts anything was heard, because
  no test in this repo can.
- The screen says so: when `voiceCount` is 0 the hint under the audio
  button reads "This device may have no voice installed. The words are on
  the screen."
- **Unverified:** that audio is audible on the day-of image. Someone has
  to put on headphones. Until then, treat `P2-F3` as "invoked, not heard".

## 8. Coverage, counted honestly

| | count | ids |
| --- | --- | --- |
33 rows, each counted once, in exactly one line.

| | count | ids |
| --- | --- | --- |
| `mvp`, a test fails if it breaks | 18 | F2, F3, F4, F5, F6, F8, M1–M6, A2, A5, A6, S2, S3, S4 |
| `mvp` + `human` — mechanism tested, experience not yet judged | 7 | A1, A3, A4, A7, A8, S1, S5 |
| `forbidden`, a negative test fails if it appears | 6 | X1–X6 |
| `stretch`, not built, no test | 2 | F1 (as an interface), F7 |

**31 of 33 rows have at least one automated check**, 7 of those also need
a person before they can be called done, and 2 rows are honestly unbuilt.
One row is split: `A2` is tested for text, pictures and audio; its
**video** half is not built.

Outstanding, and not claimable from any green run:

| what | who |
| --- | --- |
| A real screen-reader pass (`A4`) | a person, 20 minutes |
| A real phone at 320px (`A8`) | a person, 5 minutes |
| A coach producing a guide from the template (`S1`) | one job coach |
| Audio audible on the day-of image (`F3`) | anyone with headphones |
| The page rendered in a browser at all | there is no browser in this toolchain. Checked instead: every module parses, every element id `app.js` reaches for exists in the markup, every asset resolves over `npm start` |

Nothing here is claimed as done on the strength of code having been
written. `S1` is the row to argue about.

## 9. Where the evidence runs

| command | what it is | count |
| --- | --- | --- |
| `npm test` | unit + conformance, `node --test test/*.test.js` | 116 tests |
| `npm run bdd` | `features/workday.feature`, every scenario tagged with the ids above, run by `scripts/run-features.mjs` (no cucumber: this folder ships no packages) | 11 scenarios |
| `npm run test:a11y` | `e2e/a11y.test.mjs` — a **static** audit: accessible names, heading order, label targets, duplicate ids, tab order, 48px targets, and WCAG contrast computed from the colour tokens | 26 checks |
| `npm run check:tasks` | the coach's checker over all three guides and the template | 4 files |

Measured contrast, light then dark (`e2e/a11y.test.mjs` recomputes these
every run rather than trusting the comment): body text 17.63:1 / 16.16:1,
quiet text 8.04:1 / 11.01:1, primary button text 10.42:1 / 11.76:1,
control border 4.16:1 / 5.72:1, focus ring 8.04:1 / 10.28:1.

**The a11y lane is static, and that is a real limit.** It has no browser
and no axe, so it cannot judge focus order at runtime, a screen reader's
actual output, or a real 320px phone. Those are the `human` halves of
`P2-A4` and `P2-A8` and they are still undone.

Each gate has been shown to fail, not merely to pass. In a scratch copy:
adding a `fetch` reddened the no-network test, a `setInterval` reddened
the no-clock test, a `Diagnosis` input reddened two privacy tests,
renaming an element id reddened the markup test, dropping a step reddened
the five-step test, and an unwritten BDD step reddened the scenario rather
than skipping it.

## 10. Mapping to the PRD's AC ids

| PRD | here |
| --- | --- |
| AC-P2.1 | P2-M1, P2-A1 |
| AC-P2.2 | P2-F4, P2-M3 |
| AC-P2.3 | P2-S3, P2-A2 |
| AC-P2.4 | P2-M4, P2-M5, P2-S5 |
| AC-P2.5 | P2-A6, P2-S4, P2-F3 |
| AC-P2.6 | P2-M6, P2-F8 |
| AC-P2.7 | P2-A5 |
| AC-P2.8 | P2-A8 |
| AC-P2.9 | section 6 above, the privacy guardrail |

## 11. Mapping to `docs/eri-backlog.md`

That file — generated from ERI's statements by `tools/gen_backlog.py`,
and the only thing `tools/check_claims.py` accepts in a PR body — carries
`P2-F1…F8` (identical to section 1 here) and ERI's five user stories. It
has no `P2-M/A/S/X` ids, so a PR must claim from this column:

| backlog id | ERI's story | where it is met here |
| --- | --- | --- |
| `P2-US1` | pictures for each step, so I need not ask again | P2-F2, P2-M3, P2-S3 |
| `P2-US2` | listen instead of read | P2-F3, P2-A2, and the audio note in section 7 |
| `P2-US3` | a coach quickly creates a checklist | P2-S1, P2-F1 — the contradiction row; template yes, interface no |
| `P2-US4` | a supervisor updates instructions when a process changes | **not built.** Editing means re-opening the task file. README pick-one item 2 |
| `P2-US5` | indicate I need help without embarrassment | P2-M6, P2-F8 — one unlabelled-as-weakness button in the header, same on every screen |
