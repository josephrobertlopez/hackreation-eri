# Acceptance: Job Coach Connection

**ERI project 3.** Source of truth: [docs/eri-problem-statements.md](../../../docs/eri-problem-statements.md#project-3-job-coach-connection).
PRD: [wiki/prds/p3-job-coach-connection.md](../../../wiki/prds/p3-job-coach-connection.md).

One row per requirement in ERI's own sections 4, 6, 7, 8, 9 and 10. Where this
file and ERI's page disagree, ERI's page wins and this file is the bug.

**Disposition**

| Value | Means |
| --- | --- |
| `mvp` | built today, and a test fails if it breaks |
| `stretch` | named, not built; it is in the README's pick-one list |
| `forbidden` | must stay absent; a test fails if it appears |
| `human` | no test can decide this; a person has to look |

**Kind of proof**

| Value | Means |
| --- | --- |
| `behaviour` | a test runs the real code and reads the real result - rendered HTML from `src/views.js`, a real store transition, or the whole demo driven through `web/employee.js` and `web/coach.js` in `test/demo.test.mjs` |
| `structural` | a test reads the shipped source or the stylesheet. A proxy: it proves the thing is *built* that way, not that it works |
| `human` | a person with a screen reader, or a person reading the words |

**INTERACTION, defined** (used by P3-S1): one activation of one control by the
employee - a tap, a click, or Enter or Space on a focused control - counted
from the home screen up to and including the press that submits the request.
Reading, scrolling, moving focus with Tab, and typing into the optional message
box are not interactions. Typing is already optional, and counting keystrokes
would penalise exactly the people this tool is for.

Test files are referred to by their short name: `state-machine`, `conformance`,
`flow`, `views`, `demo`.

---

## ERI section 4 - core features

| ID | ERI's requirement | Disp. | What proves it | Kind |
| --- | --- | --- | --- | --- |
| P3-F1 | Request help: a clearly labelled "I Need Help" option | `mvp` | `conformance` P3-F1 renders the home screen, slices out the actual button, and asserts it contains both an `<svg>` and the words `I Need Help`; the 88px height is read from the stylesheet | behaviour + structural |
| P3-F2 | Select support need: choices such as "I have a question", "I don't understand a task", "My schedule changed" | `mvp` | `conformance` P3-F2: four needs, ERI's three examples present, and each rendered button carries its own icon and its own label | behaviour |
| P3-F3 | Multiple communication options: text, predefined messages, picture-based selections | `mvp` (partial) | `conformance` P3-F3: 3+ predefined messages per need rendered as buttons, four picture choices, one textarea. **Partial:** picture-based *selection of a need* is built; a picture library as the message body is `stretch` | behaviour |
| P3-F4 | Send request: deliver to a designated job coach or simulated coach inbox | `mvp` | `conformance` P3-F4, and `demo` drives it through the real page scripts into the other tab's dashboard | behaviour |
| P3-F5 | View request status: sent, seen or answered | `mvp` | the whole `state-machine` suite (40 tests); `conformance` P3-F5 renders all three statuses and asserts each has its own words, its own icon and its own class. See **P3-P6** - the status rule is the strictest thing in this folder | behaviour |
| P3-F6 | Job coach response: a short written or predefined response | `mvp` | `conformance` P3-F6 renders an opened request and finds the reply `select` with every predefined reply plus a textarea; `state-machine` refuses an empty reply | behaviour |
| P3-F7 | Communication history: review messages within the current session | `mvp` | `state-machine` P3-F7 (newest first), `conformance` P3-F7 (empty and filled), `demo` P3-F7 (the real screen after a real round trip) | behaviour |

## ERI section 6 - minimum viable product

| ID | ERI's step | Disp. | What proves it | Kind |
| --- | --- | --- | --- | --- |
| P3-M1 | Displays a clearly labelled "I Need Help" option | `mvp` | `demo` mounts `web/employee.js` and finds `I Need Help` on the screen; `conformance` P3-M1 also checks the static markup | behaviour + structural |
| P3-M2 | Employee selects from four common support needs | `mvp` | `conformance` P3-M2: four `pick-need` buttons, one press each | behaviour |
| P3-M3 | Allows an optional short text message | `mvp` | `conformance` P3-M3: a request with no message sends and records `messageSource: 'none'`; `demo` sends with nothing typed and nothing picked | behaviour |
| P3-M4 | Sends the request to a demonstration job coach dashboard | `mvp` | `conformance` P3-M4: `coach.html` is a separate document and neither page loads the other's script. `demo` mounts both scripts and carries one request between them over the channel | behaviour + structural |
| P3-M5 | The job coach can acknowledge and respond | `mvp` | `demo` presses the real **Open this request** and the real **Send reply**; `state-machine` proves no other route exists | behaviour |
| P3-M6 | Displays the response on the employee's screen | `mvp` | `conformance` P3-M6 and `demo`: the coach's exact words appear on the employee's screen, attributed by name, and the live region announces the change | behaviour |

## ERI section 7 - accessibility requirements

| ID | ERI's requirement | Disp. | What proves it | Kind |
| --- | --- | --- | --- | --- |
| P3-A1 | Large buttons and clear icons with text labels | `mvp` | `conformance` P3-A1: every `min-height` in the stylesheet is >= 44px, and on every rendered screen the number of icons equals the number of `aria-hidden` wrappers, so no icon beside a label is ever announced twice. Every need icon has a `<title>` and a `<desc>` | behaviour + structural |
| P3-A2 | Short, plain-language message options | `mvp` + `human` | `conformance` P3-A2: need labels <= 6 words, employee messages <= 14, coach replies <= 26. **A word count is not a reading level** - a person still has to read them | structural + human |
| P3-A3 | Screen readers and keyboard navigation | `mvp` + `human` | `conformance` P3-A3 (two tests): `lang`, skip link, `main`, a polite live region and no inline `onclick` in both pages; then on every rendered screen - no `div` used as a button, no positive `tabindex`, every `<button>` typed, exactly one focus target, every control labelled. `demo` proves the live region is actually written to. **One real screen-reader pass is still required and is not automated here** | behaviour + structural + human |
| P3-A4 | Alternatives to typing | `mvp` | `conformance` P3-A4: picture choices, 3+ predefined messages per need, and a predefined send recorded as `predefined` | behaviour |
| P3-A5 | Clear confirmation when a message is sent | `mvp` | `conformance` P3-A5 (the confirmation screen says so, in its own bordered block) and `demo` (the live region says so out loud) | behaviour + structural |
| P3-A6 | Easy to review previous messages | `mvp` | `conformance` P3-A6 and `flow` P3-A7: the history is one interaction from the home screen and from the confirmation screen | behaviour |
| P3-A7 | Avoid complicated menus or unnecessary steps | `mvp` | `flow` P3-A7: no screen more than 3 interactions deep, measured by breadth-first search over `src/flow.js`. `conformance`: no `select` or `details` on any employee screen, and no animation or transition in the stylesheet | behaviour + structural |

## ERI section 8 - success criteria

| ID | ERI's criterion | Disp. | What proves it | Kind |
| --- | --- | --- | --- | --- |
| P3-S1 | Submit a request in three interactions or fewer using predefined options | `mvp` | `flow` P3-S1: the shortest route is *computed* breadth-first and must be <= 3; it currently measures `need-help -> pick-need -> send`. `demo` then presses exactly those three on the real screen and the request is sent. Adding any step turns both red | behaviour |
| P3-S2 | The request appears in the coach dashboard | `mvp` | `conformance` P3-S2: it is in `coachInbox()`, and on the *closed* card the kind of help is rendered above the Open button. `demo` finds it in the dashboard after a real send | behaviour |
| P3-S3 | A coach can acknowledge and respond | `mvp` | `conformance` P3-S3 over the real store; `demo` through the real buttons | behaviour |
| P3-S4 | The employee can clearly identify whether the request was received | `mvp` + `human` | `conformance` P3-S4: three distinct labels, three distinct icons, and the `sent` screen saying in plain words that nobody has opened it yet. **Whether that reads as clear is human** | behaviour + human |
| P3-S5 | At least one alternative to typed communication | `mvp` | `conformance` P3-S5 | behaviour |

## ERI section 9 - out of scope for the hackathon

| ID | ERI's exclusion | Disp. | What proves it | Kind |
| --- | --- | --- | --- | --- |
| P3-X1 | Integration with employer personnel systems | `forbidden` | `conformance` P3-X1: no `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource` or `sendBeacon` in any shipped file, and no page loads anything over http(s). An absence can only be shown by looking | structural |
| P3-X2 | Medical or emergency response services | `forbidden` | `conformance` P3-X2: the rendered emergency screen routes to 911, the person in charge and the posted plan, and carries no send or pick-need action. `demo` P3-P4 presses into it and asserts the request count did not change. Routing to an existing procedure is not building one | behaviour + structural |
| P3-X3 | Video calling or advanced messaging | `forbidden` | `conformance` P3-X3: no `video`, `audio`, `mediaDevices`, `getUserMedia` or `RTCPeerConnection` in any shipped file or any rendered screen | behaviour + structural |
| P3-X4 | Automated monitoring of employees | `forbidden` | `state-machine` asserts `coachView()`'s field list exactly; `conformance` P3-X4 asserts the dashboard renders from that projection and not from the raw requests | behaviour + structural |
| P3-X5 | Production-grade confidential case management | `forbidden` | `conformance` P3-X5: the home screen renders what a real version would need; both pages say they are a demonstration with a simulated inbox. **Proxy:** this proves the product says so, not that no such feature exists | behaviour + structural |
| P3-X6 | Multi-agency coordination systems | `forbidden` | `conformance` P3-X6: one named coach, and no agency or referral vocabulary in either script or any rendered screen | behaviour + structural |

## ERI section 10 - privacy and design considerations

ERI put these in a privacy paragraph rather than in the MVP list or the success
criteria. That makes them the requirements most likely to be skipped by a
prototype that still demos well, so they are treated here as blocking.

| ID | ERI's requirement | Disp. | What proves it | Kind |
| --- | --- | --- | --- | --- |
| P3-P1 | "The system must clearly identify who can receive messages" | `mvp` | `conformance` P3-P1: the coach is named `Maria Delgado`; the home, compose and confirmation screens all render her name; the phrase "your coach" appears on no screen, because with a simulated inbox it identifies nobody; and the recipient banner sits *outside* the element that re-renders, so no screen can drop it. `demo` asserts the banner is written on mount | behaviour + structural |
| P3-P2 | "Employees should understand what information is shared and with whom" | `mvp` | `conformance` P3-P2: what is shared and what is not are both rendered on the home screen | behaviour |
| P3-P3 | "The product should not imply that a job coach is always immediately available" | `mvp` | `conformance` P3-P3: 17 forbidden patterns (presence, reply-time promises, "standing by", "last seen", "on call", "will respond") scanned across every shipped file **and every rendered screen**, plus the positive check that the honest line is on the home screen *and* on the confirmation screen, where somebody is actually waiting | behaviour + structural |
| P3-P4 | "Distinguish routine coaching requests from emergencies and direct users to established emergency procedures" | `mvp` | `flow` P3-P4: the emergency screen is reachable in one interaction from every other screen, appears on *no* route to a submitted request, and leads only back to the start. `conformance` P3-P4: different border and different shape (`border-radius: 0` against the routine button's `10px`), so the difference survives greyscale and high contrast, and no other screen renders any emergency copy. `demo` P3-P4: pressing into it sends nothing | behaviour + structural |
| P3-P5 | "The product should not require disclosure of a disability" (section 10 read with section 9's no-monitoring rule) | `mvp` | `conformance` P3-P5: no input, label, `for`, `name` or placeholder in any shipped file *or any rendered screen* matches `disab/diagnos/impair/condition/medicat`, and no fixture key does either | behaviour + structural |
| P3-P6 | *(ours, from ERI section 4 read honestly)* No status transition without a corresponding real action on the coach side | `mvp` | `state-machine` "FALSIFIER: a status cannot advance without a coach action" - 26 tests. Seven impostor actors and fourteen invented events are refused; the mocked clock is run forward a full day with nothing moving; no shipped file may contain a timer; only `src/requests.js` may write the words `seen` or `answered` into a status; `render()` on the dashboard may not call `store.open()`. `demo` asserts that merely mounting the dashboard leaves the status at `sent`. **Verified by mutation:** inserting the two-second fake-seen timer turns three of those tests red and takes the demo file with them | behaviour + structural |
| P3-P7 | *(ours)* A production version needs secure authentication, protected communications, record retention and defined response expectations - say so in the demo | `human` | The sentence renders on the home screen. Whether it is said out loud on Saturday is a person's job | human |

---

## Counts

| | Rows | With an automated check | Human judgement also needed | Uncovered |
| --- | --- | --- | --- | --- |
| s4 features | 7 | 7 | 0 | 0 |
| s6 MVP | 6 | 6 | 0 | 0 |
| s7 accessibility | 7 | 7 | 2 (P3-A2, P3-A3) | 0 |
| s8 success | 5 | 5 | 1 (P3-S4) | 0 |
| s9 out of scope | 6 | 6 | 0 | 0 |
| s10 privacy (+ ours) | 7 | 6 | 1 (P3-P7, human only) | 0 |
| **total** | **38** | **37** | **4** | **0** |

By Kind, over the 37 rows with an automated check:

| | Rows |
| --- | --- |
| at least one `behaviour` check | 35 |
| at least one `structural` check | 19 |
| `structural` with no behavioural leg | 2 - P3-A2 (word counts) and P3-X1 (no network) |

**The honest gaps.** Three, named plainly:

1. **No real browser.** `test/demo.test.mjs` drives the real page scripts
   against a stub DOM of about sixty lines. It proves the handlers, the
   channel, the live region and the round trip work. It does **not** prove
   anything about layout, focus rings, touch targets at a real DPI, or what a
   screen reader says. There is no Playwright and no axe here because there are
   no dependencies here.
2. **P3-A2 and P3-A3 need a person.** A word count is not a reading level, and
   a correct `aria-hidden` is not a usable screen-reader experience. Both
   passes are the first two items on the README's list.
3. **An absence can only be scanned, never run.** P3-X1 (no network) is a
   source scan, and that is the strongest form that claim can take.
