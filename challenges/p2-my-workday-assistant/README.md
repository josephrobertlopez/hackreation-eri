# Challenge P2: My Workday Assistant

**PRD:** [wiki/prds/p2-my-workday-assistant.md](../../wiki/prds/p2-my-workday-assistant.md) ·
**Spec → tests:** [spec/acceptance.md](spec/acceptance.md) ·
**ERI's words:** [docs/eri-problem-statements.md](../../docs/eri-problem-statements.md)

A worker opens their task for the day and is walked through it one step at
a time — a picture, a few short words, a big button to mark the step done,
and "I Need Help" in the corner of every screen. A job coach writes the
guide by editing a commented template and running one checker command.

**It is a support tool, not a monitoring tool.** Progress is counted in
steps, stays in the browser, and is never sent anywhere. Nothing times the
worker, nothing scores them, and nothing anywhere asks about a disability.
That is ERI's section 10, and it is enforced by tests, not by good
intentions.

```bash
cd challenges/p2-my-workday-assistant
npm start                    # http://localhost:8002/web/
npm test                     # TDD: node:test (test/) — 116 tests
npm run bdd                  # BDD: features/workday.feature — 11 scenarios, tagged with AC ids
npm run test:a11y            # static accessibility audit (e2e/) — 26 checks
npm run check:tasks          # the checker a job coach runs on a task guide
npm run ci                   # all four
```

**`npm ci` installs nothing, because there are no dependencies.** No npm
packages, no build, no framework, no network calls: plain HTML, one CSS
file, and vanilla ES modules. The committed lockfile is empty on purpose,
and a test fails if a package ever lands in it. `npm start` is python's
static file server; any other static server works too — serve the
challenge folder, not `web/`, because the app imports `../fixtures/`.

`npm run bdd` uses `scripts/run-features.mjs`, a 90-line Gherkin runner,
rather than cucumber-js — same reason: no packages. An unmatched step is a
failure there, never a skip. `npm run test:a11y` is a **static** audit of
the markup and the stylesheet (accessible names, heading order, label
targets, duplicate ids, tab order, 48px targets, and WCAG contrast
computed from the colour tokens — measured, not asserted). It is not axe
and it is not a browser; the screen-reader and real-phone rows stay
`human` in the spec.

First 10 minutes: run `npm test` (all green), read `web/step-machine.js`
(80 lines, pure functions, no DOM), open the app and finish "Stock the
Shelves", then pick one box below and write its failing test first.

## Spec → tests (traceability)

| ERI requirement | ids | Unit (`node:test`) | Behaviour / conformance |
| --- | --- | --- | --- |
| §4 core features | P2-F1…F8 | `test/view.test.js`, `test/speech.test.js` | `features/workday.feature` `@P2-F2…F8`; `test/conformance.test.js` |
| §6 MVP steps | P2-M1…M6 | `test/step-machine.test.js`, `test/view.test.js` | `features/workday.feature` `@P2-M1…M6`; `test/conformance.test.js` |
| §7 accessibility | P2-A1…A8 | `test/speech.test.js` | `e2e/a11y.test.mjs` (names, headings, contrast, 48px); `test/conformance.test.js` (320px, no clock) |
| §8 success criteria | P2-S1…S5 | `test/validate-task.test.js`, `test/fixtures.test.js` | `features/workday.feature` `@P2-S1, @P2-S2, @P2-S4, @P2-S5` |
| §9 out of scope | P2-X1…X6 | `test/view.test.js` (no time/score fields) | `features/workday.feature` `@P2-X1 @P2-X3 @P2-X4`; `test/conformance.test.js` (negative tests) |
| §10 privacy | — | `test/storage.test.js` | `features/workday.feature` "What is kept is about the task" |

**CI:** the repo's shared runner works as-is —
`bash tools/run_project_suite.sh challenges/p2-my-workday-assistant`
passes all three stages it requires (`test`, `bdd`, `test:a11y`).
`npm run ci` is the same thing plus the task checker. No workflow file
ships in this folder.

**Claiming ids in a PR:** `docs/eri-backlog.md` only generates `P2-F1…F8`
and `P2-US1…US5`, so `tools/check_claims.py` will reject a body claiming
`P2-M3` or `P2-A4`. Claim the `P2-F*` and `P2-US*` ids (mapping table at
the end of [spec/acceptance.md](spec/acceptance.md)) and cite the rest as
evidence, or extend the backlog generator — that file is not ours.

Each of these gates has been shown to fail, not just to pass: adding a
`fetch`, a `setInterval`, a diagnosis field, a renamed element id, or
dropping the five-step task each turns the suite red. A gate that has
never failed has not been shown to work.

Full row-by-row table, with dispositions and what is human-judged, is in
[spec/acceptance.md](spec/acceptance.md). Of ERI's 33 requirements: 31
have at least one automated check (6 of those are ERI's out-of-scope
items, checked by a test that fails if the feature appears), 7 of the 31
also need a person before anyone calls them done, and 2 are honestly
unbuilt — the authoring interface and reminders.

**Three things are deliberately not claimed.** The page has never been
rendered in a browser here — there is no browser in this toolchain. What
is checked instead: every module parses, every element id `app.js` reaches
for exists in `index.html` (a test), and every asset resolves over
`npm start` with the right MIME type. First job for whoever picks this up:
open it and finish "Stock the Shelves" with the keyboard only. Audio is
asserted as
*invoked*, never as *audible* — `speechSynthesis` on a Linux container
with no voices installed silently does nothing, so the step text is always
on screen and the UI says so. And no screen reader or real phone has
touched this yet; those rows are marked `human` in the spec.

## What is where

| | |
| --- | --- |
| `web/step-machine.js` | the step rules. Pure, no DOM, no clock |
| `web/view.js` | what the screen should say, as plain data — this is why the UI is testable without a browser |
| `web/speech.js` | optional audio. Reports invoked, never audible |
| `web/storage.js` | progress in this browser, with a Forget button |
| `web/app.js` | the only file that touches the DOM |
| `fixtures/` | three task guides + the template a coach copies ([how to](fixtures/README.md)) |
| `scripts/validate-task.mjs` | the coach's checker; plain-language errors |
| `features/` | the scenarios in ERI-readable Gherkin, tagged with ids |
| `e2e/a11y.test.mjs` | the static accessibility audit, limits stated in the file |

The PRD calls this folder's task data `data/`; it is `fixtures/` here,
because the guides are the authoring template as much as they are data and
they are imported directly by the app (no fetch, so no `data/` endpoint).
One rename if ERI prefers the PRD's word.

## The contradiction in ERI's document, and what we did

ERI's §6 MVP only **displays** three sample tasks — no authoring. ERI's §8
success criteria then open with "a job coach can **create** a basic task
guide using a simple interface or template." Build §6 exactly and you fail
success criterion one.

We took ERI's word **template** literally: `fixtures/TEMPLATE.task.js` is a
copy-me file with a comment above every field, `fixtures/tasks.js` says in
two lines how to register a guide, `fixtures/README.md` is the coach
walkthrough, and `scripts/validate-task.mjs` gives a coach a plain-language
answer in seconds ("Step 3 is missing the words that tell the worker what
to do"). That is the template half of ERI's sentence, honestly met. The
*interface* half is not built, and no real coach has tried the template
yet — written up against P2-S1 in [spec/acceptance.md](spec/acceptance.md)
so the next reader gets the reasoning, not a silent choice.

## Your job (pick one; finish it with a test, then pick the next)

- [ ] **Authoring screen** (ERI §4 "Create a task", §8 criterion 1) — a coach types a task and its steps in the browser and gets a guide out. Reuse `scripts/validate-task.mjs` rules so the UI and the file checker cannot disagree
- [ ] **Edit an existing guide** (ERI §5: "As a supervisor, I want to update instructions when a process changes") — change one step without re-typing the task
- [ ] **A photo or short video per step** (ERI §7 "support images, text, video") — ship a caption and a transcript with it, or it fails §7
- [ ] **Worker-set reminders** (ERI §4 "Reminders") — the worker sets them, the worker dismisses them, nothing is reported. Read the P2-F7 row first: a clock in this tool is one refactor away from a stopwatch on a disabled worker
- [ ] **Opt-in sharing** (ERI §10) — "show my coach that I finished" with the consent wording on screen, off by default, and a test that the default is off
- [ ] **Spanish**, and a plain-language pass on every word a worker sees

Every team: one screen reader pass (it counts in judging), and one run at
320px wide on an actual phone.

**Guardrails:** never time, score or rank the worker; never a field for a
disability or diagnosis; progress stays local unless the worker knowingly
shares it; the step text is always visible even when audio works; task
guides must match the real job, and anything that could hurt someone is for
qualified staff to review. All practice data — no real workplace, no real
person.
