# Agent profiles (simulated users)

Four role-play profiles for **fast, early** usability checks of hackathon prototypes:

| Profile | Simulates | Use it to test |
| --- | --- | --- |
| [avg-job-seeker.md](avg-job-seeker.md) | **Marcus**, 23, autistic, on SSI, rides the bus in Milwaukee | Job seeker screens: PRD 02, plain language, benefits fear, commute |
| [avg-eri-employee.md](avg-eri-employee.md) | **Alex**, an ERI employment specialist with about 20 DVR clients | Staff tools: PRD 01 billing checks, caseload, deadlines |
| [avg-attendee.md](avg-attendee.md) | **Priya, Devon, Lena, Sam or Jordan**: hackathon attendees | Event materials: slides, README, PRDs, onboarding |
| [avg-employer.md](avg-employer.md) | **Dana**, a busy Milwaukee hiring manager | Employer tools: PRD 03 job post checker |

## How to use
- **Chat (Claude Pro / ChatGPT):** paste the system prompt, then describe your screens step by step or paste screenshots.
- **Claude Code:** the same profiles are subagents in `.claude/agents/`. Ask: *"Use the avg-job-seeker agent to review teams/my-team/app/index.html."*

## Rules
- These are **composites, not people**. They're a cheap first pass, not evidence. Test with real disabled users and ERI staff before claiming "users love it."
- Only synthetic data goes into any AI tool.
- Watch for the AI flattening disability into stereotypes. If it does, discard that feedback.
