# Challenge P1: "Show Your Skills" (hello world)

What ERI would need: (your team writes this)

**ERI's brief:** [docs/eri-problem-statements.md](../../docs/eri-problem-statements.md#project-1-show-your-skills) · **PRD:** [wiki/prds/p1-show-your-skills.md](../../wiki/prds/p1-show-your-skills.md) · **Acceptance:** [spec/acceptance.md](spec/acceptance.md)

A job seeker makes a short page showing what they can do at work — three
skills, each with a sentence in their own words and an example an employer can
look at — then saves it as a file they own. **Everything runs in the browser,
nothing is sent anywhere, and nothing is stored**, which is what makes it
reviewable by ERI's web team.

Two things this tool will not do, because ERI said so: it never asks about a
disability or a diagnosis, and it never scores, ranks or assesses the person.
Both are enforced by tests that fail, not by promises in a file like this one.

```bash
cd challenges/p1-show-your-skills
npm start                    # http://localhost:8000/web/
npm test                     # node:test, NO npm install needed
npm run test:browser         # renders it in real headless Chromium; skips if you have none
npm run ci                   # both of the above — what CI runs
npm run fixtures             # regenerate fixtures/media/*.svg from fixtures/media.js
```

`tools/run_project_suite.sh` will print a warning that this project's suite
**contains no accessibility or bdd stage**. That warning is accurate — there is
no axe, Lighthouse, Cucumber or Playwright here, because there are no
dependencies — and it is not the whole story: `test/accessibility.test.js`
carries 84 static markup checks and `test/browser-smoke.sh` renders the real
page in a real browser. The parts no static check can honestly decide are
written up as human protocols in [spec/acceptance.md](spec/acceptance.md#human-protocols),
and two of ERI's own success criteria can only be earned there.

There is no `npm ci`, no lockfile, no build step and no framework — plain HTML,
CSS and ES modules. `node --test` and `python3 -m http.server` are the whole
toolchain. A test fails if a dependency ever creeps in.

First 10 minutes: `npm test` (all green), press **"Show me a finished
example"** in the app to see where it ends up, then read `web/portfolio.js` —
every rule lives there. Then pick one box below and write its failing test
first.

## Spec → tests (traceability)

| ERI's section | IDs | Unit / conformance | Also checked by |
| --- | --- | --- | --- |
| §4 core features | P1-F1 … F6 | `test/conformance.test.js`, `test/portfolio.test.js` | `test/share.test.js` |
| §6 MVP steps | P1-M1 … M5 | `test/conformance.test.js` | `test/browser-smoke.sh` |
| §7 accessibility | P1-A1 … A6 | `test/accessibility.test.js` (84 checks) | 5 human protocols, H1–H5 |
| §8 success criteria | P1-S1 … S4 | `test/fixtures.test.js`, `test/conformance.test.js` | H1, H6, H7 — **S1 and S3 are human-judged** |
| §9 out of scope | P1-X1 … X5 | `test/guardrails.test.js` | `test/conformance.test.js` |
| §10 privacy | P1-D1, P1-D2 | `test/guardrails.test.js` | `.gitignore`, `test/fixtures.test.js` |
| no network *(ours)* | P1-N1 | `test/guardrails.test.js` | H8 — source scan only, not a packet capture |
| wiring (ids, actions, imports) | — | `test/app-wiring.test.js` | `test/browser-smoke.sh` |

Which ACs are **not** decidable by a test, and the two-minute protocol for each,
is in [spec/acceptance.md](spec/acceptance.md#human-protocols). `P1-S1`
("without technical assistance") and `P1-S3` ("an employer can identify at least
three skills") are human-judged, full stop — a green suite does not earn them.

Self-contained: sample data in `./fixtures/`, no shared repo state.

## About the share (read this before "improving" it)

ERI §4 asks for a **view-only link**; ERI §9 puts production hosting **out of
scope**. The tempting answer — `URL.createObjectURL(blob)` — produces a link
that looks shareable and dies the moment the tab closes, so you would be
emailing an employer a broken page.

So the MVP share is a **file**: one self-contained `.html` with the imagery
inlined, no scripts, no fetches, openable in 2027 off a USB stick. A link is
offered too, and it carries the whole portfolio inside the URL fragment, so it
survives a reload and a bookmark — and the UI says in plain words that nobody
hosts it. A hosted link that an employer can click from an email needs a
hosting decision from ERI; that is theirs to make, not a hackathon team's.

## Your job (pick one; finish it with a test, then pick the next)

Each of these is a piece of ERI's §4 feature list that the MVP does **not**
cover. The trap in each is named, because that is the part that takes the time.

- [ ] **Add your own photo or video** (ERI §4 "Show examples"). A file input
      with `capture`, held in memory only. *Traps:* `addExample` already refuses
      media with no description or transcript and that rule must stay; the
      `.gitignore` here refuses every camera format, so never force-add one; and
      inlining a real photo into the exported file means base64, which will make
      the `.html` large — measure it.
- [ ] **Hear the page read aloud.** `window.speechSynthesis` for the sentences
      and the captions, with a stop button. *Trap:* it must be the person's
      choice to start, there must be no autoplay, and the voice must not be the
      only way to get the content.
- [ ] **Say your sentence instead of typing it** (ERI §7 "alternatives to typed
      input"). *Trap:* Chrome's `webkitSpeechRecognition` sends audio to Google —
      that breaks P1-N1 and `test/guardrails.test.js` will fail. If you build
      this, it must be local-only, and the README must say what leaves the
      device.
- [ ] **Load a saved portfolio back in** from the exported `.json`, so work
      survives a reload. *Trap:* a file someone hands you is untrusted input —
      run it through `setProfile`/`addSkill`/`addExample` so every rule applies
      on the way in, never `Object.assign` it into state.
- [ ] **Print / PDF layout**, so a portfolio can be handed over on paper at an
      interview. *Trap:* the SVG and the captions must survive a page break;
      there is a `@media print` start in the exported file's styles.
- [ ] **A job-coach view** (ERI §3 secondary users: "I want to help someone
      organize their work examples"). *Trap:* ERI's §10 — the portfolio belongs
      to the job seeker. A coach helps; a coach does not own it, and must not be
      able to share it on the person's behalf.
- [ ] **Picture-first skill picking** — an icon beside every skill for people who
      read little text. *Trap:* every icon needs a text label next to it, not
      instead of it, and the icons must be SVG you can caption.
- [ ] **A real view-only link**, hosted. *Trap:* this is ERI §9 out-of-scope for
      today. Do not build it without an answer from ERI about where video lives
      and who can reach it.
- [ ] **Spanish version**; a 6th-grade reading-level check in CI. *Trap:* the
      25-word sentence test in `test/accessibility.test.js` is a crude proxy —
      beat it, don't just satisfy it.

Every team: a screen reader pass is the best evidence for the Accessible row; a keyboard pass honestly reported still scores (event page, Judging). Protocol H2 in
[spec/acceptance.md](spec/acceptance.md#h2--keyboard-and-screen-reader-p1-a1).

**Guardrails.** Never a field, prompt, label or column for a disability or
diagnosis. No score, rank or assessment of a person — ERI put applicant scoring
and AI suitability assessment out of scope. The person chooses what each share
contains; share-everything-by-default is a defect, not a convenience. Keyboard
reachable with a visible focus ring, a label on every input, a caption or
transcript for every picture and recording, and no time limits anywhere. Sample
media only.
