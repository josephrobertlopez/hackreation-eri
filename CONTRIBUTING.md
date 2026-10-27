# Contributing: many attempts, one problem each

This repo expects **several teams to attempt the same project**, each as its
own pull request, all open at the same time. Nothing here assumes a team owns a
project, or that there is one right answer, or that the attempts get merged
into one thing at the end. They are **compared**.

Read this once before you branch. It is short, and it is the difference between
an attempt a reviewer can judge and an attempt they have to reverse-engineer.

## 1. What you are building against

| | |
| --- | --- |
| **The source of truth** | [docs/eri-problem-statements.md](docs/eri-problem-statements.md) — ERI's four projects in ERI's own words |
| **The backlog, with IDs** | [docs/eri-backlog.md](docs/eri-backlog.md) — every core feature and user story, each with an ID like `P2-F4` |
| **The frozen spec** | `challenges/p<n>-*/spec/acceptance.md` — one row per requirement ERI wrote, including the ones that are not features: MVP steps (`P2-M3`), accessibility requirements (`P2-A4`), success criteria (`P2-S1`), prohibitions (`P2-X6`) |
| **Your PRD** | `wiki/prds/p1…p4`, which turns ERI's words into acceptance criteria (`AC-P2.3`) |
| **Your folder** | `challenges/p<n>-<name>/` |

**Two families of ID, and the difference matters.** Backlog IDs (`F`, `US`) are
things somebody *builds*, so they are what an attempt claims and what two
attempts at the same problem are compared on. Frozen-spec IDs (`M`, `A`, `S`,
`X`, and any others a project defines) are what an attempt is *checked
against*. Cite both in your pull request — "this is the fix for `P2-A4`" is
exactly what a reviewer wants to read. A fix or a test that cites only spec IDs
and claims no feature is a perfectly good pull request; it just is not an
attempt competing on coverage.

The backlog is **generated** from ERI's document by
`python3 tools/gen_backlog.py`. Don't edit it. If a line in it looks wrong,
ERI's document wins and the generator has a bug — file it (section 8).

Where a PRD and ERI's problem statements disagree, ERI wins. That is not a
formality: the PRDs were written from ERI's document in a hurry, and a
contradiction is a real defect, not a difference of emphasis.

## 2. Pick a project and claim backlog IDs

1. Open an issue with your project's form: **New issue → `P2 attempt — My
   Workday Assistant`** (one form per project). The form lists every one of
   ERI's features and user stories as a checkbox, so claiming is clicking, not
   typing IDs from memory.
2. Tick what you intend to **finish**. Two features finished beats six
   half-built, both for ERI and for how your attempt reads next to the others.

**A claim is not a reservation.** Another team may claim `P2-F4` ten minutes
later and that is fine — that is the whole model. Nobody gets exclusive use of
a requirement. What a claim buys you is a reviewer who knows, before they open
your diff, what you were trying to do.

## 3. Branch, commit

Branch from `main`:

```
attempt/<team>/p<n>-<short-thing>
```

e.g. `attempt/bus-buddies/p2-step-navigation`. The `attempt/` prefix matters:
four branches may be working the same project at once, and `team/…/steps` from
two teams reads as the same work.

[Conventional Commits](https://www.conventionalcommits.org/):
`feat(p2): one step at a time with Back and Next`,
`test(p2): cover AC-P2.4`, `fix(p3): announce send confirmation`.

Commit small, push at least every hour. An unpushed branch is work nobody can
see, compare, or recover when your laptop dies at 2pm.

## 4. Test first

| Level | Tool | Where | Naming |
| --- | --- | --- | --- |
| Unit | `node:test` (JS) or PHPUnit (PHP) | `test/*.test.js`, `tests/Unit/*Test.php` | the test name cites the AC ID |
| Behaviour | Cucumber.js or Behat | `features/*.feature` | one scenario per AC, tagged `@AC-P2.4` |
| Accessibility + browser | Playwright + axe | `e2e/*.test.mjs` | zero axe violations is the floor, not the bar |

Run exactly what CI runs:

```bash
bash tools/run_project_suite.sh challenges/p2-my-workday-assistant
```

That runs `npm test`, `npm run bdd` and `npm run test:a11y`. All three are
**required to exist**. Deleting a script is not a way to make a suite pass —
the runner goes red on a missing script, on purpose, because "the accessibility
suite is gone" and "the accessibility suite passed" must never look the same.

The loop: failing scenario for the AC → smallest change that passes it →
refactor → commit.

## 5. One attempt per pull request

Open the PR into `main` using
[the template](.github/PULL_REQUEST_TEMPLATE.md), and fill in these two lines
literally — CI reads them:

```
**Project:** P2
**Backlog IDs claimed:** P2-F4, P2-F5, P2-US2
```

CI fails your PR if:

- a cited ID is in neither the backlog nor any project's frozen spec (a typo'd
  ID claims nothing);
- the cited IDs span two projects;
- you declare a project and the diff touches two project folders;
- the declared project is not the folder the diff touches;
- one of ERI's three prohibitions is unticked in section 5 of the template.

**Not an attempt?** A shared fix across two projects — the same focus trap, one
corrected fixture — is a normal pull request. Leave the `**Project:**` line out
and it is read as a cross-project change: every touched project's suite still
runs, and no attempt is claimed. Declare a project only when you are claiming
one.

One project per PR. Attempting two projects means two PRs, so each is judged on
its own. **Don't merge your own PR.** Leave it open: judges and ERI review it
there, and a merged attempt stops being comparable with the ones beside it.

Open it by 3:00pm so CI finishes before demos.

## 6. How attempts at the same problem are compared

Four PRs may claim `P2-F4`. None is merged into the others, and none blocks the
others.

**Never base your branch on another attempt's branch.** Two reasons, and the
first has bitten this repo before:

1. GitHub **auto-closes** a PR the moment its base branch is deleted. Squash
   merges delete the source branch, so a PR stacked on another PR dies when the
   first one lands — and a closed PR cannot be retargeted.
2. It makes two attempts into one, which destroys the thing the comparison
   needs: an independent second answer to the same question.

Want something another team built? **Copy it into your folder and say so in
your PR** — which team, which file, what you changed. That is a normal and good
thing to do; silently vendoring it is not.

What a reviewer compares, in this order:

1. **Claimed vs landed.** Which IDs were claimed, which have passing tests
   named after them. An attempt claiming three IDs and landing three beats one
   claiming eight and landing three.
2. **Accessibility.** ERI's accessibility requirements are product
   requirements, not polish. An attempt that fails keyboard-only is not a
   faster attempt; it is a different and smaller product.
3. **Section 4 of the PR — the human protocol.** What happened when a person
   who did not write it tried to use it. No test produces this, and it is
   usually the line that decides.
4. **What the authors admitted went wrong.** "Two of three testers could not
   find Next" is worth more to ERI than a page of ticked boxes, and reviewers
   here are told to read it that way.

Reviewing someone else's attempt: tick the PR template's boxes against what you
can actually see, run it, and file issues rather than rewriting their code.
Non-coders review too, and the keyboard and plain-language passes are the most
valuable review in the room.

## 7. Definition of Done — per claimed ID

An attempt is done for `P2-F4` when **all** of these are true. Shipping partial
work is fine; calling it done when it is partial is not.

- [ ] `P2-F4` maps to at least one acceptance criterion (`AC-P2.x`) in your PRD
- [ ] A **named** test proves that AC, and a reviewer can find it from the PR
      table without searching
- [ ] A BDD scenario is tagged with the AC ID
- [ ] The keyboard-only path through the feature completes
- [ ] Automated accessibility checks pass (`npm run test:a11y`)
- [ ] Controls are named, images have text alternatives, audio or video has a
      caption or transcript
- [ ] Nothing in the feature expires or needs a fast response
- [ ] It completes at 320px wide
- [ ] An alternative to typing exists wherever the feature asks for input
- [ ] Synthetic or sample data only; no secrets; no network call the PRD does
      not allow
- [ ] ERI's prohibitions hold: no disability or diagnosis field, no scoring or
      ranking of candidates, no automated hiring or accommodation decision
- [ ] Nothing in ERI's "out of scope for the hackathon" list was built
- [ ] Your project README says how to run it in under 10 minutes

And for the attempt as a whole:

- [ ] **Conformance (changed projects)** is green
- [ ] **Attempt declaration (backlog IDs)** is green
- [ ] **Repo guardrails** is green
- [ ] Section 4 of the PR reports a real human attempt, including what failed

A note on wording: these come from ERI's own accessibility requirements, which
never name an external standard. Say "we did the keyboard pass and the screen
reader pass", not "this is compliant" — the second is a claim neither you nor
anyone else in the room measured.

## 8. The spec is frozen, and it has bugs

The problem statements are frozen for the event. The PRDs, the backlog, the
conformance tests and the repo gates are not sacred, and teams always find
defects in them.

File one: **New issue → `Defect in the spec or a conformance test`**. The worst
kind, and the one worth hunting, is a **test that passes something it should
fail** — a gate that cannot go red has green-lit every attempt it ever saw.

Don't work around a spec defect silently inside your own folder. Four teams
quietly working around the same ambiguity in four different ways is how a
comparison becomes meaningless.

## 9. Repo rules

- Work inside your project folder. **Don't import from another project's
  folder** — projects are decoupled on purpose.
- Don't hand-edit `data/`. Change the generator and regenerate.
- Don't edit generated files: `docs/eri-backlog.md`, `docs/eri-backlog.json`,
  `.github/ISSUE_TEMPLATE/*.yml`, `llms-full.txt`. Each has a generator in
  `tools/` and a gate that notices.
- Adding a dependency: say in the PR what it is and why. One line is enough.
- No real person's data, ever. Synthetic only.

Check what your machine can check before you push:

```bash
bash tools/check.sh                      # every smoke test
python3 tools/check_github_yaml.py       # workflows and issue forms parse
python3 tools/gen_backlog.py --check     # the backlog matches ERI's document
bash tools/t/all.sh                      # the gates can still go red
```

That last one is the test suite for the checks in this file — the backlog
generator, the change-aware router, the declaration check, the aggregator and
the project runner. If you change one of them, run it. It has already caught a
real bug: a regex that let an empty `**Project:**` line absorb the next line,
so a PR declaring no project read as declaring one.

## 10. Running this as your own event

This repo is meant to be used as a GitHub template. A generated copy carries
the files and almost nothing else — see
[.github/TEMPLATE-SETUP.md](.github/TEMPLATE-SETUP.md) for what you have to set
by hand (branch protection, labels, and the rest), and
`python3 tools/init_template.py` for stripping this event's specifics out.

## Show your work

Link your PR, your tests and your green CI. Describe it as a hackathon
prototype built on synthetic data — not an ERI product, and not ERI client
work. ERI reviews the attempts and decides what, if anything, to take further.
