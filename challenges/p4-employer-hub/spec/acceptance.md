# Acceptance: Employer Opportunity & Support Hub (ERI Project 4)

**Source of truth:** [docs/eri-problem-statements.md](../../../docs/eri-problem-statements.md#project-4-employer-opportunity--support-hub),
section "Project 4: Employer Opportunity & Support Hub". ERI's words win. The
PRD at [wiki/prds/p4-employer-hub.md](../../../wiki/prds/p4-employer-hub.md)
maps onto these rows and is downstream of both.

**39 rows, one per requirement ERI wrote.** Project 4's statement has twelve
sections, not ten like the others, and §10 is seven hard ethical requirements.
Those seven are the deliverable, not the disclaimer, so they get IDs and tests
like everything else.

| Group | ERI section | IDs | Count |
| --- | --- | --- | --- |
| Core product features | §4 | P4-F1 to P4-F7 | 7 |
| Minimum viable product | §6 | P4-M1 to P4-M6 | 6 |
| Accessibility requirements | §8 | P4-A1 to P4-A7 | 7 |
| Success criteria | §9 | P4-S1 to P4-S6 | 6 |
| Privacy and ethical requirements | §10 | P4-V1 to P4-V7 | 7 |
| Out of scope for the hackathon | §11 | P4-X1 to P4-X6 | 6 |

## Dispositions

| Disposition | Means |
| --- | --- |
| `mvp` | Built, and a test fails if it breaks |
| `stretch` | Not built. ERI calls it optional; a test asserts it is genuinely absent so the spec cannot drift into claiming it |
| `forbidden` | Must never happen. The test is a positive control plus a clean run, so a guard with a typo cannot pass silently |
| `human` | A person has to judge it. Automated checks are a floor, not a pass |

`test/conformance.test.js` parses this file and fails if an `mvp` or
`forbidden` row cites a test that does not exist or does not mention its ID, if
a `stretch` row does not say it is unimplemented, or if a `human` row does not
say a human judges it. The spec and the suite cannot drift apart quietly.

---

## §4 Core product features

| ID | ERI's requirement (§4) | Disposition | What proves it |
| --- | --- | --- | --- |
| P4-F1 | §4 Employer needs assessment: "Allow employers to describe their business, staffing needs, and job tasks." | `mvp` | `test/match.test.js` P4-F1 - an industry is selected, a task can be borrowed from its list as a need, and the borrowed need keeps its order and its skills |
| P4-F2 | §4 Skills-to-tasks matching: "Identify potential connections between candidate strengths and workplace responsibilities." | `mvp` | `test/match.test.js` P4-F2 - a connection exists only where a whole word of the employer's sentence names a skill the candidate shared; "wipe down the counter" is cleaning, not counting stock |
| P4-F3 | §4 Job task development: "Help employers explore combinations of tasks that could create meaningful employment opportunities." | `mvp` | `test/plan.test.js` P4-F3 - suggestions group into draft responsibilities, each still naming the need and skill behind it, in the employer's own need order |
| P4-F4 | §4 Disclosure guidance: "Offer examples and explanations of appropriate employer responses to disability disclosures." | `stretch` | Not implemented. `test/conformance.test.js` P4-F4 asserts no disclosure script or scenario text exists anywhere in the build. This is one of the two legally dangerous features: if you build it, quote or link EEOC material, never write your own |
| P4-F5 | §4 Accommodation explorer: "Suggest possible accommodations and connect users to authoritative resources." | `stretch` | Not implemented beyond the "connect users to authoritative resources" half, which is P4-F7. `test/conformance.test.js` P4-F5 asserts no accommodation is ever named by this tool. The other legally dangerous feature: JAN quotes and links only |
| P4-F6 | §4 Onboarding planner: "Create a simple checklist for training, communication, and workplace supports." | `stretch` | Not implemented. `test/conformance.test.js` P4-F6 asserts the plan carries next steps rather than a training curriculum. Plan step 5 names how the work will be taught; it is not an onboarding checklist |
| P4-F7 | §4 Resource connections: "Provide links to JAN, EEOC, DVR, and other trusted resources." | `mvp` | `test/plan.test.js` P4-F7 - JAN, the EEOC and Wisconsin DVR are all present, and every resource is a pointer with a URL or a phone number, never content |

## §6 Minimum viable product

ERI: *"For a one-day hackathon, focus primarily on the skills-to-tasks matching
feature."* So the six steps below are the build, and §4's other four features
are the optional edges.

| ID | ERI's step (§6) | Disposition | What proves it |
| --- | --- | --- | --- |
| P4-M1 | §6 step 1: "Allow an employer to select an industry or business type." | `mvp` | `test/match.test.js` P4-M1 - eight industries, each with at least three recurring tasks, every task naming only known skills, traits and interest areas |
| P4-M2 | §6 step 2: "Allow the employer to describe three to five workplace needs or recurring tasks." | `mvp` | `test/match.test.js` P4-M2 - two needs is refused, three and five are accepted, six is refused, blanks are dropped, order is kept, and the refusal message says what to do in plain words |
| P4-M3 | §6 step 3: "Allow entry of a fictional candidate's skills, interests, and work preferences." | `mvp` | `test/match.test.js` P4-M3 and `test/conformance.test.js` P4-M3 - the default loads the profile the candidate shared, manual entry is the stamped fallback, and free-text abilities are refused. See the design call below |
| P4-M4 | §6 step 4: "Suggest possible matches between those skills and workplace tasks." | `mvp` | `test/match.test.js` P4-M4 - ERI's retail demonstration yields matches, every one citing a need the employer entered and a skill the candidate shared; a candidate from another trade gets gaps, not filler |
| P4-M5 | §6 step 5: "Explain why each task might be a good match." | `mvp` | `test/match.test.js` P4-M5 and `test/guards.test.js` P4-M5 - every suggestion's explanation literally contains both quotes it cites, and an explanation that does not is refused |
| P4-M6 | §6 step 6: "Display a simple employer action plan with suggested next steps." | `mvp` | `test/plan.test.js` P4-M6 - a plan with at least four steps, draft responsibilities, questions for an employment specialist, trusted resources, and the unmatched needs carried through as open questions |

### The design call on §6 step 3

**ERI's step 3 has the employer typing the candidate's skills. This build does
not default to that, and the reason is ERI's own §10.**

An employer narrating a disabled person's abilities is the exact shape §10
guards against: it makes the employer the author of what the candidate can do.
Their §9 bullet 3 wants suggestions that "reflect actual employer needs, not
assumptions about disability" - and an employer's second-hand account of a
person's skills is precisely where an assumption enters.

So the default is **loading a fictional candidate profile from
`fixtures/candidates.js`, in the shape a person would have sent it**: their own
words, their own chosen skills, a recorded permission to share, and a note of
what they agreed to share. Manual entry still exists for the employer with no
profile in front of them, and the output is stamped
`entryMode: 'typed-by-employer'` so every screen can say whose account of the
person this is.

ERI's §12 names exactly this handoff - *"could connect directly with the Show
Your Skills portfolio, allowing job seekers to selectively share information
with interested employers"* - so the skill, interest and preference
vocabularies in `fixtures/vocabulary.js` use plain ids a sibling project could
emit (`organizing`, `counting-stock`, `routine-work`) with no translation
layer. `test/match.test.js` P4-M3 fails if a fixture profile ever uses an id
outside that vocabulary.

**This is a deviation from ERI's literal step 3 and they should get to overrule
it.** The manual path is one radio button away, and the loader and the manual
entry produce the same object, so reversing the default is a one-line change in
`web/index.html`.

## §8 Accessibility requirements

| ID | ERI's requirement (§8) | Disposition | What proves it |
| --- | --- | --- | --- |
| P4-A1 | §8: "Keyboard and screen-reader accessibility." | `human` | `test/source-rules.test.js` P4-A1 checks the wiring - skip link, `lang`, one `h1`, focus moving to the results heading, no removed focus ring. A **human** must still drive the page with a keyboard and a screen reader; the test cannot hear anything |
| P4-A2 | §8: "Plain-language explanations." | `human` | `test/source-rules.test.js` P4-A2 is a floor only - no business jargon in the visible copy. Plain language is a **human** judgement; read it aloud, and ask someone who is not on the team |
| P4-A3 | §8: "Clear navigation and readable layouts." | `human` | `test/source-rules.test.js` P4-A3 checks heading levels do not skip. Whether the layout reads clearly is a **human** call on a real screen |
| P4-A4 | §8: "Mobile-friendly design." | `mvp` | `test/source-rules.test.js` P4-A4 - viewport meta, a narrow-screen rule, no fixed pixel layout widths, and a 44px minimum on touch targets |
| P4-A5 | §8: "Accessible forms and controls." | `mvp` | `test/source-rules.test.js` P4-A5 - every control labelled by `for` or by its wrapping label, every fieldset with a legend, every `aria-labelledby` and `aria-describedby` resolving to a real id, and errors landing in a focusable `role="alert"` |
| P4-A6 | §8: "No unnecessary time limits." | `mvp` | `test/source-rules.test.js` P4-A6 - no `setTimeout`, `setInterval`, `requestAnimationFrame` or meta refresh anywhere in the build. There is no clock, so there is nothing to impose a limit |
| P4-A7 | §8: "Avoid disability-based assumptions or stereotypes." | `mvp` | `test/source-rules.test.js` P4-A7 - an eighteen-phrase deny list over every file a user reads. Reinforced by P4-V1 and P4-V6: with no disability data in the system, there is nothing for copy to make an assumption from |

## §9 Success criteria

| ID | ERI's criterion (§9) | Disposition | What proves it |
| --- | --- | --- | --- |
| P4-S1 | §9: "An employer can complete a sample business needs assessment." | `mvp` | `test/conformance.test.js` P4-S1 - all six of ERI's MVP steps walked end to end in one session, ending at a plan, with the guards still clean |
| P4-S2 | §9: "The tool identifies at least three plausible workplace tasks connected to the fictional candidate's skills." | `mvp` | `test/match.test.js` P4-S2 - ERI's retail demonstration produces at least three distinct task shapes; the assertion prints them when it fails |
| P4-S3 | §9: "Suggested tasks reflect actual employer needs, not assumptions about disability." | `mvp` | `test/match.test.js` P4-S3 and `test/guards.test.js` P4-S3 - every suggestion cites a verbatim span of the employer's own sentence and a skill the candidate shared; a need the vocabulary does not recognise yields nothing rather than a guess; a tampered citation is refused |
| P4-S4 | §9: "The tool explains the reasoning behind each suggestion." | `mvp` | `test/match.test.js` P4-S4 - the explanation is a fixed template over two quotes, and it must literally contain both or the suggestion is dropped and the drop reported |
| P4-S5 | §9: "The employer can generate a simple next-steps plan." | `mvp` | `test/plan.test.js` P4-S5 - the first step hands control back to the employer, a step shares the draft with the candidate by name, a step brings an employment specialist in, and the questions are written for three people to answer together |
| P4-S6 | §9: "The product directs users to trusted accommodation and disability employment resources." | `mvp` | `test/plan.test.js` P4-S6 - the plan carries at least three resources and every one is a real pointer with a URL or a phone number |

## §10 Privacy and ethical requirements

**These seven are the deliverable.** Each `forbidden` row is tested twice: a
positive control that must trip the guard, and the real output that must not.
A guard only ever shown passing has not been shown to work.

| ID | ERI's requirement (§10) | Disposition | What proves it |
| --- | --- | --- | --- |
| P4-V1 | §10: "Do not require a candidate to disclose a disability or diagnosis." | `forbidden` | `test/guards.test.js` P4-V1 and `test/match.test.js` P4-V1 - a scanner over `web/index.html` finds no disability-shaped form control, label or legend, and manual entry throws on any such field. The scanner is proved live against a planted control first. Not hidden, not optional: absent |
| P4-V2 | §10: "Obtain permission before sharing candidate portfolio information." | `mvp` | `test/match.test.js` P4-V2 - every profile records who approved sharing, what they approved and when, and `loadCandidate()` throws when consent is missing or not approved. Proved by tampering, not by inspection |
| P4-V3 | §10: "Do not automatically rank candidates based on disability." | `forbidden` | `test/guards.test.js` P4-V3 and `test/match.test.js` P4-V3 - nothing is ranked on anything. A deep walk of the output finds no score, rank, percentage, fraction or stray number; order is the employer's entry order and the guard catches a reorder; shuffling the candidate's skills does not move anything; preference notes carry one of two words and no digits; passing a list of candidates throws |
| P4-V4 | §10: "Do not make automated hiring or accommodation decisions." | `forbidden` | `test/guards.test.js` P4-V4 and `test/plan.test.js` P4-V4 - a decision-language guard catches recommend, approve, reject, deny and "not a good fit", and the real output is clean. Every output states that it decides nothing, and the plan leads with that notice |
| P4-V5 | §10: "Protect confidential employee information." | `mvp` | `test/source-rules.test.js` P4-V5 - no `fetch`, XHR, WebSocket, beacon, form action, third-party script or remote media anywhere, so there is nothing to leak. Paired with P4-X5: nothing is stored either |
| P4-V6 | §10: "Do not suggest an accommodation based solely on a disability label." | `forbidden` | `test/guards.test.js` P4-V6 - **unreachable by construction.** There is no disability label anywhere in the data model to key an accommodation off: no profile carries a disability key or names a diagnosis, no task is defined in terms of a person's condition, and no disability-shaped key reaches the output. The scanners are proved against planted labels first. Reinforced by P4-F5: no accommodation is generated at all |
| P4-V7 | §10: "Refer complex legal questions to qualified professionals and authoritative resources." | `mvp` | `test/guards.test.js` P4-V7 and `test/plan.test.js` P4-V7 - an advice-prose guard catches "you must", "it is illegal", "the law requires", and every output is clean of them. The referral block says the tool does not answer legal questions and names JAN, the EEOC and DVR. Matches PRD AC-P4.9 |

## §11 Out of scope for the hackathon

| ID | ERI's exclusion (§11) | Disposition | What proves it |
| --- | --- | --- | --- |
| P4-X1 | §11: "Full applicant tracking systems." | `forbidden` | `test/guards.test.js` P4-X1 - the matching module exports nothing shaped like compare, rank, shortlist, screen or applicants, and nothing is persisted (P4-X5) |
| P4-X2 | §11: "Automatic employment decisions." | `forbidden` | `test/guards.test.js` P4-X2 - same guard as P4-V4; the decision-language check runs over suggestions and plan on every render, in the browser, fail-closed |
| P4-X3 | §11: "Comprehensive ADA compliance management." | `forbidden` | `test/conformance.test.js` P4-X3 - no copy anywhere claims compliance, manages it, or says anything "meets ADA". Legal questions route out via P4-V7 |
| P4-X4 | §11: "Integration with payroll or HR platforms." | `forbidden` | `test/source-rules.test.js` P4-X4 - no dependencies, no build step, no network calls. There is no integration surface to integrate with |
| P4-X5 | §11: "Production storage of medical or disability information." | `forbidden` | `test/source-rules.test.js` P4-X5 - no localStorage, sessionStorage, cookie or IndexedDB anywhere. Doubly out of reach: per P4-V1 and P4-V6 there is no such information in the system to store |
| P4-X6 | §11: "Full employer-candidate matchmaking across multiple organizations." | `forbidden` | `test/conformance.test.js` P4-X6 - one industry and one candidate per session, no plural entry point, and the output holds a single candidate rather than a list to order |

---

## Coverage summary

| Disposition | Rows | IDs |
| --- | --- | --- |
| `mvp` | 23 | F1 F2 F3 F7 M1 M2 M3 M4 M5 M6 A4 A5 A6 A7 S1 S2 S3 S4 S5 S6 V2 V5 V7 |
| `forbidden` | 10 | V1 V3 V4 V6 X1 X2 X3 X4 X5 X6 |
| `stretch` | 3 | F4 F5 F6 |
| `human` | 3 | A1 A2 A3 |

33 of the 39 rows carry a test. **This summary is hand-written and can go
stale** - `test/conformance.test.js` verifies the tables above (39 unique rows,
the right count per group, a valid disposition on each, an ERI section cited on
each, a real test behind every `mvp` and `forbidden` row) but it does not
recompute these four totals. If you change a disposition, change this table by
hand and re-run the suite.

## What is NOT covered, stated plainly

- **Screen-reader behaviour (P4-A1).** No automated check in this build listens
  to anything. It has not been driven with NVDA, VoiceOver or Orca.
- **Plain language (P4-A2) and layout clarity (P4-A3).** Judged by a person or
  not judged at all.
- **Whether the matching is any good.** The tests prove a suggestion can always
  name where it came from. They do not prove a suggestion is *useful* - that
  needs a real employer at the event, which is the PRD's own kill condition.
- **The three stretch features (F4, F5, F6).** Unbuilt, and the two dangerous
  ones should stay unbuilt until someone with employment-law standing signs off
  on quoting rather than generating.
