# Challenge P3: Job Coach Connection

**ERI's ask:** [docs/eri-problem-statements.md](../../docs/eri-problem-statements.md#project-3-job-coach-connection) ·
**PRD:** [wiki/prds/p3-job-coach-connection.md](../../wiki/prds/p3-job-coach-connection.md) ·
**Acceptance:** [spec/acceptance.md](spec/acceptance.md)

An employee asks their job coach for help in three taps. The coach sees what
kind of help it is before opening it, acknowledges, and answers in one short
message. The employee sees the answer on their own screen.

Two **separate** screens - `web/index.html` for the employee, `web/coach.html`
for the coach - in two tabs, talking through `BroadcastChannel` and
`localStorage`. One page with both panels side by side would demo the same
pictures and prove none of the handoff, which is the part ERI asked for.

**Plain HTML, CSS and vanilla ES modules. No dependencies, no build step, no
framework, and nothing leaves the browser** - no `fetch`, no socket, no beacon,
and a test fails if one appears. ERI's web team can host it by copying 17
static files - 5 in `web/`, 5 in `src/`, 7 in `fixtures/` - onto any web
server. There is nothing to compile and nothing to configure.

```bash
cd challenges/p3-job-coach-connection
npm test                     # 108 tests, node:test, zero dependencies
npm start                    # http://localhost:8003/web/
```

Open `http://localhost:8003/web/` in one tab and
`http://localhost:8003/web/coach.html` in another, put them side by side, and
send a request. (`npm ci` is not needed. There is nothing to install.)

First 10 minutes: run `npm test`, read the comment at the top of
`src/requests.js` - it explains the one lie this product could most easily tell
and the 26 tests that stop it - then read `test/demo.test.mjs`, which is ERI's
own suggested demonstration executed against the real page scripts. Then pick
one box from the bottom of this file and write its failing test first.

## The two things that mattered more than the feature list

**1. No status moves without a real coach action.** ERI section 4 asks for a
status of "sent, seen, or answered". The cheap build is a two-second timer that
flips to "seen", and it demos beautifully. It also teaches a disabled employee
that their job coach saw a message nobody saw, and then teaches them that the
coach saw it and ignored them. So `seen` requires a `coach-opened` event from
an actor whose role is `coach` - the coach pressing **Open this request** -
and `answered` requires a non-empty reply from one. There is no exported way to
set a status, no clock in the state machine, and no timer in any shipped file.
Driven, not assumed: inserting the fake-seen timer turns three tests red
(`the whole clock can run out and nothing moves`, `no shipped file sets a timer
of any kind`, `only the state machine ever writes the words "seen" or
"answered" into a status`) and takes `test/demo.test.mjs` down with them. Eight
such mutations were run against this suite before it was called finished; each
one went red, and the sources were restored byte-identical afterwards.

**2. Routine and emergency are different paths.** ERI section 10 asks the
product to "distinguish routine coaching requests from emergencies and direct
users to established emergency procedures when needed", and not to "imply that
a job coach is always immediately available". That appears only in their
privacy paragraph - not in the MVP steps, not in the success criteria - so it
is the requirement a prototype is most likely to skip while still passing.
Here it is blocking:

- The emergency panel is a different shape - square corners, double red rule,
  its own region at the edge of the screen - so the difference survives
  greyscale and Windows High Contrast. It is reachable in one interaction from
  every screen, it appears on **no** route to a submitted request, and it sends
  nothing. It points at 911, the person in charge, and the plan posted at the
  worksite.
- Nothing anywhere reports presence or predicts a reply. Seventeen phrase
  patterns - "is online", "last seen", "standing by", "on call", "replies
  within", "will respond", "right away" - are scanned across every shipped
  file, including this folder's own fixtures. The screen says the honest thing
  instead: *Maria is a job coach for four worksites and is not always at a
  computer. This app does not promise a reply, and it cannot tell you when she
  will read your message.* That line is on the home screen and on the
  confirmation screen, where somebody is actually waiting.

**The coach is named.** Maria Delgado, job coach, ERI Employment Services -
in a banner that sits outside the part of the page that re-renders, so no
screen can drop it. With a simulated inbox, "your coach" identifies nobody, and
ERI section 10 requires it be clear who can receive messages. The phrase "your
coach" is banned from the employee screen by a test.

**This is not monitoring.** The dashboard renders from one projection,
`coachView()`, whose field list is asserted exactly; there is nowhere in it to
put an activity log, a location or a diagnosis. There is no input, label or
fixture key anywhere matching `disab/diagnos/impair/condition/medicat`.

## Spec → tests (traceability)

| ERI section | IDs | Tests |
| --- | --- | --- |
| s4 core features | P3-F1 … P3-F7 | `conformance` (rendered screens), `state-machine` |
| s6 MVP steps | P3-M1 … P3-M6 | `demo` runs all six against the real page scripts; `conformance`; `state-machine` (`two tabs, one handoff`) |
| s7 accessibility | P3-A1 … P3-A7 | `conformance`; menu depth in `flow`; **P3-A2 and P3-A3 also need a person** |
| s8 success criteria | P3-S1 … P3-S5 | P3-S1 in `flow` (shortest path computed, not asserted) and `demo` (three real presses); the rest in `conformance` |
| s9 out of scope | P3-X1 … P3-X6 | `conformance` (absence scans over sources and rendered screens) |
| s10 privacy | P3-P1 … P3-P5 | `conformance`; the emergency path in `flow` and `demo` |
| the status rule (ours) | P3-P6 | `state-machine` (26 tests) and `demo` |
| say it in the demo (ours) | P3-P7 | human |
| escaping, totality of the screens | — | `views` |

38 rows, 37 with an automated check, 4 that also need human judgement, 0
uncovered. 35 rows have a test that runs the real code; 19 also lean on a
source-or-stylesheet scan; **2 rest on a scan alone** - P3-A2 (word counts are
not a reading level) and P3-X1 (an absence can only be scanned). Per-row detail
and the three honest gaps are in [spec/acceptance.md](spec/acceptance.md).

`bash tools/run_project_suite.sh challenges/p3-job-coach-connection` is the
repo's own runner and the same command CI uses; it passes here, and it prints a
warning that this project's suite **contains no accessibility or BDD stage**.
That warning is correct and it is not papered over: both would need
dependencies, and this folder has none by design. The browser pass is a human
on the list below.

## Layout

| Path | What |
| --- | --- |
| `web/index.html`, `web/employee.js` | the employee screen |
| `web/coach.html`, `web/coach.js` | the coach dashboard, a separate document |
| `web/style.css` | one stylesheet, both screens, no animation |
| `src/requests.js` | the state machine. Pure: no DOM, no clock, no storage, no timers |
| `src/store.js` | the shared list; the only place the clock and storage are read |
| `src/channel.js` | cross-tab transport: `BroadcastChannel`, falling back to the `storage` event |
| `src/flow.js` | the employee screen's navigation as data, so the three-interaction budget is measurable |
| `src/views.js` | every screen as a pure function from state to HTML, so what an employee sees is asserted and not inferred |
| `fixtures/` | the four support needs with icons, predefined employee messages, predefined coach replies, the people, the emergency procedure, and every word the screens say |
| `test/` | 108 tests, `node:test`: 40 state machine, 42 conformance, 12 flow, 11 views, 3 end-to-end demo |

Icons are inline SVG on a 24×24 grid with `<title>` and `<desc>`, stroke-only
in `currentColor`, so they scale with the button text and survive dark mode.
No binary files anywhere in this folder.

## Your job (pick one; finish it with a test, then pick the next)

Two human passes first, because nothing in `test/` can do them and they count
in judging:

- [ ] **One screen reader pass** (P3-A3). NVDA or VoiceOver, both screens, send
      a request and read the answer. Write down what it actually said.
- [ ] **One keyboard-only pass.** Unplug the mouse. Tab order, focus after the
      screen changes, and whether the live region announced the coach's reply.

Then, from ERI's section 4 features the MVP does not cover:

- [ ] **Picture-based messages** (s4 "Allow text, predefined messages, and
      picture-based selections"). Today the *need* is chosen from pictures but
      the *message* is words. Build a grid of symbols an employee can send
      instead of a sentence - and decide what the coach sees when the message
      is a picture.
- [ ] **Delivery to a real designated coach** (s4 "Deliver the request to a
      designated job coach **or** simulated coach inbox" - we built the second
      half). ERI section 10 names the price: secure sign-in, protected
      messages, record retention, agreed reply expectations. Spike what the
      smallest honest version costs; do not ship a fake one.
- [ ] **More than one employee in the dashboard** (s2: coaches "support several
      employees across different worksites"). Triage by kind of help and how
      long it has waited - without turning the time into a promise, and without
      showing anything an employee did not choose to send.
- [ ] **The third user** (s3 "Authorized workplace support staff when
      appropriate"). A second possible recipient means P3-P1 gets harder: the
      employee has to be able to tell who will see it, before they send it.
- [ ] **History beyond the session** (s4 says "within the current session").
      What should still be there tomorrow is a retention question for ERI
      before it is a code question. Get the answer, then build it.
- [ ] **Spanish, and a reading-level check** on every string in `fixtures/`
      (s7 plain language). The word-count test in `conformance` is a proxy; a
      reading-level check is closer to the real thing.

**Guardrails for anything you add:** no status without a real coach action; no
presence and no reply-time promise anywhere; the recipient stays named; the
coach sees requests, never activity; no field for a disability or a diagnosis;
and the request still submits in three interactions or fewer.
