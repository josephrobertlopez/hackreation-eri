# Attendee personas (who's in the room on Oct 31)

**Composite and fictional**, based on who typically comes to Milwaukee community meetups like Mitobyte's Code & Coffee (students, working developers, career changers, designers). About 18 RSVPs, organizers included. Use these to design the kickoff, the repo and the help desk, not to judge anyone.

| Persona | Background | What they need from us | Risk if we miss it |
| --- | --- | --- | --- |
| **Priya, 20: CS student** (UWM/MSOE) | Java and Python from class, some React; first hackathon | A clear starting point, permission to ask "dumb" questions, a portfolio piece | Stuck in setup for an hour; leaves at lunch |
| **Devon, 34: working developer** | 8 years of backend work; came for networking and to give back | A real problem, real constraints, a fast path to something shippable | Bored by hand-holding; builds a clever thing ERI can't use |
| **Lena, 29: UX designer** | Figma, accessibility interest, light HTML/CSS | A role that isn't "watch the coders": personas, flows, plain language, a11y testing | Sidelined; the demos look rough |
| **Sam, 41: career changer** | Bootcamp grad, job hunting, knows WordPress from freelance | WordPress-friendly work; something to show employers | Feels behind; quietly disengages |
| **Jordan, 27: developer who is blind** | Uses a screen reader daily; a strong JS developer | Accessible tools and slides; the lived-experience lens is valued, not tokenized | Can't use the hosted IDE or slides; the event contradicts its own theme |

## What every attendee needs to know about ERI (in under 2 minutes)
1. **Who:** a Madison nonprofit since 1990 that helps people with disabilities get and keep jobs.
2. **The tension:** working can affect SSI/SSDI and Medicaid, so fear of losing benefits keeps people from saying yes to jobs.
3. **How ERI gets paid:** mostly fee-for-service from Wisconsin DVR and Social Security, per milestone, so documentation and claiming matter.
4. **Who keeps the code:** a small web team running WordPress. Build on their stack.
5. **The guardrails and why:** synthetic data (privacy law), estimates route to WIPA (wrong benefits info hurts people), flags not decisions (public money).

## Design implications
- **Kickoff:** one slide on ERI, one on the rules, one per challenge, then "how to start in 2 minutes." The deep material stays in the repo.
- **Team formation:** mix roles. Every team needs at least one person who can run the hello world and one who owns accessibility and plain language.
- **Roles for non-coders:** persona testing (`agents/`), copywriting at a 6th-grade level, axe and keyboard testing, demo storytelling.
- **Access:** slides with real text and good contrast, a hosted IDE that works with a screen reader (code-server is VS Code, but test it; offer local setup as an alternative), and captions or a written run of show.
- **Portfolio value:** PRs, tests, CI badges and a README count, so CONTRIBUTING.md makes the "real SWE experience" explicit.
