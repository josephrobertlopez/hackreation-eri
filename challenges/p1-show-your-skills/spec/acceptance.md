# Acceptance: Show Your Skills (ERI project 1)

Every requirement in ERI's problem statement, one row each, with a disposition
and the thing that proves it.

**Source of truth:** [`docs/eri-problem-statements.md`](../../../docs/eri-problem-statements.md),
section "Project 1: Show Your Skills". Where this file disagrees with ERI's
words, ERI wins and this file is the bug. PRD cross-reference:
[`wiki/prds/p1-show-your-skills.md`](../../../wiki/prds/p1-show-your-skills.md).

## Dispositions

| Disposition | Means |
| --- | --- |
| `mvp` | In the prototype now, and a test fails if it breaks |
| `stretch` | Not built. ERI asked for it; it is in the README's pick-one list |
| `forbidden` | ERI put it out of scope. A test fails if it appears |
| `human` | No test can honestly decide it. A two-minute protocol is below |

Run everything machine-checkable:

```bash
node --test test/*.test.js          # 271 checks, no dependencies
bash test/browser-smoke.sh          # real browser, needs chromium
```

Coverage of the ID space, counted from the test names:

| section | rows | fully by test | part test, part human | human only |
| --- | --- | --- | --- | --- |
| §4 features (F1–F6) | 6 | 6 | 0 | 0 |
| §6 MVP (M1–M5) | 5 | 5 | 0 | 0 |
| §7 accessibility (A1–A6) | 6 | 3 (A3, A4, A6) | 3 (A1, A2, A5) | 0 |
| §8 success (S1–S4) | 4 | 1 (S4) | 2 (S2, S3) | 1 (S1) |
| §9 out of scope (X1–X5) | 5 | 5 | 0 | 0 |
| §10 privacy + ours (D1, D2, N1) | 3 | 2 (D1, D2) | 1 (N1) | 0 |
| **total** | **29** | **22** | **6** | **1** |

**Nothing is uncovered, and seven rows cannot be earned by a green suite:**
`P1-A1`, `P1-A2`, `P1-A5`, `P1-S1`, `P1-S2`, `P1-S3`, `P1-N1`. Each has a
protocol at the bottom of this file. The one row with no machine check at all is
`P1-S1` — "without technical assistance" — which is exactly the kind of claim a
test suite is worst at.

ID coverage is countable from the test names:

```bash
node --test test/*.test.js 2>&1 | grep -oE 'P1-[A-Z][0-9]+' | sort -u
# P1-A1 … P1-A6, P1-D1, P1-D2, P1-F1 … P1-F6, P1-M1 … P1-M5,
# P1-N1, P1-S2, P1-S3, P1-S4, P1-X1 … P1-X5   (28 of 29; P1-S1 is human-only)
```

---

## §4 Core features

| ID | ERI's requirement | Disposition | What proves it |
| --- | --- | --- | --- |
| P1-F1 | Create a profile: enter a name or display name, interests, and preferred work activities | `mvp` | `conformance.test.js` "P1-F1"; `portfolio.test.js` profile suite. `PROFILE_FIELDS` is exactly those three and `setProfile` throws on a fourth |
| P1-F2 | Add skills: select skills from a list or enter custom skills | `mvp` | `conformance.test.js` "P1-F2". 16-entry vocabulary in `fixtures/skills.js`; `addSkill(…, source: 'custom')` for anything not on it |
| P1-F3 | Show examples: add photos, short videos, audio, or written examples demonstrating a skill | `mvp`, with a stated limit | `conformance.test.js` "P1-F3" adds one of each of the four kinds. **Limit:** examples come from the prepared sample set plus free text. Recording or uploading a file is `stretch` — ERI §10 says sample media for the hackathon, and `guardrails.test.js` fails if a file input appears |
| P1-F4 | Describe abilities: use simple prompts such as "I am good at…" and "Here is something I can do…" | `mvp` | `conformance.test.js` "P1-F4". Every vocabulary skill ships both prompt sentences as one-press buttons; `fixtures.test.js` asserts the wording |
| P1-F5 | Preview portfolio: view a simple, employer-friendly presentation | `mvp` | `conformance.test.js` "P1-F5" — the first heading is "My skills" and every skill has its own heading. One renderer produces both the preview and the exported file, so what you preview is what ships |
| P1-F6 | Share portfolio: generate a view-only link or downloadable portfolio | `mvp` for the file; the link is real but plainly labelled | `conformance.test.js` "P1-F6"; `share.test.js` export + link suites. **See the note below — this row is the trap in ERI's brief** |

### Note on P1-F6, the "view-only link"

ERI §4 asks for a view-only link. ERI §9 puts production-grade hosting out of
scope. Those two pull in opposite directions, and the easy answer is the wrong
one: `URL.createObjectURL(blob)` yields a `blob:` URL that looks exactly like a
shareable link, and is dead the moment the tab closes. Sending one to an
employer sends them a broken page.

So:

1. **The MVP share artifact is a file.** `Save my page as a web page (.html)`
   produces one self-contained document: no scripts, no stylesheet to fetch, the
   sample imagery inlined as SVG. It opens from a USB stick in 2027.
   `guardrails.test.js` fails if `createObjectURL` or `new Blob` ever appears.
2. **A link is also offered, and it survives a reload.** The whole share is
   encoded into the URL fragment (`#p=…`), so there is no handle to go stale and
   nothing is uploaded — a fragment is never sent to a server. `share.test.js`
   round-trips it, including non-ASCII names, and `browser-smoke.sh` opens one in
   a real browser and reads the portfolio back out of the address bar.
3. **The UI says what the link is not**, in these words: "Nothing is uploaded and
   nobody hosts it for you — it only opens where this page already is. The file
   above is the sturdier thing to send."

A link an employer can click from an email, served from eri-wi.org, needs a
hosting decision from ERI. That is `stretch`, and it is ERI's call, not a
hackathon team's.

---

## §6 Minimum viable product

| ID | ERI's step | Disposition | What proves it |
| --- | --- | --- | --- |
| P1-M1 | Allows a user to enter basic profile information | `mvp` | `conformance.test.js` "P1-M1"; `mvpStatus().profile` |
| P1-M2 | Allows the user to select or enter three skills | `mvp` | `conformance.test.js` "P1-M2"; `mvpStatus().threeSkills` |
| P1-M3 | Allows at least one example of a skill to be added | `mvp` | `conformance.test.js` "P1-M3"; `mvpStatus().oneExample` |
| P1-M4 | Displays the information as a simple portfolio | `mvp` | `conformance.test.js` "P1-M4" reads the rendered text back; `browser-smoke.sh` step 1 |
| P1-M5 | Provides a way to share or export the portfolio | `mvp` | `conformance.test.js` "P1-M5"; both `.html` and `.json` exports |

The five steps are also visible to the user as a plain checklist
(`renderProgress`) — five words-not-numbers rows. `accessibility.test.js` fails
if a digit ever appears in it, because a progress bar over a person is one short
step from a score.

---

## §7 Accessibility requirements

| ID | ERI's requirement | Disposition | What proves it |
| --- | --- | --- | --- |
| P1-A1 | Support keyboard navigation and screen readers | `mvp` + `human` | **Machine:** `accessibility.test.js` runs five keyboard checks over index.html *and* all eight rendered chunks — no inline handlers, no positive `tabindex`, nothing with `role="button"` that is not a button, every `<button>` typed, no `autofocus`. Every input has an id and a matching `<label for>`; grouped choices sit in a fieldset with a legend. **Human:** protocol H1 and H2 below |
| P1-A2 | Use plain-language instructions | `mvp` + `human` | **Machine:** no sentence over 25 words, in index.html or in anything rendered at runtime; a jargon denylist; skill labels capped at 6 words. **Human:** protocol H3 |
| P1-A3 | Support alternatives to typed input | `mvp` | `conformance.test.js` "P1-A3" builds a complete portfolio — three skills, their sentences, their examples — with **zero typed characters**, from list ticks and one-press starter sentences. Only the display name still needs typing, and the sample loader fills even that |
| P1-A4 | Provide labels or text alternatives for images and captions or transcripts for audio/video | `mvp` | `addExample` **throws** without the alternative the kind requires: photo→description, audio→transcript, video→captions or transcript. `portfolio.test.js` drives all three refusals; `fixtures.test.js` checks all 8 samples; every SVG carries `<title>` and `<desc>` |
| P1-A5 | Avoid time limits and unnecessary steps | `mvp` (time limits) + `human` (steps) | **Machine:** the code owns no clock — no `setTimeout`, `setInterval`, `requestAnimationFrame`, `Date.now`, `@keyframes`, `transition`, or `<meta http-equiv="refresh">`. **Human:** protocol H4 counts the steps |
| P1-A6 | Allow users to choose which information is shared | `mvp` | `defaultShareSelection()` is all-off; `buildShare(portfolio)` with no selection **throws** rather than defaulting to everything; an example cannot ride along under a skill that was not shared, and the count of what was left out is reported. `share.test.js`, 8 checks |

### Known accessibility limitations, stated rather than hidden

- **Focus moves to a heading after a list re-renders.** Adding a skill rebuilds
  the "Skills on your page" region, so focus cannot stay on a button that no
  longer exists. Focus goes to that section's heading and a live region
  announces what happened. A finer-grained update that preserves focus exactly
  is `stretch`.
- **Colour contrast is not machine-checked.** There is no axe or Lighthouse here
  (no dependencies). Protocol H5.
- **Touch and small-screen layout** is not a P1 requirement — ERI lists mobile
  support under P2 and P4, not P1. The page is single-column and scales, but
  nothing tests it.

---

## §8 Success criteria

| ID | ERI's criterion | Disposition | What proves it |
| --- | --- | --- | --- |
| P1-S1 | A user can create a basic portfolio without technical assistance | `human` | Protocol H1. **No test can decide this** — a passing suite says nothing about whether a first-time user got through it alone |
| P1-S2 | A portfolio can be completed in approximately 5–10 minutes using prepared examples | `human`, machine-supported | **Machine:** `fixtures.test.js` "P1-S2" proves the prepared examples exist and that ERI's demo portfolio passes all five MVP steps. **Human:** protocol H6 puts a clock on it |
| P1-S3 | An employer can identify at least three skills from the resulting portfolio | `human`, machine half only | **Machine:** `conformance.test.js` "P1-S3" counts ≥3 skill headings in the exported file. **Human:** protocol H7. A heading count is not comprehension |
| P1-S4 | The prototype supports at least one non-text method of demonstrating a skill | `mvp` | `conformance.test.js` "P1-S4": `nonTextExampleCount() ≥ 1` and the exported file contains inline SVG. Written examples deliberately do not count |

---

## §9 Out of scope — each one a test that fails if it appears

| ID | ERI put out of scope | Disposition | What proves it |
| --- | --- | --- | --- |
| P1-X1 | Integration with commercial job boards | `forbidden` | `guardrails.test.js` + `conformance.test.js` "P1-X1" scan every shipped source for job-board names and APIs |
| P1-X2 | Automated hiring or applicant scoring | `forbidden` | "P1-X2". Also: no exported function name may contain score/rank/rating/grade/assess/suitab/percent/tier/level, nothing sorts or weights a skill, and nothing rendered may show a number with `%`, `/n`, "stars", "points" or "out of" |
| P1-X3 | Employer account management | `forbidden` | "P1-X3". No login, signup, password or session anywhere. There is no account to manage: the portfolio lives in the page and leaves as a file |
| P1-X4 | AI-generated assessments of applicant suitability | `forbidden` | "P1-X4". No model provider, no inference call, no embedding. The tool has no opinion about anyone |
| P1-X5 | Full identity verification or production-grade hosting | `forbidden` | "P1-X5". No SSN/DOB/identity field; no server; the share link carries data rather than a server address. The display name is explicitly *not* a legal name |

---

## §10 Privacy and design considerations, and one of ours

| ID | Requirement | Disposition | What proves it |
| --- | --- | --- | --- |
| P1-D1 | "The product should not require disclosure of a disability or diagnosis" | `forbidden` (as a field) | `setProfile` refuses any unknown field and any field name matching the protected pattern — `disability`, `diagnosis`, `medical`, `accommodation`, `supportNeed`, `impairment` and more. Tested in three files. No label, legend, placeholder or field name in index.html or in any rendered chunk may read as a health question. The exported JSON is walked key by key |
| P1-D2 | "Sample media should be used for the hackathon"; demonstration content only with consent | `mvp` | All imagery is synthetic inline SVG; the audio and video samples are labelled stand-ins carrying their full transcript, and `fixtures.test.js` fails if either loses that label. `.gitignore` refuses every format a camera or microphone produces, and refuses exported portfolios. No binary file can enter the folder without failing a test |
| P1-N1 | *(ours, = PRD AC-P1.9)* The app makes no network request; nothing leaves the browser | `mvp`, machine half | `guardrails.test.js` scans every shipped file for `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`, `serviceWorker`, `new Image`, any absolute URL, any non-relative import, and any browser storage. **A source scan is not a packet capture** — protocol H8 |

### Why free text is never censored

`P1-D1` refuses **fields**, not sentences. ERI's rule is that disclosure must
never be *required*; it is not a rule that an adult may not write a sentence
about their own life. A filter that deletes a job seeker's words for containing
"therapy" also deletes "I worked at a physical therapy clinic," and telling
someone what they may say about themselves is its own harm. So the app shows one
dismissible line — *"You never have to share health or disability information
here. It is your page and your choice."* — and then gets out of the way.
`mentionsProtectedDetail()` drives that hint and nothing else.

---

## Human protocols

Eight protocols. Each is under two minutes, needs no setup beyond
`npm start`, and has a written pass line. Run H1 and H3 at minimum; ERI's §8
cannot be judged without them.

### H1 — First-time user, unassisted (P1-S1, P1-A1)
**Two minutes.** Find someone who has not seen this. Open
`http://localhost:8000/web/`, hand over the keyboard, and **say nothing at all**
— not one hint. Watch them try to put their name, three skills and one example
on the page.
**Pass:** they reach a visible portfolio in the preview with no help. **Fail:**
you had to explain any control, or they asked "what do I do now?" and you
answered. Write down the first place they stalled; that sentence is the most
valuable output of this whole folder.

### H2 — Keyboard and screen reader (P1-A1)
**Two minutes.** Unplug the mouse. From the address bar press Tab and keep
going: skip link → the two Start buttons → name → interests → activities →
skill ticks → add → each skill card → share ticks → make my file.
Then turn on a screen reader (VoiceOver `Cmd-F5`, NVDA, or Orca `Super-Alt-S`)
and do the same.
**Pass:** every control is reachable, the focus ring is always visible, each
control is announced with a name that says what it does, and adding a skill is
announced out loud. **Fail:** focus vanishes, a control is announced as just
"checkbox", or a button is unreachable.

### H3 — Plain language (P1-A2)
**Two minutes.** Read every sentence on the page out loud, slowly.
**Pass:** a reader who has never used a portfolio tool understands every
sentence on one pass, and no sentence needs re-reading. **Fail:** any sentence
you stumble over, any word you would not say to someone in person, any
instruction that describes the interface instead of the task.

### H4 — Unnecessary steps (P1-A5)
**Two minutes.** Count the presses from an empty page to a saved file, using
list picks and prepared examples only.
**Pass:** no step exists that could be removed without losing a choice the
person should be making. **Fail:** you find a press that only acknowledges
something, or any screen between the person and their page.

### H5 — Contrast and focus visibility (P1-A1)
**One minute.** Open DevTools, pick the body text, the button text, the hint
text and the focus ring, and read the contrast ratio each time. Repeat with the
OS in dark mode — the page follows it.
**Pass:** body and button text ≥ 4.5:1, the focus ring ≥ 3:1 against both the
control and the background, in both themes. **Fail:** anything below, which is
a one-line fix in `web/style.css`.

### H6 — Five-to-ten minutes with prepared examples (P1-S2)
**Up to ten minutes, once.** Start a timer. Press "Show me a finished example"
to see what one looks like, press "Start over with an empty page", then build a
real portfolio: name, three skills, a sentence each, one example each, tick what
to share, save the file. Stop the timer when the file is on disk.
**Pass:** between roughly 5 and 10 minutes, unhurried, with no step skipped.
**Fail:** over 10 minutes, or under 2 — under 2 means the prepared examples are
doing the work the person should be doing, and the portfolio is not theirs.

### H7 — An employer reads it (P1-S3)
**Two minutes.** Open a saved `.html` file in front of someone who has not seen
the portfolio. Give them 60 seconds, then take it away and ask: "name three
things this person can do at work."
**Pass:** they name three, in their own words, without having scrolled back.
**Fail:** they name two, or they describe the layout instead of the skills, or
they ask what the pictures were for — that last one means a caption is doing a
picture's job.

### H8 — Nothing leaves the browser (P1-N1)
**One minute.** Open DevTools → Network, tick "Disable cache", load the page,
then use the whole app: load the sample, add a skill, add an example, make the
file, open the share link.
**Pass:** after the initial page load (`index.html`, `style.css`, and the ES
modules, all same-origin and relative), the request count **does not increase by
one** for anything you do. **Fail:** any request at all, to any host, including
a favicon from somewhere unexpected.

---

## What nothing here covers

Stated plainly, so a judge does not have to infer it:

- **Whether a screen reader reads this *well*** as opposed to reads it at all.
  H2 is one person's pass, not a review by someone who uses one daily.
- **Whether the language suits the people ERI serves.** H3 is a proxy. The real
  check is a job seeker and a job coach reading it, and that has not happened.
- **Colour contrast**, as a measured number. H5 asks a human to read the ratio
  off DevTools; nothing records it.
- **Any live network behaviour.** Every network claim here is a source scan plus
  H8's eyeball. There is no packet capture.
- **Mobile and touch.** Not a P1 requirement, not tested.
- **The P1 → P4 handoff** ERI names in P4 §12. The skill vocabulary is kept in
  step with P4's task vocabulary on purpose, but no test spans the two
  challenges, and nothing has been demonstrated end to end.
