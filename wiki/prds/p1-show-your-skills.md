# PRD: Show Your Skills

**ERI project 1** · **Status:** from ERI, 2026-10-26 · **Source:** [docs/eri-problem-statements.md](../../docs/eri-problem-statements.md#project-1-show-your-skills)

**Suggested stack:** `starters/static-web`; the portfolio exports as a file. Media capture via a file input with the `capture` attribute. Use `expo-supabase` only if you want a real view-only link, and own the hosting question. See [tech-stack.md](../company/tech-stack.md#pick-by-project).

> **This PRD is downstream of ERI's own words.** Where it differs from the
> source, the source wins. Our additions are marked *(ours)* and ERI may
> keep / kill / change them.

## 1. Problem

Traditional resumes may not accurately represent a person's abilities,
particularly with limited work experience, a communication disability, or
difficulty describing strengths in writing. Job seekers need accessible ways to
show skills; employers need straightforward ways to see how those skills relate
to job responsibilities.

## 2. Users

| Persona | Goal | Pain today |
| --- | --- | --- |
| Job seeker with a disability | Show what I can actually do | A resume hides my ability behind writing |
| Job coach / employment specialist | Help organize someone's work examples | No shared place to put photos, video, notes |
| Employer / hiring manager | Understand an applicant's skills fast | Must infer ability from a thin resume |

## 3. Hackathon MVP (ERI's list, verbatim scope)

- [ ] Enter basic profile information
- [ ] Select or enter **three** skills
- [ ] Add **at least one** example of a skill
- [ ] Display it as a simple portfolio
- [ ] Share or export the portfolio

**Out of scope today (ERI):** commercial job board integration, automated
hiring or applicant scoring, employer account management, AI-generated
assessments of suitability, identity verification, production hosting.

## 4. User stories

- As a job seeker, I want to show a video of myself completing a work task so
  employers can see my skills.
- As a person who has difficulty writing, I want to use pictures or audio to
  explain my abilities.
- As a job coach, I want to help someone organize their work examples.
- As an employer, I want to quickly understand an applicant's skills without
  navigating a complicated website.

## 5. Data

`challenges/p1-show-your-skills/data/` — a skills vocabulary and a set of
sample work examples with captions and transcripts, all synthetic. Sample media
only, per ERI §10. *(ours)* Keep the skill names consistent with P4's task
vocabulary so a team can demo the P1→P4 handoff ERI names in P4 §12.

## 6. Acceptance criteria

- **AC-P1.1** Given an empty portfolio, when the user enters a display name and
  interests, then the portfolio shows them without requiring a legal name.
- **AC-P1.2** Given the skill step, when the user picks from the list or types
  a custom skill, then three skills can be recorded.
- **AC-P1.3** Given a skill, when the user attaches a photo, audio, video or
  written example, then it appears under that skill with its caption or
  transcript.
- **AC-P1.4** Given a completed portfolio, when an employer opens the preview,
  then at least three skills are identifiable without instruction.
- **AC-P1.5** Given a completed portfolio, when the user chooses to share, then
  a view-only link or downloadable file is produced **and the user chooses what
  it contains**.
- **AC-P1.6** Given any step, when the user navigates by keyboard only, then
  every control is reachable and focus is visible.
- **AC-P1.7** Given any image, audio or video, then a text alternative,
  caption or transcript is present.
- **AC-P1.8** Given the whole flow, then no step imposes a time limit.
- **AC-P1.9** *(ours)* Given the running app, then it makes no network request;
  nothing leaves the browser.

## 7. Accessibility

Keyboard and screen reader, plain-language instructions, alternatives to typed
input, labels/captions/transcripts, no time limits, user controls what is
shared. One real screen reader pass is required, not optional.

## 8. Risks and guardrails

- **Never require disclosure of a disability or diagnosis.** Not a field, not a
  prompt, not an inference.
- Demonstration content only with consent; use the synthetic sample media.
- Do not score, rank or assess the person. ERI put AI-generated suitability
  assessment out of scope explicitly.
- A portfolio is the person's own. Sharing is their decision each time.

## 9. What ERI needs to adopt it

Browser-only, nothing stored server-side, so ERI's web team can review it as a
static page or a WordPress plugin. Media hosting is the open question — a real
deployment needs a decision about where video lives and who can reach it.

## 10. Adversarial debate

| Against | Response |
| --- | --- |
| "This is just a resume builder" | A resume is text. The point is the non-text path: ERI's success criteria require at least one non-text method |
| "Employers won't open a link from a stranger" | Which is why the share artifact must also be downloadable and skimmable in under a minute |
| "Video hosting makes this unhostable for ERI" | True for production. For the hackathon, local sample media; name the hosting decision rather than hide it |

**Kill it if:** a job seeker cannot finish a portfolio in 5–10 minutes with
prepared examples, or an employer cannot name three skills after reading one.

## 11. Monday owner

ERI to name. The adopt path runs through the web team.

## 12. Demo script (3 min)

A job seeker builds a portfolio showing they can organize supplies, greet
customers and follow a checklist. An employer opens it and reads those three
skills back.
