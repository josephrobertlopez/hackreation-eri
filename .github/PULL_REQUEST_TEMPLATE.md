<!--
Several teams will attempt the same project. Attempts are COMPARED, not merged
against each other, so this template is what makes two attempts at P2
comparable: same project line, same claimed IDs, same checks, same protocol.

Keep every heading and every checkbox line. CI reads some of them.
Do not delete a box you did not do -- leave it unticked and say why.
-->

## 1. What this attempt is

**Project:** P?
**Backlog IDs claimed:** P?-F?, P?-US?
**Team or attempt name:**
**Branch:** `attempt/<team>/p?-<short-thing>`

One or two sentences, in plain words, on what a person can now do:

<!-- e.g. "A job coach can build a three-step task guide with a picture per
step, and an employee can work through it one step at a time on a phone." -->

Two kinds of ID belong on that line, and both are checked:

- **Backlog** — `P2-F4`, `P2-US2`, from
  [docs/eri-backlog.md](../docs/eri-backlog.md). Things ERI asked to be built.
  This is what your attempt is compared on, so claim what you actually
  finished, not what you started.
- **Frozen spec** — `P2-M3`, `P2-A4`, `P2-S1`, `P2-X6`, from your project's
  `spec/acceptance.md`. MVP steps, accessibility requirements, success
  criteria, prohibitions. Cite the ones this change answers; a reviewer
  checks you against them rather than you claiming them.

CI fails this PR if an ID is in neither place, if the IDs span two projects, or
if the declared project is not the folder the diff touches — see
[CONTRIBUTING.md](../CONTRIBUTING.md) for the rules.

## 2. Acceptance criteria

Per claimed ID: the acceptance criterion it satisfies, and the test that proves
it. One row per ID. `AC-P?.?` IDs come from your PRD in `wiki/prds/`.

| Backlog ID | AC | Proven by (test name / file) | Status |
| --- | --- | --- | --- |
| `P?-F?` | `AC-P?.?` | `test/...` | done / partial |

- [ ] Every claimed ID above has a passing test, named so a reviewer can find it
- [ ] Anything partial is marked partial here, not claimed as done
- [ ] Nothing in ERI's "out of scope for the hackathon" list was built

## 3. Accessibility self-check

ERI's own accessibility requirements, from the problem statements. These are
ERI's words, not an external standard, and not a compliance claim.

- [ ] **Keyboard:** the whole task completes with keyboard only, and focus is
      always visible
- [ ] **Screen reader:** one pass with a screen reader, and the task completed
      (say which one below)
- [ ] **Labels and text alternatives:** every control is named; images have
      text alternatives; audio or video has a caption or transcript
- [ ] **Contrast:** text is readable against its background, including in any
      error or success state
- [ ] **320px:** the task completes at 320px wide without horizontal scrolling
- [ ] **No time limit:** nothing expires, nothing requires a fast response,
      instructions can be repeated
- [ ] Automated accessibility checks pass (`npm run test:a11y`)

Screen reader used, and what was awkward:

<!-- e.g. "NVDA on Firefox. The step counter is announced twice." Write the
awkward thing even if you did not fix it -- that is the useful half. -->

## 4. Human protocol results

No test produces these. Report what happened, including when it went badly.

- [ ] **Protocol:** someone who did not write the code attempted the task
- [ ] **Persona:** tried as one of the profiles in `agents/`, or with a real person
- [ ] **Plain language:** a second person read the on-screen words and
      understood them without help
- [ ] **Unassisted:** the task was completed without the author stepping in

| What was measured | ERI's bar | What happened |
| --- | --- | --- |
| <!-- e.g. skills an employer could identify --> | <!-- e.g. at least three --> | |
| <!-- e.g. interactions to send a help request --> | <!-- e.g. three or fewer --> | |
| Time to complete | | |

Where it failed, confused, or needed help:

<!-- Honest answers here are worth more than ticked boxes. An attempt that
says "two of three testers could not find the Next button" is more useful to
ERI than one that says nothing. -->

## 5. ERI's prohibitions — author's declaration

ERI wrote these constraints. Ticking them is a statement of fact about this
diff that only the author can make.

- [ ] No field, question or required step asks for a **disability or diagnosis**,
      anywhere in this attempt
- [ ] Nothing in this attempt **scores or ranks** candidates, by any measure
- [ ] Nothing makes an **automated hiring or accommodation** decision; a person
      decides, and the tool only informs
- [ ] No accommodation is suggested from a disability label alone
- [ ] What a person shares is their choice, and shown to them before it is shared
- [ ] Nothing here lets an employer measure a worker without their knowledge
- [ ] Complex legal questions point at qualified people and authoritative
      resources, not at an answer from this tool

## 6. Data, dependencies, and scope

- [ ] Synthetic or sample data only — no real person's information, no secrets
- [ ] No network call the PRD does not allow
- [ ] New dependencies are listed here with one line on why each is needed
- [ ] Work is inside this project's folder; nothing imported from another project

New dependencies and why:

## 7. For the reviewer

- [ ] Run it: the project README says how, and it took under 10 minutes
- [ ] CI is green: **Conformance (changed projects)**, **Attempt declaration
      (backlog IDs)**, and **Repo guardrails**
- [ ] The claimed IDs match what the diff actually does
- [ ] Section 3 and section 4 were read, not just counted

Reviewers: comparing this against another attempt at the same project? Compare
claimed IDs, section 4, and what the authors admitted went wrong. Do not merge
one attempt into another — see
[CONTRIBUTING.md](../CONTRIBUTING.md).

## 8. Demo notes and screenshots
