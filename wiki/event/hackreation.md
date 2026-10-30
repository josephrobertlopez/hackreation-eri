# Hackreation: Sat, Oct 31, 2026

**This page is the one place for event facts**: times, place, paths, help, judging and awards. Every other page links here instead of repeating them. If another page disagrees, this page wins and the other page is a bug. Challenges live in one place too: [ERI's problem statements](../../docs/eri-problem-statements.md). Rules for branches and pull requests live in [CONTRIBUTING.md](../../CONTRIBUTING.md). What to do on the day lives in [START-HERE.md](../../START-HERE.md). The backup team editors keep the copy of these pages that was frozen on Friday at 12:00; if a page there differs from GitHub `main`, GitHub wins.

**Penrod, 219 N. Milwaukee St., 2nd floor, Milwaukee**, hosted by [Mitobyte](https://www.meetup.com/mitobyte/events/316630269/) with Employment Resources, Inc. (ERI), closing event of Wisconsin Tech Month. Service animals are welcome. 

**Getting there.** Not confirmed yet: whether the 2nd floor has a step-free route or an elevator, how you get in after 8:00 (street door or buzzer), parking, transit and the Wi-Fi. Reply on the Meetup post by 5 pm Friday Oct 30; Joey answers by 9 pm Friday and updates this paragraph on GitHub `main` by then. This is the one place for venue facts; other pages link here, and the backup editors frozen at noon keep the old paragraph. If you ask, he meets you at the street door from 7:45. Lunch is provided and breakfast is coffee; say any dietary need in your reply (by 5 pm Friday).

**Theme:** Building software that connects people with disabilities to job opportunities.

## Schedule

All times are Saturday Oct 31, Central Time: 8:00 to 11:45 are the morning, 12:00 and later are the afternoon. Times come from the public [Meetup page](https://www.meetup.com/mitobyte/events/316630269/), which wins if organizers change them. The 11:30, 11:45, 2:00, 2:15, 2:30, 3:00 and 4:30 lines and "Lunch is provided" are ours, not Meetup's.

| Time | What |
| --- | --- |
| 8:00 | Doors open, coffee. Name tags and the Wi-Fi sign are on a table by the door, self-serve (there is no check-in desk) |
| 8:30 to 9:00 | Networking and mingling: meet people, find a team |
| 9:00 to 9:30 | Kickoff, team formation and announcements |
| 9:30 to 12:00 | Hacking, with a floating mentor |
| 11:30 to 11:45 | Optional, backup-editor teams only: tell Joey so he can make a safety copy at lunch, first come first served (how: [START-HERE.md](../../START-HERE.md#path-3-backup-the-team-editor)) |
| 12:00 to 12:45 | Lunch (provided). Joey saves, as a safety copy, the folder of each backup-editor team that told him at 11:30. Teams with a team fork push their own branches and need nothing from Joey |
| 12:45 to 2:30 | Hacking |
| 2:00 to 2:15 | Backup-editor teams: this is the call that counts. Tell Joey and he tells you when your last save will be; keep working until then (the lunch save is only a safety copy). A team that misses the window is saved last, 2:30 to 2:35, and still counts. Team-fork teams: merge your branches into the team branch and get ready to open the pull request. Help is thinnest from 2:00 to 3:30, so be ready by 1:45 |
| 2:15 to 2:30 | Last save of the backup-editor teams' folders, in the order teams came. Work after your last save is not in the pull request |
| 2:30 to 3:00 | Code freeze for the pull request at 3:00. New features stop at 2:30 for every team (a backup-editor team stops at the save time Joey gives it, which costs no points); this half hour is for the pull request, the README line, fixes and demo practice. Each team-fork captain opens the team's one pull request, titled `Team N: <project>`, by 3:00 and tells Joey its address at the front table; at 3:00 Joey writes each address and the pull request's latest commit on the judge sheet and judges read that commit, so nothing pushed after 3:00 is in it. Judges open the pull request's **Files changed** tab, and the project README through its **View file** link. For a backup-editor team's pull request opened after 3:00, Joey writes the commit when he opens it. Joey opens the pull requests of backup-editor teams with their drivers, in the order saved; if he has not reached you by 3:00, you are still eligible. The live demo is what is scored, and the pull request is the record. Judges walk the tables 2:30 to 3:00 and meet each team |
| 3:00 | Your team's pull request is open and frozen. A delay on Joey's side never costs a backup-editor team |
| 3:00 to 3:30 | Demo check on the venue laptop, one team at a time in the order Joey calls; one teammate goes to the laptop and then returns to the team's table. Judges do not attend demo checks: they are free (and may talk to teams) until 3:25, and take their seats near the screen by 3:25 |
| 3:30 to 4:30 | Presentations and awards |
| 4:30 to 5:00 | Photos (ask first), hand your card back, thank-yous, clean-up. Free to leave |
| 5:00 | Event ends |

**Scope to a demo you can show in about 3 minutes.** Leaving early is fine. Coming late is fine.

## Who is who

| Who | What they do |
| --- | --- |
| **Joey** | The Mitobyte host and the one floating mentor. Answers questions, approves first-time pull request checks, saves the folders of backup-editor teams and opens their pull requests with their drivers, runs the venue laptop. Wears a name tag marked HELP. Does not score. There is no backup mentor: if two people need him at once, a demo check goes first (its clock is fixed) and everything else follows the queue sheet; a pull request waiting for approval can still be read. He is busiest from 2:00 to 3:30 |
| **Organizers** | Mitobyte volunteers: the door, name tags, the queue sheet, and passing raised hands to Joey. Joey is your contact: before Saturday, reply on the Meetup post; on the day, find the HELP name tag |
| **ERI liaison** | An ERI staff member, introduced at kickoff if present and here from 9:00 to 5:00. Answers questions about benefits, billing and ERI. Also a judge. Their answers earn no extra points |
| **Developer judge(s)** | One or two developers, introduced by name at kickoff if they are there, otherwise when they arrive; in the room by 2:30 |
| **ERI expert** | A team role: any teammate who reads ERI's statements for the team. Not the same person as the ERI liaison |

The judges are named aloud when they arrive, not here.

## Paths: how you get a workspace

Teams have about six people (about 31 people expected, five teams). **There are at most five teams, and a team has at most eight people.** Extra people join a team with an open seat in an extra role (tester, writer, ERI expert), or work from their own Codespace or laptop and push a branch to the team fork. Past 40 people, Joey raises a team's cap on the day; there is no sixth team. ERI job coaches who bring the people they support count toward the 40 seats, and the fake-data and ask-before-you-photograph rules cover everyone. There are two primary doors and one backup.

| Path | Needs | Notes |
| --- | --- | --- |
| **Codespace** (primary) | A free, verified GitHub account | Your own cloud workspace from `.devcontainer/`, opened **from the team fork**. A cold start takes about 10 minutes (in three test runs on Oct 29 it took 6 to 8 minutes, and one of the three stalled for 30+), so make an account and open one test Codespace on Friday night, and create Saturday's during kickoff. If it is not Available after 10 minutes, delete it (it holds nothing yet) and use the backup editor. Run `node -v` once it opens; it should say v20 or newer |
| **Own laptop** (primary) | Git and Node 20 or newer; Python 3 to preview with `npm start` (it runs `python3 -m http.server`) | The four projects have no dependencies: `npm start` and `npm test` in the project folder. Docker is needed only for the retired folders 01 to 03 and the WordPress and php-mysql starters, and is optional. Your own tools and settings already work there. No door has been tested with a screen reader yet, so tell Joey what you find |
| **Team editor** (backup only) | A browser and your team's password. No account | For people with no GitHub account, a laptop that cannot run Node, or a Codespace not ready in 10 minutes. Team N opens `https://hack-teamN.taild76c1b.ts.net` (team 3 opens `hack-team3`). The password is on your team card. **One shared session, one driver**: only the driver edits files; anyone may open an extra terminal tab only to run `npm test` or read output. The editor image has Node 22, Python 3, PHP 8 (cli and sqlite) and git, but no `gh` and no push credentials, so it cannot reach GitHub. Its work gets out through a teammate's Codespace or laptop, or Joey saves the folder ([START-HERE.md](../../START-HERE.md#path-3-backup-the-team-editor)) |

**The team model.** At kickoff the team picks a **captain** with a GitHub account. The captain forks the repo, adds teammates as collaborators on the fork, and everyone opens a Codespace or clones **from the team fork**. Everyone works on branches in the fork (names: [START-HERE.md](../../START-HERE.md#branch-names)); the captain merges them into the team branch and opens **one** pull request to `josephrobertlopez/hackreation-eri`, titled `Team N: <project>`, by 3:00. Steps: [START-HERE.md](../../START-HERE.md).

No device? No problem. Roles that need only paper, a phone or an iPad are in [START-HERE.md](../../START-HERE.md). Passwords are never in this repo: they are written on the team cards and handed out at team formation. Each team runs only its own editor, so teams never share a port.

## Forming a team (9:00 to 9:30)
- At 9:00 Joey reads out teams 1 to 5 and their tables (there is no team list page; the number and table are printed on each team card), and people place themselves: sit at any table (6 to 8 people per table) and take that team's card. Joey moves people if a table is full or has no one who can run the hello world. If fewer people come, Joey drops the highest-numbered teams (never one that a screen reader replier was given). If more than 40 come, he raises a team's cap on the day; there is no sixth team.
- Mix roles. Each team needs one person who can run the hello world and one who owns plain language and accessibility testing (no code needed).
- Pick your project by agreement in your team. There is no limit per project, and you may switch whenever you like: your project is the one folder your pull request changes (two folders and CI fails it). A backup-editor team says its project at the 2:00 call.
- Roles: captain, navigator, designer, writer, tester, ERI expert, presenter, WordPress lead (see [START-HERE.md](../../START-HERE.md)). The captain forks the repo, adds teammates and opens the team's pull request. The driver is whoever types on the backup editor; it can change during the day. Every team card has a role line to fill in.
- First hackathon? Join a team with a working developer. Ask anything.
- Don't hand accessibility to a teammate with a disability by default. Ask everyone what they want to work on.
- Teams pick one challenge at the kickoff. The old folders `challenges/01-...` to `03-...` are retired; ignore them. Come after team formation? Look for the sign by the door that lists teams with an open seat.

## Challenges

These are ERI's own four projects, in ERI's words: [docs/eri-problem-statements.md](../../docs/eri-problem-statements.md). ERI's sentence "Anyone may attempt one or more" is about the whole event: **each team picks one project today** and sends one pull request. Several teams may pick the same one. Attempts are compared, not merged ([CONTRIBUTING](../../CONTRIBUTING.md)). A team's pull request changes one project folder; a handoff between projects (for example a P1 portfolio file feeding P4) may be shown as a JSON file inside your own project's folder.

| | Project | Product type (ERI's words) | PRD | Code |
| --- | --- | --- | --- | --- |
| **P1** | Show Your Skills | Accessible digital skills portfolio | [PRD](../prds/p1-show-your-skills.md) | [code](../../challenges/p1-show-your-skills) |
| **P2** | My Workday Assistant | Accessible workplace task and routine support tool | [PRD](../prds/p2-my-workday-assistant.md) | [code](../../challenges/p2-my-workday-assistant) |
| **P3** | Job Coach Connection | Accessible employee and job coach communication tool | [PRD](../prds/p3-job-coach-connection.md) | [code](../../challenges/p3-job-coach-connection) |
| **P4** | Employer Opportunity & Support Hub | Employer decision-support and workplace accessibility tool | [PRD](../prds/p4-employer-hub.md) | [code](../../challenges/p4-employer-hub) |

Each project folder already runs: `npm start` and `npm test`, no install. Ports and preview addresses: [START-HERE.md](../../START-HERE.md#ports-and-preview-addresses).

**Known gaps in the hello worlds** (the two main ones, so nobody rediscovers them; each project README lists the rest. Not all four have been opened in a real browser yet, so open yours first and tell Joey if it does not load): P2 has no screen to create a task and no reminders yet. The P4 default loads a candidate profile instead of having the employer type the skills; its folder README explains why, and the ERI liaison knows. A team may keep it or switch to ERI's literal step; both are fine. Gaps that a project's README lists as not built are not penalised in any project. If a line in P1 to P3 looks different from ERI's PDF, ERI's words win; Joey holds the PDF and the ERI liaison settles any doubt.

## Getting help
- **In the room:** ask a teammate or a neighbour first. Stuck for 15 minutes? Raise a hand, hold up your team card, or call out your name and "help". Joey is the floating mentor ([who is who](#who-is-who)). From 9:30 to 9:50 he is with the screen reader group, so an organizer takes your hand and the fix sheet in [START-HERE.md](../../START-HERE.md#fix-sheet-the-errors-we-expect) covers the usual errors.
- **Announcements:** the comments on the [Meetup event page](https://www.meetup.com/mitobyte/events/316630269/) carry links and announcements. Posting there needs a Meetup account, so do not rely on it to ask for help; on the day, tell any organizer at the door. Urgent notices (for example Wi-Fi down) are also said aloud and written on the sheet at the front table.
- Ask the ERI liaison about benefits, billing or ERI itself. The liaison is also a judge, so questions and answers go on the front-table sheet where the whole room can read them.
- Headphones are welcome. Need quiet, captions or a text copy of anything? Ask Joey or reply on the Meetup post. Joey replies there with a plain text file (schedule, help, Wi-Fi) by 7:30 on Saturday.
- Screen reader users: tell Joey or reply "Screen reader". Everyone who asks sits together with Joey in one session, 9:30 to 9:50, at a table he names aloud at kickoff and writes on the front-table sheet; joining is optional, and your teammates do the captain steps while you are there. Joey replies to your "Screen reader" message with a table and a suggested team number before Saturday; the table is on the sign by the door, and you may join any team. Start on your own laptop, where your own tools and settings already work.

## Awards
| Award | Decided by |
| --- | --- |
| **The Golden Byte** | The highest weighted judge total. Eligible: a demo, whichever of P1 to P4 the team picked, and a pull request that Joey has the address of before 3:30. Open it by 3:00; if yours is late (a dead laptop, a slow Codespace) it still counts when Joey has the address before 3:30, and Joey writes the commit when he sees it. A backup-editor team tells Joey before 3:30. Being late never costs a team its demo, People's Choice or the Best-in awards, and a delay on Joey's side never costs any team. A recording counts as the demo; no demo means no Golden Byte. A red check does not matter. Ties: see Judging |
| People's Choice | The room, by a show of hands after the last demo, before the totals are read out. Each person raises a hand once and Joey counts. Nobody votes for their own team. A tie is settled by a second show of hands between the tied teams |
| Best in Design, Best in Innovation, Best in Teamwork | The judges agree together while the last totals are added: the team with the most judge nominations wins, and the ERI liaison settles a tie |

Judges hand Joey each team's score page right after that team's slot, so he adds as they arrive (on a calculator, from the judge sheet) and only the last page is left at the end. The People's Choice show of hands and the totals both fall in the 4:20 to 4:30 window, with Joey as host. With five teams the last slot ends at 4:20 and awards are named 4:20 to 4:30; with fewer teams the later slots move earlier.

## Judging

Judges: the ERI liaison and one or two developer judges. Joey hosts and does not score. **Rubric version: draft as of Thu Oct 29; Joey changes "draft" to "final" after the Fri Oct 30, 6 pm confirmation with the ERI liaison.** Any change after that is posted in the Meetup comments and here. Each judge scores only the rows they own, 0 to 5 per row (0 = nothing, 3 = works with gaps, 5 = we would use it). When two judges own a row, the row score is their average, to one decimal. Presentation is the mean of all judges' scores, to one decimal. A team's weighted total is the sum over the rows of (row score / 5) x weight, so the most it can be is 100. Tie order: higher "Solves ERI's problem", then higher "Works end to end", then Joey flips a coin. Joey prints a judge sheet with this table and score boxes. Judges never get a team password. If no developer judge comes, the ERI liaison scores their two rows too and also applies the README cap. If the liaison is absent, Joey names a stand-in before 2:30: another ERI staff member or a developer judge, never Joey. If GitHub is not reachable at the venue, the judge sees the README line in the team's demo on the venue laptop; Joey has it open.

| Criterion | Weight | Looks like | Scored by |
| --- | --- | --- | --- |
| Solves ERI's problem | 30% | An ERI staffer says "we'd use that" | ERI liaison |
| Accessible | 25% | Keyboard and screen reader pass ([checklist](../domain/accessibility.md)). The judge's evidence: the demo shows keyboard-only use, the team says which screen reader it used and what its tester found, and the judge may ask for one keyboard action live. With a recording, the clip and the team's tester report are the evidence. A team with no screen reader that did a keyboard pass and says so honestly still scores on the rest of the row | Developer judge |
| Works end to end | 20% | A live demo on synthetic data, not slides | Developer judge |
| ERI could adopt it | 15% | Built on the [recommended stack](../company/tech-stack.md) (plain HTML, CSS and JavaScript that could be pasted into WordPress), no paid services, a README that names the run commands (`npm start` and `npm test`), and a clear "What ERI would need" line (see below) | ERI liaison gives the 0 to 5 from the line; a developer judge reads the README on the pull request page, and a "no" (the README is missing, wrong, or needs paid services) caps this row at 2. Either developer judge may apply the cap; a capped row scores the lower of the liaison's score and 2 |
| Presentation | 10% | Clear in 3 minutes | All judges |

## Rules
1. Synthetic data only ([privacy](../domain/privacy-and-data.md)). Say "All data in this demo is fake" at the start of your demo.
2. Work in your project folder, so CI runs. Branch in the team fork. One pull request per team, titled `Team N: <project>`, opened by the captain by 3:00 (Joey opens a backup-editor team's with its driver from 2:30) ([CONTRIBUTING](../../CONTRIBUTING.md), section 5).
3. Code is MIT licensed ([LICENSE](../../LICENSE)), so ERI and anyone can reuse it.
4. Be kind. Everyone starts somewhere.

## Presentations (3:30 to 4:30)
Each team gets a 10-minute slot: 3 for the demo, about 2 for questions, the rest to switch. Joey checks "All data in this demo is fake" at the 3:00 demo check, and a judge stops any demo that shows real data. Awards close the hour. Demos run from the **venue laptop** on the projector, so judges never need a login (how: [START-HERE.md](../../START-HERE.md#show-a-demo-from-the-venue-laptop); a Codespace port set to Public also works). Judges see the live demo; the pull request is the record. Any teammate may present or read a script. A live demo is preferred; a recording of the working demo (up to 3 minutes) is the fallback, and judges score what it shows. Showing from your own laptop is allowed (Joey has USB-C and HDMI adapters). No path costs points, except that judges can score "Works end to end" only on what they see work. Captions on.

Demo template (3 minutes):
1. **Who** it's for and their problem (20 sec)
2. **Live demo** on synthetic data (2 min)
3. **What ERI would need** to adopt it (20 sec). Say it aloud and add it to your project README (where: [START-HERE.md](../../START-HERE.md#one-team-pull-request), answer 5). The developer judge reads the README on the pull request page during questions
4. **Accessibility** you tested (20 sec)

## After the event

Your code stays in your team's pull request. On Sunday Nov 1 Joey sends the ERI liaison one pull request link per team. ERI reviews every project and decides; it does not promise to adopt, host or support any of them. Winners go on the Meetup page.
