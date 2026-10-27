# ERI's backlog, with IDs

**Generated. Do not edit.** `python3 tools/gen_backlog.py` rebuilds it
from [docs/eri-problem-statements.md](eri-problem-statements.md), which is the source of
truth. If a line here looks wrong, the source wins and this file is a
bug in the generator.

Every row has an ID. That ID is what a pull request claims, what a test
is tagged with, and what a reviewer ticks off. IDs are positional within
a project and a kind, so they are stable as long as ERI does not reorder
a table or a list.

**47 entries: 28 core features, 19 user stories, across 4 projects.**

| Project | Features | User stories |
| --- | --- | --- |
| P1 Show Your Skills | 6 | 4 |
| P2 My Workday Assistant | 8 | 5 |
| P3 Job Coach Connection | 7 | 5 |
| P4 Employer Opportunity & Support Hub | 7 | 5 |

## P1: Show Your Skills

ERI's own words: [docs/eri-problem-statements.md](eri-problem-statements.md#project-1-show-your-skills)

| ID | Kind | ERI's text |
| --- | --- | --- |
| `P1-F1` | feature | **Create a profile** — Enter a name or display name, interests, and preferred work activities. |
| `P1-F2` | feature | **Add skills** — Select skills from a list or enter custom skills. |
| `P1-F3` | feature | **Show examples** — Add photos, short videos, audio, or written examples demonstrating a skill. |
| `P1-F4` | feature | **Describe abilities** — Use simple prompts such as "I am good at…" and "Here is something I can do…" |
| `P1-F5` | feature | **Preview portfolio** — View a simple, employer-friendly presentation. |
| `P1-F6` | feature | **Share portfolio** — Generate a view-only link or downloadable portfolio. |
| `P1-US1` | story | As a job seeker, I want to show a video of myself completing a work task so employers can see my skills. |
| `P1-US2` | story | As a person who has difficulty writing, I want to use pictures or audio to explain my abilities. |
| `P1-US3` | story | As a job coach, I want to help someone organize their work examples. |
| `P1-US4` | story | As an employer, I want to quickly understand an applicant's skills without navigating a complicated website. |

## P2: My Workday Assistant

ERI's own words: [docs/eri-problem-statements.md](eri-problem-statements.md#project-2-my-workday-assistant)

| ID | Kind | ERI's text |
| --- | --- | --- |
| `P2-F1` | feature | **Create a task** — Add a workplace task and describe its steps. |
| `P2-F2` | feature | **Visual instructions** — Include an image or icon for each step. |
| `P2-F3` | feature | **Audio support** — Allow users to hear task instructions. |
| `P2-F4` | feature | **Step-by-step navigation** — Show one step at a time with Back and Next controls. |
| `P2-F5` | feature | **Task completion** — Allow workers to mark individual steps or tasks complete. |
| `P2-F6` | feature | **Daily routine** — Display a simple list of assigned tasks for the day. |
| `P2-F7` | feature | **Reminders** — Provide optional reminders or prompts for scheduled activities. |
| `P2-F8` | feature | **Request help** — Provide an easy way to indicate when assistance is needed. |
| `P2-US1` | story | As an employee, I want to see pictures showing each step of a task so I can complete it without asking my supervisor repeatedly. |
| `P2-US2` | story | As an employee, I want to listen to instructions rather than read them. |
| `P2-US3` | story | As a job coach, I want to quickly create a task checklist for someone I support. |
| `P2-US4` | story | As a supervisor, I want to update instructions when a process changes. |
| `P2-US5` | story | As an employee, I want to indicate that I need help without feeling embarrassed. |

## P3: Job Coach Connection

ERI's own words: [docs/eri-problem-statements.md](eri-problem-statements.md#project-3-job-coach-connection)

| ID | Kind | ERI's text |
| --- | --- | --- |
| `P3-F1` | feature | **Request help** — Provide a clearly labeled "I Need Help" option. |
| `P3-F2` | feature | **Select support need** — Offer choices such as "I have a question," "I don't understand a task," or "My schedule changed." |
| `P3-F3` | feature | **Multiple communication options** — Allow text, predefined messages, and picture-based selections. |
| `P3-F4` | feature | **Send request** — Deliver the request to a designated job coach or simulated coach inbox. |
| `P3-F5` | feature | **View request status** — Display whether the request has been sent, seen, or answered. |
| `P3-F6` | feature | **Job coach response** — Allow the coach to send a short written or predefined response. |
| `P3-F7` | feature | **Communication history** — Allow the employee to review messages within the current session. |
| `P3-US1` | story | As an employee, I want to ask for help using pictures because typing messages can be difficult. |
| `P3-US2` | story | As an employee, I want to know when my job coach has received my request. |
| `P3-US3` | story | As a job coach, I want to see what type of help someone needs before contacting them. |
| `P3-US4` | story | As an employee, I want a simple way to explain that I am confused or that something unexpected happened. |
| `P3-US5` | story | As a job coach, I want to respond with a short, clear message that is easy to understand. |

## P4: Employer Opportunity & Support Hub

ERI's own words: [docs/eri-problem-statements.md](eri-problem-statements.md#project-4-employer-opportunity--support-hub)

| ID | Kind | ERI's text |
| --- | --- | --- |
| `P4-F1` | feature | **Employer needs assessment** — Allow employers to describe their business, staffing needs, and job tasks. |
| `P4-F2` | feature | **Skills-to-tasks matching** — Identify potential connections between candidate strengths and workplace responsibilities. |
| `P4-F3` | feature | **Job task development** — Help employers explore combinations of tasks that could create meaningful employment opportunities. |
| `P4-F4` | feature | **Disclosure guidance** — Offer examples and explanations of appropriate employer responses to disability disclosures. |
| `P4-F5` | feature | **Accommodation explorer** — Suggest possible accommodations and connect users to authoritative resources. |
| `P4-F6` | feature | **Onboarding planner** — Create a simple checklist for training, communication, and workplace supports. |
| `P4-F7` | feature | **Resource connections** — Provide links to JAN, EEOC, DVR, and other trusted resources. |
| `P4-US1` | story | As an employer, I want to understand how a candidate's skills could meet my business needs. |
| `P4-US2` | story | As a hiring manager, I want to know how to respond when an applicant discloses a disability. |
| `P4-US3` | story | As a supervisor, I want practical ideas for adapting how work tasks are taught or completed. |
| `P4-US4` | story | As an employer, I want help understanding accommodation requests without making assumptions about a person's disability. |
| `P4-US5` | story | As a job developer, I want a tool that helps facilitate conversations with employers about potential job opportunities. |

