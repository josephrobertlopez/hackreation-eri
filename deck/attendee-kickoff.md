---
marp: true
theme: default
paginate: true
size: 16:9
title: Hackreation x ERI - Attendee kickoff
style: |
  section { font-size: 28px; }
  h1 { font-size: 52px; }
  table { font-size: 22px; }
  code { font-size: 22px; }
  section.lead h1 { font-size: 64px; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Hackreation x ERI

**Build software that connects people with disabilities to jobs**

Sat, Oct 31, 2026, Penrod, Milwaukee
Mitobyte + Employment Resources, Inc.
Use this deck before the event (what to expect, how to try the code) and at kickoff. Slides as plain text: `deck/attendee-kickoff.md`. Times, place, help and judging: `wiki/event/hackreation.md`. Your guide for today: `START-HERE.md`

<!-- Speaker: welcome, thank ERI, Wisconsin Tech Month closer. Read the challenge list aloud. Publish this deck as text next to the slides. Introduce the ERI liaison, and any judge who is here, by name; others are introduced when they arrive. Say where the front-table sheet is. Kickoff target: 10 minutes, hacking by 9:30. SPEAK only these: this one, The theme, The four projects, Three doors, Roles, How you're judged. Everything else is read on your own (before the event it is the whole deck). The rest are read on your own (the text copy is linked on this slide). -->

---

# The theme, and who it helps

**Software that connects people with disabilities to job opportunities.**

- Job seekers with disabilities: show what they can do
- Employees: keep a job with the right support at work
- Job coaches and employers: help and hire with confidence
- Part of Wisconsin Tech Month. Hosted by Mitobyte with Employment Resources, Inc. (ERI)
- Everything is built for real users, on fake data

---

# Who is ERI?

- A Madison-based nonprofit, since 1990, with about 29 staff across Wisconsin including Milwaukee (source: eri-wi.org/staff)
- Helps people with disabilities get and keep jobs
- The catch: a paycheck can shrink a Social Security disability check (SSI or SSDI) or put health coverage (Medicaid) at risk
- So many people say no to work out of fear
- ERI's benefits counselors (WIPA) answer: "What happens if I take this job?"

---

# How ERI gets paid, and who keeps your code

- Most income is paid per service, by Social Security and by Wisconsin's job agency for people with disabilities (DVR)
- ERI is paid only when work is done, written up and claimed
- Margins are thin, so saved staff time and missed billing are real money
- A small web team runs ERI's WordPress sites. Build on the recommended stack: plain HTML, CSS and JavaScript that could be pasted into WordPress
- Your code is MIT licensed (see `LICENSE`), so anyone can reuse it

---

# The 6 rules

1. **Fake data only.** Use your project's `fixtures/` (or `data/job_seekers.csv`, `data/job_postings.csv`). Real client data is protected by law
2. **No connection to ERI systems.** Your prototype stands alone
3. **AI is allowed and optional.** Here it sees fake data only. In real use, the client must agree first
4. **Benefits answers are estimates.** Wrong answers hurt people. Always show "Estimate only" and WIPA: 1-877-826-1752
5. **If you build a billing tool (none of the four projects is one), it flags; people decide.** It's public money
6. **Accessible or it doesn't count**: keyboard, labels, focus, contrast, plain words

Public ports are public, and the repo is public. Ask before you photograph anyone.

---

# The four projects, in ERI's words

Quotes are ERI's "product goal" lines. Full text: `docs/eri-problem-statements.md`

- **P1 Show Your Skills.** "Help employers recognize what a person can do by providing alternative ways to demonstrate skills and experience."
- **P2 My Workday Assistant.** "Reduce reliance on repeated verbal instructions and help employees complete workplace tasks with confidence."
- **P3 Job Coach Connection.** "Help employees get timely assistance while supporting their independence and reducing unnecessary barriers to communication."
- **P4 Employer Opportunity & Support Hub.** "Make it easier for employers to recognize talent, create meaningful job opportunities, and support employees with disabilities."

---

# Pick one project

| # | Project | Who it helps | Port |
| --- | --- | --- | --- |
| **P1** | Show Your Skills | Job seekers, job coaches, employers | 8000 |
| **P2** | My Workday Assistant | Employees, job coaches, supervisors | 8002 |
| **P3** | Job Coach Connection | Employees and their job coaches | 8003 |
| **P4** | Employer Opportunity & Support Hub | Employers and hiring managers | 8000 |

Each is plain HTML, CSS and vanilla JavaScript, zero dependencies, in `challenges/p1-...` to `p4-...`. It already runs and has tests. Extend it; do not rebuild it.
Several teams may pick the same project. Attempts are compared, not merged. The folders `01-...` to `03-...` are retired. Ignore them.

---

# Roles: every team has no-code work

Captain, navigator, designer, writer, tester, ERI expert, presenter, WordPress lead.

- **The captain** forks the repo, adds teammates as collaborators and opens the team's one pull request. Anyone with a GitHub account can be captain
- Sit at any table, 6 to 8 per table. Joey moves people if a table is full or has no one who can run the hello world; with fewer people, he drops the highest-numbered teams
- Designers: paper, iPad or Figma. Writers and testers: any device
- Ask for a designer and a tester on every team
- Your team card has a role line. Fill it in now

---

# Three doors: where you can work

1. **Codespace.** A free, verified GitHub account and a browser. Usually ready in about 2 minutes. The captain forks the repo and adds teammates; everyone opens a Codespace **from the team fork**
2. **Your own laptop.** git, Node 20 or newer and Python 3. Best for screen reader users
3. **Backup: 5 VS Code instances in the browser.** One per team at `hack-team1` to `hack-team5` `.taild76c1b.ts.net`. The password is on your team card. One shared session, one driver, no account. The safety net if a Codespace or laptop fails

Not ready after 10 minutes? Delete the Codespace and use door 3. Everything step by step: `START-HERE.md`.

---

# Before the event: try it yourself

No sign-up needed. Fake data only.

1. Open a Codespace from the repo, or `git clone https://github.com/josephrobertlopez/hackreation-eri`
2. `cd challenges/p1-show-your-skills` (or p2, p3, p4)
3. `npm test`. It passed if the last lines say `# fail 0`
4. `npm start`, then open `http://localhost:8000/web/`
5. Read the project's problem statement and README
6. Fork the repo to keep your own work

Steps: `docs/PREP-CHECKLIST.md`, "Start before the event". Windows: use `py -m http.server 8000`.

---

# How teams form

- Up to 5 teams, about 6 to 8 people each. No team needed in advance
- 8:30 to 9:00: meet people. Mentors and hosts help match teams by skills and interests
- 9:00 to 9:30: kickoff and team registration: sit at a table, take that team's numbered card
- Every team needs one person who can run the hello world and one who owns plain language and accessibility testing (no code needed)
- Pick the captain: anyone with a GitHub account
- Joining late is fine. Leaving early is fine

---

# Use AI well

- The backup team editor has no AI assistant. Bring your own account if you want one, in another browser tab or on your own laptop: fake data and repo code only, nothing that needs a paid key in your project folder
- Point your assistant at **`AGENTS.md`** (or `llms.txt`) and your **PRD**
- Ask for **small changes**, and make it **write a test**
- **Check its facts:** WordPress hooks and SSA numbers are common mistakes (see `wiki/stack/`)
- **Never** paste real personal data

---

# The accessibility bar

- Works with **keyboard only**, with a visible focus ring
- Every input has a **label**
- Results are **announced** to screen readers
- **Contrast** 4.5:1; usable at **320px** wide and **200% zoom**
- **Plain language**, about a 6th-grade reading level
- Tried once with a **screen reader** (Mac VoiceOver: Cmd+F5. Windows Narrator: Win+Ctrl+Enter, or NVDA if installed. iPad VoiceOver, Chromebook ChromeVox)
- Plain-language and accessibility testing count as real work

Judges look for this in your demo: keyboard-only use, which screen reader you tried, what your tester found.

---

# How you're judged

| Criterion | Weight | Scored by |
| --- | --- | --- |
| Solves ERI's problem | 30% | ERI liaison |
| Accessible | 25% | Developer judge |
| Works end to end (a live demo on fake data) | 20% | Developer judge |
| ERI could adopt it (their stack, no paid services, a README that names the run commands) | 15% | ERI liaison, with the developer judge's check of the README |
| Presentation | 10% | All judges |

**The Golden Byte** goes to the highest weighted judge total. Every team is eligible, whichever project it picked, if it gives a demo and Joey has its pull request address before 3:30 (open it any time before 3:30; late still counts). Details: the Awards table on the event page. People's Choice is a show of hands; each judge may nominate a team for Best in Design, Best in Innovation and Best in Teamwork, and the team with the most nominations wins.

Joey introduces the ERI liaison and any judge who is here. Rubric version: draft as of Thu Oct 29 (it becomes final after the Fri Oct 30, 6 pm confirmation). Judges never get a team password. Details: `wiki/event/hackreation.md`.

---

# Share your work: one team pull request

- One pull request per team, titled `Team N: <project>`
- The captain opens it from the team fork to the main repo, **any time before 3:30**, then tells Joey its address at the front table
- Everyone works on a branch in the team fork; the captain merges them into the team branch. Only your project folder may change
- The form asks five things: project, the feature or story IDs, three ticks, one tester sentence, and your "What ERI would need" line
- Backup editor only? Tell Joey between 2:00 and 2:15 (that call counts; 11:30 to 11:45 is optional and only buys a lunch safety copy): hold up your card and say your team number and project. He saves your project folder and opens the pull request with your driver. A late team still counts
- Rules: `CONTRIBUTING.md`, section 5

---

# Your 3-minute demo

1. **Who** it's for and their problem (20 sec)
2. **Live demo** on fake data (2 min). Start with: "All data in this demo is fake."
3. **What ERI would need** to adopt it (20 sec). Also the first line under the title of your project README, beginning `What ERI would need:`
4. **Accessibility** you tested (20 sec)

Demos run from the **venue laptop** or your own laptop, in a 10-minute slot (3 minutes of demo). Demo check 3:00 to 3:30, alongside hacking; presentations start at 3:30.
Codespace: set your port to **Public** and open that link on the venue laptop. Backup editor: your driver opens the team editor there and types the password (screen turned away). Judges never get a password. Keep a recording of the working demo (up to 3 minutes) on your phone as a backup; judges score what it shows.
Any teammate may present, read a script, or play the clip. Captions on.
Call it a Hackreation prototype, not an ERI product.

---

# Schedule

Source: the Meetup page, and `wiki/event/hackreation.md`. Breakfast and lunch provided.

| Time | What |
| --- | --- |
| 8:00 | Doors, check-in, coffee |
| 8:30 to 9:00 | Networking. Organizers help match teams |
| 9:00 to 9:30 | Kickoff, rules, agenda, team registration |
| 9:30 to 12:00 | Hacking, floating mentors available |
| 12:00 to 12:45 | Lunch (backup-editor teams: Joey makes a safety copy of their folders) |
| 12:45 to 3:30 | Hacking. The team pull request is open any time before 3:30 |
| 3:00 to 3:30 | Demo check on the venue laptop, alongside hacking |
| 3:30 to 4:30 | Presentations to judges and the community, then awards |
| 5:00 | End |

Leaving early is fine. Coming late is fine.

---

# Awards

- **The Golden Byte**: the highest weighted judge total
- **People's Choice**: the room, by a show of hands
- **Best in Design**, **Best in Innovation**, **Best in Teamwork**: judge nominations

Presentations and awards: 3:30 to 4:30. Every team is eligible, whichever of the four projects it picked.

---

# Getting help

- Ask a teammate or neighbour first
- Stuck 15 minutes? **Raise a hand**, hold up your team card, or call out your name and "help"
- Floating mentors: Joey (name tag: HELP) and the Mitobyte hosts
- Announcements and links: the comments on the Meetup event page
- Headphones, quiet and captions: just ask

---

# Before you leave

- Make sure your team's code is in the team pull request
- Hand your team card back
- Winners go on the Meetup page
- What happens after today (including Sunday Nov 1): `wiki/event/hackreation.md`, "After the event"
- Thank you from Mitobyte and ERI

---

<!-- _class: lead -->

# Questions? Raise a hand

After today: ERI reviews every project and decides.

ERI is not promising to adopt, host or support any project.

**Let's build.**
