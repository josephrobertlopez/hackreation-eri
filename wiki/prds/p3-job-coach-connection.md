# PRD: Job Coach Connection

**ERI project 3** · **Status:** from ERI, 2026-10-26 · **Source:** [docs/eri-problem-statements.md](../../docs/eri-problem-statements.md#project-3-job-coach-connection)

**Suggested stack:** `starters/static-web` with two tabs (employee + coach inbox) synced by `BroadcastChannel`. A backend only if requests must cross devices. See [tech-stack.md](../company/tech-stack.md#pick-by-project).

> **This PRD is downstream of ERI's own words.** Where it differs from the
> source, the source wins. Our additions are marked *(ours)*.

## 1. Problem

Employees sometimes need help with a task, a change in routine, or something
unexpected — but asking is hard: a communication disability, not knowing who to
contact, or not wanting to interrupt a supervisor. Coaches support several
people across worksites and cannot always be there in person.

## 2. Users

| Persona | Goal | Pain today |
| --- | --- | --- |
| Employee receiving job coaching | Ask for help without a phone call | Typing is hard; interrupting feels worse |
| Job coach | See what kind of help is needed before responding | A missed call says nothing about urgency |
| Workplace support staff | Step in when authorized | No clear boundary of who may receive what |

## 3. Hackathon MVP (ERI's list, verbatim scope)

- [ ] A clearly labelled **"I Need Help"** option
- [ ] Choose from **four** common support needs
- [ ] An optional short text message
- [ ] Send to a demonstration coach dashboard
- [ ] Coach acknowledges and responds
- [ ] Response appears on the employee's screen

**Out of scope today (ERI):** personnel system integration, medical or
emergency response, video calling, automated monitoring, production case
management, multi-agency coordination.

## 4. User stories

- As an employee, I want to ask for help using pictures because typing is hard.
- As an employee, I want to know when my coach has received my request.
- As a coach, I want to see what type of help is needed before contacting them.
- As an employee, I want a simple way to say I am confused or something
  unexpected happened.
- As a coach, I want to reply with a short, clear, easy-to-understand message.

## 5. Data

`challenges/p3-job-coach-connection/fixtures/` — the four support-need options with
icons, a set of predefined employee messages, and predefined coach replies. All
synthetic; the coach inbox is simulated, per ERI's MVP wording.

## 6. Acceptance criteria

- **AC-P3.1** Given any screen, then "I Need Help" is present, large, and
  labelled with both icon and text.
- **AC-P3.2** Given a help request, when the employee uses predefined options,
  then it is submitted in **three interactions or fewer**.
- **AC-P3.3** Given a request, then **at least one** non-typed path exists
  (picture or predefined message).
- **AC-P3.4** Given a sent request, then the employee sees clear confirmation
  and a status of sent / seen / answered.
- **AC-P3.5** Given a sent request, then it appears in the coach dashboard with
  its support-need type visible before opening.
- **AC-P3.6** Given a request, when the coach responds, then the response
  appears on the employee's screen.
- **AC-P3.7** Given the session, then the employee can review previous messages.
- **AC-P3.8** Given any screen, then it is clear **who** will receive the
  message.
- **AC-P3.9** Given an urgent or unsafe situation, then the product routes to
  established emergency procedures and does **not** present itself as the path.
- **AC-P3.10** *(ours)* Given the coach dashboard, then the product never
  implies the coach is currently available or will reply within any time.

## 7. Accessibility

Large buttons with icons **and** text labels, short plain-language options,
screen reader and keyboard, alternatives to typing, clear send confirmation,
easy review of prior messages, no deep menus.

## 8. Risks and guardrails

- **AC-P3.9 is the one that matters most.** A help button that looks like it
  summons help, in a real emergency, is harmful. Routine coaching and emergency
  must be visibly different paths.
- Never imply a coach is always available. Status must not read as presence.
- The recipient must be named. "Sent to your coach" is not enough if the
  employee cannot tell who that is.
- This is not monitoring. Coaches see requests, not activity.

## 9. What ERI needs to adopt it

A production version needs real authentication, protected transport, a record
retention policy and stated response expectations. Say that out loud in the
demo — ERI wrote it into the statement and it is the honest framing.

## 10. Adversarial debate

| Against | Response |
| --- | --- |
| "It's a chat app" | A chat app starts with a blank box. Everything here is about not needing one |
| "Creates dependence on the coach" | ERI's own key design question. Favour predefined answers that resolve without contact |
| "Simulated inbox isn't a product" | For one day it is the honest scope; ERI specified a simulated coach inbox |

**Kill it if:** a request takes more than three interactions, or the employee
cannot tell whether it was received.

## 11. Monday owner

ERI to name — employment services, with a web-team review of the transport
question.

## 12. Demo script (3 min)

An employee doesn't understand a new task. They tap "I Need Help," then "I
don't understand my task." The coach sees the type, responds, and the employee
reads it and carries on.
