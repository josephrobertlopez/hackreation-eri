# PRD: Employer Opportunity & Support Hub

**ERI project 4** · **Status:** from ERI, 2026-10-26 · **Source:** [docs/eri-problem-statements.md](../../docs/eri-problem-statements.md#project-4-employer-opportunity--support-hub)

**Suggested stack:** `starters/static-web`, then wrap as a WordPress plugin — the most WordPress-ready of the four. No LLM scoring of candidates; see [tech-stack.md](../company/tech-stack.md#eris-limits-on-ai).

> **This PRD is downstream of ERI's own words.** Where it differs from the
> source, the source wins. Our additions are marked *(ours)*.

## 1. Problem

Employers may want to hire people with disabilities but lack the experience to
connect a person's skills to their business needs, shape meaningful
responsibilities, respond well to a disclosure, handle an accommodation
request, or plan onboarding. Good resources exist; they are not joined into one
workflow.

## 2. Users

| Persona | Goal | Pain today |
| --- | --- | --- |
| Small/midsize employer, hiring manager | See how a candidate's strengths meet real business needs | Job descriptions are fixed; strengths don't map onto them |
| Supervisor / HR | Respond correctly to a disclosure or request | Fear of getting it legally wrong |
| Job developer / ERI business services | Facilitate the employer conversation | No shared artifact to work from |

## 3. Hackathon MVP (ERI's list — they named the focus)

ERI: *"focus primarily on the skills-to-tasks matching feature."*

- [ ] Select an industry or business type
- [ ] Describe **three to five** workplace needs or recurring tasks
- [ ] Enter a **fictional** candidate's skills, interests and preferences
- [ ] Suggest matches between skills and tasks
- [ ] **Explain why** each task might be a good match
- [ ] Show a simple employer action plan with next steps

**Optional if time:** disclosure scenario guide, accommodation resource links,
basic onboarding checklist.

**Out of scope today (ERI):** applicant tracking, automatic employment
decisions, ADA compliance management, payroll/HR integration, production
storage of medical or disability information, cross-organization matchmaking.

## 4. User stories

- As an employer, I want to understand how a candidate's skills could meet my
  business needs.
- As a hiring manager, I want to know how to respond when an applicant
  discloses a disability.
- As a supervisor, I want practical ideas for adapting how tasks are taught.
- As an employer, I want help with an accommodation request without assuming
  anything about the person's disability.
- As a job developer, I want something that helps me run the employer
  conversation.

## 5. Data

`challenges/p4-employer-hub/fixtures/` — industries with recurring tasks, a skills
vocabulary, and fictional candidate profiles. *(ours)* Share the skill
vocabulary with P1 so the handoff ERI describes in §12 can be demonstrated.
Resource links: JAN, EEOC, DVR.

## 6. Acceptance criteria

- **AC-P4.1** Given the start, when an employer picks an industry and enters
  three to five needs, then the assessment completes.
- **AC-P4.2** Given a fictional candidate's skills and preferences, then **at
  least three** plausible workplace tasks are suggested.
- **AC-P4.3** Given each suggestion, then the reasoning is shown — which skill
  and which stated business need it connects.
- **AC-P4.4** Given the suggestions, then they derive from the employer's own
  entered needs, **never from an assumption about disability**.
- **AC-P4.5** Given a completed session, then a simple next-steps plan is
  produced, including questions to discuss with an employment specialist.
- **AC-P4.6** Given any output, then it links to JAN, EEOC, DVR or equivalent
  trusted resources.
- **AC-P4.7** Given the tool, then it never ranks or scores candidates and
  never makes a hiring or accommodation decision.
- **AC-P4.8** Given any screen, then keyboard and screen reader work, the
  language is plain, and it is usable on a phone.
- **AC-P4.9** *(ours)* Given a complex legal question, then the tool refers to
  qualified professionals rather than answering.

## 7. Accessibility

Keyboard and screen reader, plain-language explanations, clear navigation,
mobile-friendly, accessible forms, no time limits, and no disability-based
assumptions or stereotypes in any copy.

## 8. Risks and guardrails

This PRD has the longest guardrail list because ERI wrote one:

- Do not require a candidate to disclose a disability or diagnosis.
- Get permission before sharing candidate portfolio information.
- Do not rank candidates by disability — automatically or otherwise.
- Do not make automated hiring or accommodation decisions.
- Protect confidential employee information.
- **Never suggest an accommodation from a disability label alone.**
- Refer complex legal questions to qualified professionals.

The failure mode to design against: a tool that looks like it is telling an
employer what a disabled person can do. It matches *stated skills* to *stated
business needs*, and shows its reasoning so a human can disagree with it.

## 9. What ERI needs to adopt it

This is the one with outreach value for ERI Business Services — an employer who
works through it and reaches a next-steps plan is a warm conversation. Worth
asking ERI where that should point.

## 10. Adversarial debate

| Against | Response |
| --- | --- |
| "Skills-to-tasks matching is a lookup table" | For one day, yes — and the explanation of *why* is the product, not the match |
| "Employers won't fill in five needs" | Then the MVP is wrong and it should start from the industry template. Test it on a real employer at the event |
| "This edges toward automated hiring" | AC-P4.7 forbids it and ERI put it out of scope. No scores, no ranking, no decisions |

**Kill it if:** suggestions don't trace to the employer's own stated needs, or
the reasoning isn't shown.

## 11. Monday owner

ERI to name — business services, with the web team on hosting.

## 12. Demo script (3 min)

A retail business needs inventory, merchandising and display upkeep. A
fictional candidate has strong organizational skills and prefers routine work
with merchandise. The tool proposes responsibilities, explains each, and ends
with a draft task plan and questions for an employment specialist.
