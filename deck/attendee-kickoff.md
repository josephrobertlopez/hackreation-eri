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
Slides as plain text: `deck/attendee-kickoff.md`. Times, place, help and judging: `wiki/event/hackreation.md`. Your guide for today: `START-HERE.md`

<!-- Speaker: welcome, thank ERI, Wisconsin Tech Month closer. Read the challenge list aloud. Publish this deck as text next to the slides. Introduce the ERI liaison, and any judge who is here, by name; others are introduced when they arrive. Say where the front-table sheet is. Kickoff target: 10 minutes, hacking by 9:30. SPEAK only five slides: this one, Pick one challenge, Roles, Get started, How you're judged. The rest are read on your own (the text copy is linked on this slide). -->

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

# Pick one challenge

Four projects, in ERI's own words: `docs/eri-problem-statements.md`

| # | Project | Product type |
| --- | --- | --- |
| **P1** | Show Your Skills | Accessible digital skills portfolio |
| **P2** | My Workday Assistant | Accessible workplace task and routine support tool |
| **P3** | Job Coach Connection | Accessible employee and job coach communication tool |
| **P4** | Employer Opportunity & Support Hub | Employer decision-support and workplace accessibility tool |

Each project folder (`challenges/p1-...` to `p4-...`) already runs and has tests. Extend it; do not rebuild it.
The folders `01-...` to `03-...` are retired. Ignore them.
Several teams may pick the same project. Attempts are compared, not merged.

---

# Roles: every team has no-code work

Captain, navigator, designer, writer, tester, ERI expert, presenter, WordPress lead.

- **The captain** forks the repo, adds teammates as collaborators and opens the team's one pull request. Anyone with a GitHub account can be captain
- Sit at any table, 6 to 8 per table. Joey moves people if a table is full or has no one who can run the hello world; with fewer people, he drops the highest-numbered teams
- Designers: paper, iPad or Figma. Writers and testers: any device
- Ask for a designer and a tester on every team
- Your team card has a role line. Fill it in now

---

# Get started: two doors and a backup

1. **Codespace** (free GitHub account). The captain forks the repo and adds teammates; everyone opens a Codespace **from the team fork**. Start it now; if it is not ready after 10 minutes, delete it and use path 3
2. **Your own laptop** (git and Node 20 or newer): clone the team fork, then in your project folder `npm start` and `npm test`
Backup: **the team editor.** No account, any browser: the address and password are on your team card. One shared session, one driver. For no account, a laptop that cannot run Node, or a Codespace that is not ready

Everything step by step: `START-HERE.md`. Stuck? Ask a teammate or neighbour. 15 minutes: raise a hand.
Not sure which door? `START-HERE.md`, "Which door" (screen reader: start on your laptop). Screen reader user? The optional session with Joey is 9:30 to 9:50, at a table he names now and writes on the front-table sheet.

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

**The Golden Byte** goes to the highest weighted judge total. Every team is eligible, whichever project it picked, if it gives a demo and Joey has its pull request address before 3:30 (open it by 3:00; late still counts). Details: the Awards table on the event page. People's Choice is a show of hands; the judges agree Best in Design, Best in Innovation and Best in Teamwork.

Joey introduces the ERI liaison and any judge who is here. Rubric version: draft as of Thu Oct 29 (it becomes final after the Fri Oct 30, 6 pm confirmation). Judges never get a team password. Details: `wiki/event/hackreation.md`.

---

# Share your work: one team pull request

- One pull request per team, titled `Team N: <project>`
- The captain opens it from the team fork to the main repo, **by 3:00**, then tells Joey its address at the front table
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

Demos run from the **venue laptop** or your own laptop, in a 10-minute slot (3 minutes of demo). Demo check 3:00 to 3:30; presentations start at 3:30.
Codespace: set your port to **Public** and open that link on the venue laptop. Backup editor: your driver opens the team editor there and types the password (screen turned away). Judges never get a password. Keep a recording of the working demo (up to 3 minutes) on your phone as a backup; judges score what it shows.
Any teammate may present, read a script, or play the clip. Captions on.
Call it a Hackreation prototype, not an ERI product.

---

# Schedule

Source: the Meetup page, and `wiki/event/hackreation.md`

| Time | What |
| --- | --- |
| 9:00 to 9:30 | Kickoff and team formation (now) |
| 9:30 to 12:00 | Hacking |
| 11:30 to 11:45 | Backup-editor teams tell Joey |
| 12:00 to 12:45 | Lunch. Joey makes a safety copy of the backup-editor folders of teams that told him |
| 12:45 to 2:30 | Hacking |
| 2:00 to 2:15 | Backup-editor teams tell Joey again |
| 2:15 to 2:30 | Last save of backup-editor folders. A late team is saved 2:30 to 2:35 and still counts |
| 2:30 to 3:00 | New features stop at 2:30. Captains open the team pull requests. Code freeze at 3:00 |
| 3:00 to 3:30 | Demo check on the venue laptop |
| 3:30 to 4:30 | Presentations and awards |
| 4:30 to 5:00 | Photos (ask first), hand cards back, thank-yous. Ends 5:00 |

Leaving early is fine. Coming late is fine.

---

# Getting help

- Ask a teammate or neighbour first
- Stuck 15 minutes? **Raise a hand**, hold up your team card, or call out your name and "help"
- Joey (name tag: HELP) is the floating mentor
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

If ERI picks one, a volunteer helps its web team test it on a test site first.

**Let's build.**
