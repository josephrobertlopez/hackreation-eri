# Refinement log

A record of the debate rounds used to refine the attendee materials.

**Simulated personas; not the real people's views.** Joey, Theresa, Devon, Priya, Lena, Sam and Jordan below are simulated in a workflow. Nothing here is a quote from a real person.

## Round 1: ERI story, rules, start

### Debate summary
- Joey: slide 2 read like a grant report (Ticket to Work EN, DVR vendor). The start slide was slide 10, after three challenge slides.
- Theresa: agreed on jargon. The closing line promised to publish a winner on ERI's site, which ERI never committed to, and challenge 01 can't be public. Rule 3 dropped "the client must consent in real use".
- Joey and Theresa settled on: ERI reviews and decides, and a volunteer can help install one pick.
- Devon and Priya: Devon wanted the deck to show a real codebase (tests, CI, PRs). "Push to teams/" contradicted CONTRIBUTING.md. Priya didn't want process jargon on slide 1. Compromise: one test command on the start slide, and "open a PR, a mentor will help" on the demo slide.
- Devon wanted the DVR stats cut. Joey agreed, since they live in `wiki/knowledge/wisconsin-landscape/dvr-structure-and-process.md`.
- Lena and Sam: the challenge table says nothing to non-coders. Add a plain language and accessibility testing role.
- Jordan, backed by Theresa: "Nothing to install" rests on a paper slip and an untested code-server. Offer another format and a fallback. The blank-cell schedule table and arrows read badly with a screen reader.
- Schedule: the deck said kickoff, then team formation. The public Meetup page says team formation at 8:30, then kickoff at 9:00. Converged on cutting the table and keeping one public demo-time line.
- Converged: tell the ERI story in 2 slides, put a short "why" on each rule, move the start slide up, cut Today, Expo and the stats, fix the PR line and the closing promise. Result: 14 slides.

### Changes applied
- `deck/attendee-kickoff.md`: rewrote "Who is ERI?" (plain words, the benefits fear, WIPA explained).
- `deck/attendee-kickoff.md`: replaced "Why this matters" with "How ERI gets paid, and who keeps your code". DVR stats removed.
- `deck/attendee-kickoff.md`: added a short "why" to the 6 rules. Rule 3 now says the client must agree first in real use.
- `deck/attendee-kickoff.md`: moved the start slide to right after "Pick one challenge" and rewrote it as "Start in 2 minutes", with a test step and a screen reader and slip fallback.
- `deck/attendee-kickoff.md`: deleted the "Today" slide. Added the 4:00 demo-time line to "Your 3-minute demo".
- `deck/attendee-kickoff.md`: changed the closing line to "ERI reviews every project and decides what to adopt. A volunteer can help install one pick."
- `deck/attendee-kickoff.md`: replaced "Push to teams/" with "Open a pull request before demos..." and the mentor line.
- `deck/attendee-kickoff.md`: 01 "ERI gets" is now "A prototype ERI reviews later". Added the tests mention and the non-coder role line under the table.
- `deck/attendee-kickoff.md` (nice): removed Expo from the facts bullet, shortened the personas bullet, and replaced the arrows on the 01, 02 and 03 slides with words.
- `wiki/ESSENTIALS.md`: added "ERI in 30 seconds" and a short why on rules 1, 4 and 5.
- `README.md`: step 1 points to ESSENTIALS only. The hackreation.md link moved to Day-of. Step 3 now starts from the challenge hello world, and the starters are optional.

Checks: `tools/check_links.py` links ok (137 files). `tools/check.sh` all smoke tests passed. Deck: 14 slides.

### Changes skipped
- None.

### Unresolved questions
- Order of the day: the public Meetup page puts team formation (8:30) before kickoff (9:00), but the old deck put kickoff first. Only the organizers can say whether teams form before hearing the challenges.
- Has ERI leadership approved the MIT license and an ERI-owned GitHub org? hackathon-value-plan.md marks this "(verify)", and the new "Code is MIT licensed" slide line depends on it.
- Will ERI host a 02 or 03 plugin on eri-wi.org at all? Who at ERI owns triage, and when? Joey's 1-2 evenings only help if ERI's web team agrees to install.
- Does code-server work with a screen reader (NVDA, VoiceOver) on the event's setup? Can team passwords go out digitally as well as on paper slips? Someone must test this before Oct 31.
- Is ERI comfortable with "about 29 staff" and "margins are thin" on a public slide, even though both come from its public staff page and 990?
- Will an ERI staffer be present as liaison or judge? Both the deck and the rubric ("an ERI staffer says we'd use that") assume one.

## Round 2: ownership, data, and non-commitment

**Simulated personas; not the real people's views.**

### Debate summary
- Theresa opened on ownership. The deck said 02 and 03 give ERI "A WordPress plugin for its site", and PRD 02 said "ERI can add it to a page today" and "then it goes live". Her web team decides what goes on a multisite.
- Joey agreed the wording overclaimed but didn't want it watered down, or Devon checks out. They converged on "could ship" language plus one plain line on what ERI is not committing to.
- Theresa's sharpest catch: PRD 01's Monday owner line had a volunteer walking finance through "a de-identified export". That is real client data leaving ERI, which breaks the public-or-synthetic-only rule. Joey conceded. The follow-up uses synthetic data, and ERI maps its own exports in house. PRD 01 also named an internal staff member, which is now removed.
- Theresa and Jordan, on 03's "PDF with ERI branding": attendees should not make ERI-branded assets, and PDFs are often inaccessible. Sam wanted a deliverable employers can take away. Compromise: an unbranded, accessible HTML checklist page.
- Theresa flagged the 03 lead form. It stores employer contact data, which contradicts "nothing stored", and someone would have to own the inbox and privacy notice. Lena liked it as UX work. Settled on a mailto or a link to ERI's contact page, with nothing stored.
- Devon wanted the "ERI can adopt it" rubric row to say what adoptable means. Theresa supplied the criteria from hackreation.md and hackathon-value-plan.md. Priya kept it to one line.
- Sam kept 01's WordPress admin page stretch goal. Theresa objected to billing data on the public multisite. Agreed: test site and synthetic data only.
- Theresa on 03's optional LLM rewrite: a hosted plugin calling an AI API means keys, cost and data leaving the browser. Joey wants AI at the event. Converged: allowed in the demo, not part of the plugin ERI would host.
- Jordan wanted the closing slide to state the non-commitment in plain text. Joey kept his offer to help install one pick, now with ERI's web team, on a test site first. Devon wanted one line, Priya wanted "review" explained. Final: three short lines.
- Net: no new slides. Deck stays at 14 slides.

### Changes applied
- `deck/attendee-kickoff.md`: "Pick one challenge" 02 and 03 "ERI gets" now read "A WordPress plugin ERI can review".
- `deck/attendee-kickoff.md`: closing slide now has three lines: ERI reviews and decides; ERI is not promising to adopt, host or support any project; if ERI picks one, a volunteer helps its web team test it on a test site first. "Let's build." kept.
- `deck/attendee-kickoff.md`: rubric row now reads "ERI could host it (WordPress or static, stores nothing, no paid services, a README that runs)".
- `deck/attendee-kickoff.md` (consistency): the 03 slide "You add" line now says a "have ERI review my post" link, not a form, to match the PRD change.
- `wiki/prds/01-funding-gap-finder.md`: Monday owner starts "If ERI continues:" and the follow-up uses synthetic data only, with ERI mapping its own exports in house. Internal staff name replaced with "ERI finance staff ... in house". WordPress admin page stretch goal now says test site and synthetic data only.
- `wiki/prds/02-job-fit-checker.md`: demo line, adversarial debate line and Monday owner reworded so ERI tests, reviews and decides whether and when it goes live.
- `wiki/prds/03-job-post-checker.md`: stretch goals now an unbranded, accessible HTML checklist page and a "have ERI review my post" link (nothing stored); LLM rewrite marked demo only, not in the hosted plugin. Monday owner reworded the same way as 02.
- `challenges/03-job-post-checker/README.md`: same three stretch-goal changes as PRD 03.
- `challenges/01-funding-gap-finder/README.md`: WordPress admin page item now says test site and synthetic data only.
- `challenges/02-job-fit-checker/README.md`: "can safely host it" is now "makes it easier for ERI's web team to review and host".
- `wiki/prds/README.md`: 03 "trivial to host" is now "small to host"; 02 and 03 "Ships how" now say "ERI can review for its site".
- `README.md` (nice): last line adds "Not an official ERI product: ERI reviews projects and decides what, if anything, to adopt."

Checks: `tools/check_links.py` links ok (138 files). `tools/check.sh` all smoke tests passed. Deck: 14 slides.

### Changes skipped
- None from the change requests.
- Out of scope, noted only: `wiki/prds/cut-list.md` still allows "synthetic or de-identified data only" for the 01 pivot approach. That conflicts with this round's ruling and should be fixed next round.

### Unresolved questions
- Has ERI leadership approved the MIT license and an ERI-owned GitHub org? hackathon-value-plan.md still marks this "(verify)", and the deck states "Code is MIT licensed".
- Does ERI want "Talk to ERI Business Services" or "Talk to ERI" links, and the ERI name, inside volunteer-built tools at all before its own brand and web review?
- Which ERI contact page or email should a "Have ERI review your post" link point to, and who at ERI would own those requests?
- Will ERI's benefits staff review the 02 estimate copy at all? The PRD's kill switch says to fall back to a checklist if ERI says any online estimate is too risky to publish.
- Does ERI's web team have a test or staging site on its WordPress multisite where a volunteer could install a pick, or would ERI want a separate sandbox?
- Is Joey's 1-2 evenings of follow-up something ERI wants? And for 01, will finance staff map their own exports in house, or should 01 stay a schema recommendation only?
- Should the optional AI features (03 LLM rewrite, 01 flag explainer) be allowed in demos at all, given that ERI does not connect AI coding agents to its products?

## Round 3: Accessible onboarding, roles, portfolio

**Simulated personas; not the real people's views.**

### Debate summary
- Jordan said the Start slide's "Local setup or Codespaces may work better" pushed the work onto screen reader users. Nothing in the repo confirms the browser IDE works with a screen reader. Joey agreed to an honest line, limited to screen reader users, with the laptop path kept for everyone.
- Jordan and Theresa flagged the middle dot character. Screen readers read it as "dot" or skip it. All agreed to replace it with commas, colons and semicolons.
- Lena wanted the non-coder role named, using the roles in attendees.md, and a way to contribute through PRs. Jordan and Theresa said the role must not go to a teammate with a disability by default. That guidance goes in team formation (hackreation.md), not the deck.
- Devon wanted cuts and a realistic timebox; Priya wanted a rule for asking for help. Result: "Pick one 'You add' item. Finish it with a test, then pick the next" and "Stuck 15 minutes? Ask."
- Sam asked where the WordPress work is. One parenthetical: 02 and 03 are plugins.
- Priya, Sam and Joey wanted a portfolio piece. Theresa objected to wording that implies ERI endorsement. Agreed: a Hackreation prototype on synthetic data, not an ERI product.
- One title-slide line points to the plain-text slides and schedule. No new slides; the deck stays at 14.

### Changes applied
- `deck/attendee-kickoff.md` (must): Start slide now says the browser IDE isn't tested with a screen reader yet, points to laptop or Codespaces, and adds the 15-minute help rule and ERI liaison line. Step 2 notes 02 and 03 are plugins.
- `deck/attendee-kickoff.md` (must): every middle dot replaced (title, 01/02/03 headings, "You add" lists, awards line).
- `deck/attendee-kickoff.md` (must): "Pick one challenge" now defines PRD, sets the one-item-at-a-time rule, and names the no-code role.
- `deck/attendee-kickoff.md` (should): demo slide PR line rewritten; adds "That PR is your portfolio piece. Call it a Hackreation prototype, not an ERI product."
- `deck/attendee-kickoff.md` (should): title slide points to the plain-text deck and schedule.
- `deck/attendee-kickoff.md` (nice): accessibility bar adds "or NVDA on Windows" (already in `wiki/domain/accessibility.md`).
- `wiki/event/hackreation.md` (should): new "Forming a team (8:30)" section; Rules item 4 adds the 15-minute help rule and ERI liaison scope.
- `CONTRIBUTING.md` (should): "Non-coders review too" bullet in Pull request; new "Show your work" section.
- `README.md` (should): Day-of hosting bullet adds the screen reader line.
- `README.md` and `wiki/event/hackreation.md` (nice): middle dots replaced in the header lines, Challenges table and awards line.

Checks: `tools/check_links.py` links ok (138 files). `tools/check.sh` all smoke tests passed. Deck: 14 slides.

### Changes skipped
- None.

### Unresolved questions
- Has anyone tested the hosted code-server IDE with NVDA or VoiceOver before Oct 31? If it passes, the deck and README lines can say so instead of "isn't tested yet".
- Is the Penrod venue (2nd floor) step-free, with an elevator? Will there be captions, a microphone, or an interpreter at the kickoff and the demos? Only the organizers can confirm, and attendees with disabilities need to know in advance.
- Will the team slips (URL and password) come in an accessible format, such as by email or in large print, as well as on paper?
- How many mentors will there be, and who is the ERI liaison on the day? Will ERI staff be in the room to answer questions about benefits and billing?
- Is ERI comfortable with attendees naming ERI in portfolios or on LinkedIn (for example, "a Hackreation prototype for an ERI challenge")? Or should attendees leave the ERI name out entirely?
- Will the judging panel include someone who uses a screen reader daily, so the 25% accessibility score reflects real use?
- Is there a team size limit, and how will solo attendees or late arrivals be placed on teams?

## Round 4: CI paths, open PRs, on-ramps

> Simulated personas; not the real people's views.

### Debate summary
- Devon flagged a blocker: README step 4 and event rule 2 sent teams to `teams/<team>/`, but every challenge CI workflow only triggers on `challenges/<id>/**`. Joey agreed: build in the challenge folder on a team branch; `teams/` is only for teams that pick a starter.
- Joey and Theresa argued over merging. Squash-merging would make teams on one challenge fight over `main` and would look like ERI accepted the code. Agreed: leave PRs open for judges and ERI review.
- Priya said CONTRIBUTING read like homework; Devon defended issues and PRs as the real SWE experience. Compromise: keep the loop (branch, failing test, pass, PR), make issues and ADRs optional, cut the stale Jest/Expo row, and say why it helps (portfolio, interviews).
- Devon flagged scope traps (GTFS commute time, the 01 review workflow). Priya wanted a way to pick a small first item. Agreed: tag only the big ones.
- Jordan and Lena: the screen reader pass is required by the accessibility bar, so it can't sit in the 02 stretch menu.
- Devon found loose ACs: AC-02.6 "long commute" (code defaults to 45 minutes), AC-03.4 "most" vs "> 20", and "4 hours" in PRD 02 when the public schedule gives about 6 hours of hacking.
- Theresa challenged the Monday owners. PRD 01 named the ERI web team for a finance tool whose data never goes on public sites; PRD 03 should admit the web team may not take a second plugin ([value plan](../wiki/knowledge/org/hackathon-value-plan.md)). Joey accepted: an honest kill beats adopt-and-abandon.
- Sam and Priya wanted a one-line 10-minute on-ramp in each challenge README. Joey wanted a deck nudge to open the PR early, since Playwright CI takes minutes.

### Changes applied
- `README.md` (must): step 4 now says build in your challenge folder on a team branch; `teams/` only for starters; links CONTRIBUTING.
- `wiki/event/hackreation.md` (must): Rules item 2 now says work in your challenge folder on a team branch, so CI runs.
- `CONTRIBUTING.md` (must): "Don't merge. Leave your PR open: judges and ERI review it there." Repo-rules first bullet points to the challenge folder and team branch, `teams/` only for starters, challenges stay decoupled.
- `CONTRIBUTING.md` (should): new intro framing the loop as an interview story; issue and ADR bullets marked optional; Jest/Expo and `__tests__/` cut from the test table; middle dots replaced with "or".
- `wiki/prds/01-funding-gap-finder.md` (should): honest Monday owner (finance owns the rules, no code owner until ERI decides on data access); new kill condition (billing system already shows the gaps); review workflow tagged "(big)"; header middle dots replaced with commas.
- `wiki/prds/02-job-fit-checker.md` (should): AC-02.6 now "a commute over 45 minutes"; "in one day" instead of "in 4 hours"; GTFS tagged "(big: needs a data download)"; screen reader pass removed from stretch goals; header middle dots replaced.
- `wiki/prds/03-job-post-checker.md` (should): AC-03.4 now "more than 20 of the 60 sample postings"; kill condition adds the second-plugin capacity risk, citing the value plan; header middle dots replaced.
- `challenges/01`, `02`, `03` READMEs (should): "First 10 minutes" line under the code block; heading now "Your job (pick one; finish it with a test, then pick the next)"; 01 review workflow and 02 GTFS item tagged big; 02 adds "Every team: one screen reader pass (it counts in judging)."
- `deck/attendee-kickoff.md` (nice): demo slide says open your PR by 3:00, CI takes a few minutes, a mentor can help fix a red build. Consistent with the public schedule (hacking until 4:00 in `wiki/event/hackreation.md`).

Checks: `tools/check_links.py` links ok (138 files). `tools/check.sh` all smoke tests passed. Deck: 14 slides.

### Changes skipped
- None.

### Unresolved questions
- Do attendees get push access to the repo, or must they fork? "Branch from main" and CI on PRs from forks behave differently. Organizers need to decide and say so at check-in.
- Who, if anyone, merges PRs after the event, and into which repo (Mitobyte's or an ERI-owned GitHub org, as the value plan suggests)?
- `teams/README.md` (outside this round's scope) still tells teams to copy a starter into `teams/` and fill in a PRD template. It should be aligned with the challenge-folder workflow, or trimmed to the starter-only path.
- Is a 3:00 PR checkpoint acceptable to the organizers, given the schedule may change?
- Will ERI's benefits manager and Employment Services manager actually have time for the evening-2 copy reviews in PRDs 02 and 03? The Monday-owner lines depend on it.
- Does ERI's billing system already report the gaps PRD 01 targets? If so, 01 should be killed or reframed before teams pick it.

## Round 5: One command, one rubric

**Simulated personas; not the real people's views.**

### Debate summary

- Devon audited commands. The deck used raw `python3 -m http.server` for 02 and 03, while the READMEs say `npm start`. The Start slide promised `/proxy/8000/`, but 01 serves on 8080. Agreed: one command per challenge, everywhere.
- Theresa found two rubrics (deck vs hackathon.md). Only one said "proposed", and "stores nothing" doesn't fit 01's ledger.csv. Agreed: one wording, marked proposed on the slide too.
- Theresa flagged the title speaker note promising an ERI talk. The public schedule doesn't show it. Cut.
- Devon and Joey agreed to drop "ERI decides what to adopt" from the funding slide (the closing slide says it) and keep the MIT line for portfolios.
- Jordan and Priya: the Start slide was the densest. Merge the laptop and screen reader fallbacks; drop the ERI liaison line (covered elsewhere).
- Devon wanted challenge details before Start. Joey refused; Round 1 moved Start up on purpose. Kept as is.
- Theresa: rule 4 must match AC-02.5 and ESSENTIALS ("Estimate only" plus the WIPA number).
- Sam: the README repo map still sent teams to `teams/`, which contradicts step 4 and CI. Fixed.
- Joey: the 3:00 PR checkpoint should appear in the deck, CONTRIBUTING and hackathon.md. Theresa agreed, pending organizer confirmation.
- Lena defended the `agents/` line on the AI slide; the cut won (Pick slide names the no-code role, README links `agents/`).
- Wording: 03 README aligned to "have ERI review my post".

### Changes applied

- `deck/attendee-kickoff.md`: rule 4 now says to show "Estimate only" and WIPA: 1-877-826-1752.
- `deck/attendee-kickoff.md`: rubric heading marked "(proposed)"; hosting row is now "ERI could adopt it (their stack, no paid services, a README that runs)"; added "Organizers and ERI set the final rubric."
- `deck/attendee-kickoff.md`: 02 and 03 slides use `cd challenges/<folder> && npm start`; Start slide preview line now notes 01 uses `/proxy/8080/`.
- `deck/attendee-kickoff.md`: Start slide fallbacks merged into two lines; ERI liaison line dropped.
- `deck/attendee-kickoff.md`: funding slide last bullet is now "Your code is MIT licensed, so anyone can reuse it".
- `deck/attendee-kickoff.md`: title speaker note no longer mentions an ERI talk.
- `deck/attendee-kickoff.md`: removed the `agents/` personas bullet on the AI slide (4 bullets remain).
- `README.md`: repo map `teams/` line now says "only if you picked a starter (otherwise work in challenges/)".
- `wiki/event/hackreation.md`: rubric row matches the deck wording; Rules item 2 adds "Open your PR by 3:00."
- `CONTRIBUTING.md`: section 4 says to open the PR by 3:00 so CI finishes before demos.
- `challenges/03-job-post-checker/README.md`: link wording is "have ERI review my post".

Deck: 14 slides. Checks: `tools/check_links.py` links ok (138 files); `tools/check.sh` all smoke tests passed.

### Changes skipped

- Reordering challenge slides before Start: rejected in debate (Start stays early so people begin coding fast).

### Unresolved questions

- Organizers: confirm the day-of times (8:30 team formation, 9:00 kickoff, hacking until 4:00, 4:00 demos), and whether a 3:00 PR checkpoint is acceptable.
- Organizers: do attendees get push access to the repo, or do they fork? This changes the "branch from main" and CI-on-PR instructions.
- Organizers and ERI: approve the final judging rubric and weights (still marked proposed). Will a daily screen reader user be on the judging panel?
- Organizers: what does "The Golden Byte: best implementation of the winning idea" mean? Which idea, and who picks it? The deck names the award without explaining it.
- ERI: will ERI staff speak at the kickoff? If so, who? The repo doesn't confirm it, and the speaker note was removed.
- ERI: who is the named ERI liaison on the day (the deck and rules send benefits, billing and ERI questions there)?
- ERI: does its billing system already report the gaps PRD 01 targets? If yes, 01 should be reframed or killed before kickoff.
- ERI: will the benefits manager and the Employment Services manager have time for the evening-2 copy reviews in PRDs 02 and 03? Can the web team take more than one plugin?
- ERI and Mitobyte: which GitHub org holds the repo after the event, and does anyone merge PRs, or do they stay open?
- Mitobyte: has anyone tested the browser IDE (code-server) with a screen reader before Oct 31? The deck tells screen reader users to start on a laptop or in Codespaces until then.
- Out of scope but contradictory: `teams/README.md` still describes the old `teams/` workflow, and should be aligned with the challenge-folder plus team-branch path.

## Resolved by Joey (2026-10-23, real input)
- **MIT license:** confirmed fine. Code stays MIT.
- **ERI judge:** the ERI liaison is also ERI's judge.
- **Golden Byte:** criteria unknown. The deck and event page now say organizers explain it at kickoff.
