# PRD: My Workday Assistant

**ERI project 2** · **Status:** from ERI, 2026-10-26 · **Source:** [docs/eri-problem-statements.md](../../docs/eri-problem-statements.md#project-2-my-workday-assistant)

**Suggested stack:** `starters/static-web`, phone-first, usable at 320px. Audio via `speechSynthesis` **only if the workspace image has voices — that is unverified, so test it before building on it**; pre-recorded audio files otherwise. The text is shown either way. See [tech-stack.md](../company/tech-stack.md#pick-by-project).

> **This PRD is downstream of ERI's own words.** Where it differs from the
> source, the source wins. Our additions are marked *(ours)*.

## 1. Problem

Some employees need support to remember task sequences, understand
instructions, transition between activities, or handle a changed workday.
Printed checklists and verbal instructions do not always fit. Job coaches and
supervisors need a simple way to make accessible instructions the employee can
use on their own.

## 2. Users

| Persona | Goal | Pain today |
| --- | --- | --- |
| Employee with a disability | Finish the task without asking again | Instructions were verbal and are gone |
| Job coach | Build a task guide quickly | Paper checklists don't carry pictures or audio |
| Supervisor / trainer | Update steps when the process changes | Reprint everything, hope it reaches people |

## 3. Hackathon MVP (ERI's list, verbatim scope)

- [ ] List **three** sample workplace tasks
- [ ] Select a task
- [ ] Show it in manageable steps, **pictures and text**
- [ ] Mark each step complete
- [ ] Show completion progress
- [ ] A simple **"I Need Help"** option

**Out of scope today (ERI):** scheduling or time tracking, payroll, automated
performance evaluation, location tracking, extensive employer management, AI
task analysis.

## 4. User stories

- As an employee, I want pictures for each step so I can finish without asking
  my supervisor repeatedly.
- As an employee, I want to listen to instructions rather than read them.
- As a job coach, I want to quickly create a task checklist.
- As a supervisor, I want to update instructions when a process changes.
- As an employee, I want to say I need help without feeling embarrassed.

## 5. Data

`challenges/p2-my-workday-assistant/data/` — three synthetic tasks with ordered
steps, each step carrying text, an image or icon, and an audio transcript.
"Stock the Shelves" is ERI's suggested demo and should be one of them.

## 6. Acceptance criteria

- **AC-P2.1** Given the task list, when it loads, then three tasks are shown
  with large labelled controls.
- **AC-P2.2** Given a selected task, when it opens, then exactly **one step** is
  shown at a time with Back and Next.
- **AC-P2.3** Given a step, then it carries **at least two formats** — text and
  a picture at minimum.
- **AC-P2.4** Given a step, when the user marks it complete, then progress
  updates and the current step and what comes next are both identifiable.
- **AC-P2.5** Given any step, when the user asks to repeat it, then the
  instruction is available again, including the audio.
- **AC-P2.6** Given any screen, then "I Need Help" is reachable in one action.
- **AC-P2.7** Given the whole flow, then nothing expires and no step requires a
  fast response.
- **AC-P2.8** Given a phone-width screen (320px), then the task is completable.
- **AC-P2.9** *(ours)* Given completion data, then it stays in the browser; no
  progress is transmitted anywhere.

## 7. Accessibility

Large clearly labelled controls, images + text + optional audio, plain language
and short sentences, keyboard and screen reader, no time pressure, repeatable
instructions, minimal distraction, works on a phone or tablet.

## 8. Risks and guardrails

- **This is a support tool, not a monitoring tool.** It must not be designed so
  an employer can measure a worker without their knowledge. Progress is private
  to the employee unless they understand and agree to share it.
- Task instructions must reflect real workplace requirements; anything
  potentially unsafe is for qualified staff to review, not a hackathon team.
- Do not gamify completion speed. Measuring how fast a disabled employee works
  is the surveillance failure wearing a friendly hat.

## 9. What ERI needs to adopt it

Phone-first. The coach-authoring side is the part that decides adoption: if
making a guide is harder than writing it on paper, it will not get used.

## 10. Adversarial debate

| Against | Response |
| --- | --- |
| "This is a checklist app" | The MVP is. The requirement that makes it not one is two formats per step plus repeatability |
| "Employers will use it to track people" | Which is why progress is local and private by default, and why that is an AC rather than a value |
| "Coaches won't author content" | Then the tool fails. Authoring effort is the real success criterion; ERI listed it first |

**Kill it if:** a coach cannot build a basic guide from a template, or an
employee cannot complete a five-step task unaided.

## 11. Monday owner

ERI to name — likely employment services rather than the web team.

## 12. Demo script (3 min)

An employee opens "Stock the Shelves," is walked through gathering supplies,
checking labels, placing product and cleaning up, marks each step, and
finishes.
