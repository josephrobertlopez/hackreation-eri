# Hackreation: Start Here

Welcome. Not a coder? You have a full role today. Want to leave early? That is fine, and so is arriving late.

Today we build software that connects people with disabilities to jobs, with ERI (Employment Resources, Inc.). Joey and the Mitobyte hosts are the floating mentors (Joey's name tag: HELP). Times, place, help and judging are on the [event page](wiki/event/hackreation.md). The four projects are in [ERI's problem statements](docs/eri-problem-statements.md). Each is the only copy, so this page links to them instead of repeating them. The old folders `challenges/01-...` to `03-...` are retired: ignore them.

## The four projects and where you can work (short version)

Full tables, with who each project helps and links to ERI's exact words: [the four projects](wiki/event/hackreation.md#the-four-projects) and [where you can work](wiki/event/hackreation.md#where-you-can-work) on the event page.

- **P1 Show Your Skills**: a portfolio of words, pictures, audio or video to show what a person can do. Folder `challenges/p1-show-your-skills`, port 8000.
- **P2 My Workday Assistant**: step-by-step task guides with pictures, text, audio and reminders. Folder `challenges/p2-my-workday-assistant`, port 8002.
- **P3 Job Coach Connection**: an employee asks their job coach for help, the coach answers. Folder `challenges/p3-job-coach-connection`, port 8003.
- **P4 Employer Opportunity & Support Hub**: turns a candidate's skills into workplace tasks and gives employers plain guidance. Folder `challenges/p4-employer-hub`, port 8000 (same as P1).
- All four are plain HTML, CSS and vanilla JavaScript with zero dependencies. In the project folder: `npm start`, open `http://localhost:PORT/web/`, and `npm test` (passed if it ends with `# fail 0`). ERI's words: [docs/eri-problem-statements.md](docs/eri-problem-statements.md).

Three doors: a **Codespace** (a free verified GitHub account and a browser; usually ready in about 2 minutes), **your own laptop** (git, Node 20 or newer, Python 3), and the **5 backup VS Code instances** (one per team at `hack-team1` to `hack-team5` `.taild76c1b.ts.net`, the team password is on your card, one shared session and one driver, no account needed; the safety net if a Codespace or laptop fails).

## Pick your path

Most people use path 1 or 2. Path 3 is the backup, so nobody is left out.

### Which door

| You | Use |
| --- | --- |
| Have a GitHub account and a laptop with a browser | Path 1, a Codespace. Start it right away |
| Have git, Node 20 or newer and Python 3 on your laptop already, or use a screen reader | Path 2, your own laptop. It keeps your own tools and settings |
| Your laptop has no Node, or you cannot install it (no admin rights) | Path 1: a Codespace needs only a browser |
| No GitHub account | Make one (free, a phone works), or join a team that has one and take a role below. A team with nobody who can make an account, or whose Codespace or laptop failed, uses its team editor (Path 3, the backup) |

### Path 1: Codespaces (a free GitHub account, any laptop with a browser)

A Codespace is a coding workspace in your browser. The default one is a slim image with Node 20, Python 3 and git: enough for P1 to P4, but **no PHP and no Docker**. It was ready in about 76 seconds in 4 of 5 test creates (one did not start) (the older, larger image took 6 to 8 minutes or stalled; numbers on the [event page](wiki/event/hackreation.md#paths-how-you-get-a-workspace)). **If yours is not ready after 10 minutes, delete it and use path 3** (screen reader users: your own laptop, path 2).

**Need PHP, Docker or WordPress** (for example the WordPress lead's `php tests/smoke.php`)? Create that Codespace with the full configuration: on the team fork press **Code**, **Codespaces**, the **...** menu, **New with options**, and set **Dev container configuration** to **full**. It starts slower, so create it at kickoff. Or use the team editor, whose image is documented to have PHP 8 (check with `php -v`).

**Friday night (10 minutes, worth it):**
1. Make a free account at https://github.com/signup and verify your email. The sign-up has a puzzle; choose the audio option.
2. Open https://github.com/josephrobertlopez/hackreation-eri, press **Code**, **Codespaces**, **Create codespace on main**. Wait for files on the left and a terminal at the bottom. Run `node -v`: it should say v20 or newer. That proves your account and the 10-minute start only; Saturday's Codespace is opened from the team fork. Do not commit in this test Codespace. If GitHub offers to make your own copy (a fork), accept: that is normal. A free account has a monthly Codespaces allowance (see the billing page linked from [docs/PREP-CHECKLIST.md](docs/PREP-CHECKLIST.md)); delete the test Codespace when you have seen it work. This test cannot prove Saturday's steps (a collaborator invite, a Codespace opened on someone else's fork): nobody has tried those yet. Leave it; it sleeps on its own. If it made a fork and you become captain: open that fork, press **Sync fork**, **Update branch**, check it holds none of your own commits, and write its exact address on the card. Stray commits? Delete it (Settings, Delete this repository) and fork again.

**Saturday, at kickoff (do not wait for the end of kickoff):**
1. Your team picks a **captain**: anyone with a GitHub account, best the person most comfortable with git (if that is not the captain, the navigator runs the merge commands in step 6). The captain opens the repo above and presses **Fork**, then **Create fork**. That is the **team fork**; its address is `github.com/<captain's name>/hackreation-eri`. The captain writes it on the team card.
2. The captain opens the fork's **Settings**, **Collaborators**, **Add people**, and adds each teammate by GitHub username.
3. Each teammate accepts the invite (email, or the **Invitations** page of the team fork; check your spam folder). No account yet? Make one now at https://github.com/signup (a phone works; choose the audio puzzle option), or take a non-coding role and let a teammate share their screen.
4. Everyone, captain included, opens **the team fork's page**, then **Code**, **Codespaces**, **Create codespace on main**. Do this right away and keep going while it starts. Do not open it from the main repo: it will ask you to fork again.
5. In the Codespace terminal: `cd challenges/p<n>-...` for your project, then `npm start` and `npm test`. Ports are in the table below.
6. Work on your own branch (names below): `git fetch origin`, then `git switch -c attempt/N/p<n>-<yourname> origin/main` (start from `origin/main`, so your pull request carries only your project). Commit, then press **Publish Branch** (on a terminal: the push with `-u origin <your branch>`). The captain builds the team branch from these: [One team pull request](#one-team-pull-request), step 1.

#### Branch names

N is your team number (join late? use the team you joined). This is the only table of them. N (your team) and `p<n>` (your project) are different numbers: type the real digits, never the letters. Example: Priya is on team 2 and builds P4. Hers: `git switch -c attempt/2/p4-priya`. The team's: `attempt/2/p4-employer-hub`.

| Branch | Name |
| --- | --- |
| Yours | `attempt/N/p<n>-<yourname>` |
| The team's (the pull request's head) | `attempt/N/<project folder>`, for example `attempt/2/p4-employer-hub`. Any name starting `attempt/N/` also works. Joey names a backup-editor team's saved branch the same way |

### Path 2: Your own laptop

You need **git**, **Node 20 or newer** (https://nodejs.org) and a browser. `npm start` runs `python3 -m http.server`, so you also need Python 3 to preview a page; `npm test` needs only Node. The four projects have no dependencies. Check your versions: `node -v` (v20 or newer), `python3 -V` (Windows: `py -V`), `git --version`. **No admin rights, or an install not finished in 20 minutes? Stop and use a Codespace (path 1): it needs only a browser.** Choices that need no admin (not verified on a locked-down laptop): Node as the `.zip` download from https://nodejs.org/en/download, the VS Code **User Installer**, and the current-user option of Git for Windows. To send your work to the team fork you also sign in to GitHub once: `gh auth login`, then `gh auth setup-git`. Windows and Mac details, and that sign-in step: [docs/PREP-CHECKLIST.md](docs/PREP-CHECKLIST.md#option-b-your-own-laptop-primary).

```
git clone https://github.com/<captain's name>/hackreation-eri
cd hackreation-eri/challenges/p<n>-<folder>
npm start
npm test
```

Clone **from the team fork** once the captain has made it and added you (same steps 1 to 3 as path 1). Copy the address from your team card (the captain's repo name may differ from the one below). Until then you can clone the main repo to look around; if you did, no re-clone is needed: run `git remote set-url origin https://github.com/<captain's name>/hackreation-eri`, check with `git remote -v`, then send your branch with `git push -u origin <your branch>`. On Windows `npm start` does not work: see [Ports](#ports-and-preview-addresses). Use the folder for your project:

| Project | Folder | `npm start` serves | Open |
| --- | --- | --- | --- |
| P1 Show Your Skills | `challenges/p1-show-your-skills` | port 8000 | http://localhost:8000/web/ |
| P2 My Workday Assistant | `challenges/p2-my-workday-assistant` | port 8002 | http://localhost:8002/web/ |
| P3 Job Coach Connection | `challenges/p3-job-coach-connection` | port 8003 | http://localhost:8003/web/ and http://localhost:8003/web/coach.html |
| P4 Employer Opportunity & Support Hub | `challenges/p4-employer-hub` | port 8000 (its README) | http://localhost:8000/web/ |

Leave `npm start` running in one terminal and run `npm test` in a second. P1 and P4 both use port 8000, so stop one before starting the other. Make a branch as in path 1, step 6 (names: [Branch names](#branch-names)), then send it with `git push -u origin <branch>` (the VS Code **Publish Branch** button does the same). Screen reader users: start on your own laptop, where your own tools and settings already work.

### Path 3: Backup, the team editor

Use it only if your team has **nobody who can make a GitHub account**, your **laptop cannot run Node**, or your **Codespace is not ready in 10 minutes**. It is a VS Code in your browser, shared by your team.

1. Your team card has a team number, a password and an address: `https://hack-teamN.taild76c1b.ts.net`. Team 3 opens `hack-team3`. Any browser, no account (on a phone the editor is hard to use: phone users take a role below and let the driver type). One password per team, the same for everyone on it; a spare card has none, so a teammate tells you. Joey changes all five after the event. The editor holds the repo as it was on Friday noon: for the rubric and venue facts, GitHub's event page wins.
2. Type the password. Open a terminal (Terminal, then New Terminal) and your project's folder.
3. **One shared session, one driver.** Only the driver edits files; swap every so often. Anyone may open an extra terminal tab only to run `npm test` or read output. Everyone else tests, writes, designs and reviews.
4. **Getting its work to GitHub:** the editor holds Friday's copy of the repo and cannot push. If a teammate has a Codespace or laptop, download the changed files from the editor (right-click in the file list, **Download**; this needs a computer, not a phone) and the teammate copies them into their copy and commits them. If your whole team is on the editor, tell Joey between 2:00 and 2:15 (hold up your card and say your team number and project); that call is the one that counts; say your "What ERI would need" line to Joey then too. A call at 11:30 to 11:45 is optional and only buys a safety copy at lunch. Joey tells you when your last save will be; stop new work then, which costs no points. He saves your project folder and opens the pull request with your driver after your save (best effort: the save steps have not been rehearsed yet, so a teammate with a laptop or Codespace is the safer route). A team that misses the call is saved 3:00 to 3:10 and still counts. Only `challenges/p<n>-...` is saved; work after your last save is not in it.

**Stuck?** Ask a teammate or a neighbour. Still stuck after 15 minutes? **Raise a hand, hold up your team card, or call out your name and "help"**, and Joey comes. Cannot see the room? Call out Joey, or ask the first person you meet; any teammate will fetch him. Cannot read the card? Tell Joey, or reply "Screen reader" on the Meetup post before Saturday, and he sends you the table, Wi-Fi and notes-doc link as text. Announcements and links: the comments on the [Meetup event page](https://www.meetup.com/mitobyte/events/316630269/). Who is who: the [event page](wiki/event/hackreation.md#who-is-who).

**Your card and the front table.** Your team card has your team number, your table, the team editor address and password, the notes doc link and the Wi-Fi. A spare card has no password: ask a teammate for it and write it on the card. The front table holds the spare cards, the sign for teams with an open seat, the sheet for urgent notices and the queue sheet where Joey writes the team number of each raised hand.

## Not a coder? Your tasks

You are a full member of a team. You need only your device or paper. Pick a role at team formation, then do the first task.

| Role | Tool | First task, then the next |
| --- | --- | --- |
| **Captain** | A GitHub account | Makes the team's copy of the project (the fork), adds teammates, and sends the final pull request. No code skill needed; the navigator can run the git commands |
| **Navigator** | Any device | Reads the steps aloud and runs the git commands for the driver |
| **Designer** | Paper and a pen, an iPad (Freeform or Notes), or Figma free in a browser | Sketch the 3 screens a person sees, in order, and photograph them. Then check the team's page for contrast, text size and zoom |
| **Writer** | Any device, in the team notes doc | Write the plain words for buttons and help text (about a 6th-grade reading level). Then the 3-minute demo script |
| **Tester** | Any device, a keyboard if you have one | Try the team's page with the keyboard only (Tab, Enter), at 200% zoom, and with a built-in screen reader (iPad VoiceOver, Chromebook ChromeVox, Windows Narrator with Win+Ctrl+Enter, or NVDA if it is installed, Mac VoiceOver with Cmd+F5). Open the page a teammate is running in its own browser tab (a Codespace port, `localhost` on their laptop, or the editor's preview address) and test that tab; on a phone or iPad, a teammate sets the port Public and shares the address ([Show a demo](#show-a-demo-from-the-venue-laptop), step 1). P3 has two screens (employee and coach) that talk only inside one browser, so a phone shows just one of them: test P3 on one laptop. Write down what failed, in words |
| **ERI expert** | Any device | Read the team's project in [ERI's statements](docs/eri-problem-statements.md). Check the team is building what ERI asked, and that no real data is used |
| **Presenter** | Any device, plus a phone to record | Own the demo story and the "What ERI would need" line (where it goes: [One team pull request](#one-team-pull-request), answer 5). Rehearse it twice. Record the working demo, up to 3 minutes, as a backup |
| **WordPress lead** | A laptop | ERI's web team runs WordPress, so you know what they could adopt. Write the team's "What ERI would need" line with the presenter (how it could become a WordPress block or plugin). Code is optional: copy the starter `starters/wordpress-plugin` into your challenge folder (CI fails changes outside it) and run `php tests/smoke.php` there. The default Codespace has no PHP: create it with the full configuration ([Path 1](#path-1-codespaces-a-free-github-account-any-laptop-with-a-browser)) or use the team editor (documented to have PHP 8; check with `php -v`). A laptop may not have PHP either. Seeing it inside a live WordPress is not promised today |

**Getting your work to the team.** The team has a notes doc, a shared Google Doc (the link is on your team card; anyone with the link can edit, so no personal data and no photos of people). Paste text and links there. No Google account, or would you rather not? Write it on paper and leave it in the pile on your table; a teammate types it in. A photo of a paper sketch can be emailed to yourself and dropped in the notes doc. A teammate with a Codespace or laptop adds anything that belongs in the project. Screen reader users: in Google Docs press Ctrl+Alt+Z to turn on screen reader support, and ask Joey to send you the notes-doc link as text.

**Plain words.** A *fork* is your team's own copy of the project. A *branch* is your own copy of the work inside it. A *pull request* is how your team sends its work to the judges. **Publish Branch** uploads your branch to the fork. The *captain* is the teammate with a GitHub account who forks the repo and opens the team's pull request. A *collaborator* is a teammate the captain has invited to the fork so they can push to it. A *Codespace* is a coding workspace that runs in your browser. A *port* is the number after the colon in a local web address (`localhost:8000`); a *Public* port can be opened by anyone with the link. *CI* is the automatic check GitHub runs on a pull request. The *team editor* is the backup VS Code in the browser, and its *driver* is the one person who types in it; in a Codespace or on a laptop, any teammate may type. The *navigator* is the teammate who reads along and runs the git commands.

**Phone, iPad or Chromebook?** Great for design, notes and testing. A phone cannot write code well. A Chromebook can open a Codespace in its browser if you have a GitHub account; sign in to nothing you cannot sign out of.

**Never done this?** Pick a role from the table and say it to your team. That is all it takes.

## Ports and preview addresses

Run a project from its folder with `npm start` and `npm test`. `npm test` prints a lot; it passed if the last lines say `# fail 0`. Work only in `challenges/p1-...` to `challenges/p4-...`: the folders `challenges/01-...` to `challenges/03-...` are retired and are not this event's challenges. Then open the page:

| Project | Port | Path | Notes |
| --- | --- | --- | --- |
| P1 | 8000 | `/web/` | |
| P2 | 8002 | `/web/` | `npm start` serves the whole project folder (the app needs `../fixtures/`); open `/web/` |
| P3 | 8003 | `/web/` and `/web/coach.html` | Two tabs of the same browser: employee and coach. They talk through that one browser, so two devices cannot reach each other |
| P4 | 8000 | `/web/` | Same port as P1 |

- **Codespace:** open the forwarded port from the **Ports** tab (the globe icon). Keyboard: Ctrl+Shift+P, type `Ports: Focus on Ports View`, arrow to the port, Enter.
- **Windows without `python3`:** python.org installs `py`, not `python3`, so `npm start` fails (`python3` may even open the Microsoft Store). In the project folder run `py -m http.server PORT` instead (P1 and P4 8000, P2 8002, P3 8003) and open the same `/web/` address. `npm test` still works.
- **Own laptop:** `http://localhost:PORT/web/`, for example `http://localhost:8003/web/`.
- **Team editor:** your team address plus `/proxy/PORT/web/`, for example `https://hack-team3.taild76c1b.ts.net/proxy/8003/web/`. Each team has its own editor, so teams never clash.
- **Port 8000 in use** (P1 and P4 share it, so two teammates on both collide): in the project folder run `python3 -m http.server 8010` (for example P4 as the second one: `cd challenges/p4-employer-hub && python3 -m http.server 8010`), then open `http://localhost:8010/web/`, or in the editor `/proxy/8010/web/`. In a Codespace a new row for 8010 appears in the Ports tab (the label there says P1 / P4 only for 8000); open that row.
- **Public Codespace port:** a visitor first sees a GitHub page titled "You are about to access a development port served by someone's codespace" with a **Continue** button. That is normal, not an error: press Continue and the app opens. It asks once per browser.

## If you have done this before

You are the navigator, not the driver. Handing the keyboard back is the job.

- **Extend, do not rebuild.** P1 to P4 already run and have tests. The recommended stack is plain HTML, CSS and JavaScript that could be pasted into WordPress as a block or shortcode: no install, no framework. The starters are optional.
- **ERI cannot use:** real data, a disability or diagnosis field, scoring or ranking people, paid services, anything that needs a login.
- **Useful work for you:** run `bash tools/run_project_suite.sh challenges/p<n>-...` for your project; write a red check for a change; do the human checks listed in your project's spec folder; review a teammate's change; audit the page with the keyboard.
- **The biggest rubric row** (30 of 100) is "solves ERI's problem", not code cleverness. Gaps that a project README lists as not built are not penalised.
- **Why a fork?** Judges must see one entry per team, and nobody gets write access to the main repo. The fork gives the team one shared place with real git history. Branch names and the rest: [CONTRIBUTING.md](CONTRIBUTING.md).

## Arriving late? Leaving early?

- **Late, any time, even after lunch:** walk in. Ask the person at the door or Joey which teams have an open seat (there is also a sign by the door). The Wi-Fi name and password are on the sign and on your team card; ask if you cannot see them. Take a spare card from the front table. Read the team notes doc first (5 minutes), then take a role or a task. Have a GitHub account? Give the captain your username and open a Codespace from the team fork (path 1, steps 3 and 4). No account or laptop? Join in a role, or use the team's backup editor with the driver.
- **Leaving early:** tell your team, put anything unsaved in the notes doc or publish your branch, and go. Nothing is lost by leaving.

## One team pull request

Your team sends **one** pull request to the main repo, titled `Team N: <project>`, for example `Team 3: Job Coach Connection`, **opened any time before 3:30** (it can keep being updated until 3:30; we suggest opening it by 3:00 so its checks finish; confirm with Joey). Hacking runs to 3:30; the demo check (3:00 to 3:30) runs alongside it. The rules are in [CONTRIBUTING.md](CONTRIBUTING.md), section 5.

1. The captain builds the team branch in the Codespace or clone, in this order: `git fetch origin`, `git switch -c attempt/N/<project folder> origin/main`, then `git merge --no-edit origin/<teammate's branch>` for each teammate, then the first push of it with `-u origin attempt/N/<project folder>` ([Branch names](#branch-names)). The pull request's head is that team branch; CI does not read branch names ([CONTRIBUTING.md](CONTRIBUTING.md), section 3). Only your project folder `challenges/p<n>-...` may change, or CI fails the pull request.
2. On the team fork's page, press **Compare & pull request** next to the team branch (or open **Contribute**, **Open pull request** and pick the team branch in the head dropdown; it defaults to `main`). The base is `josephrobertlopez/hackreation-eri`, branch `main`. Set the title to `Team N: <project>`. (The fork's `main` also works as the head if it holds only your project folder's changes, but the team branch is easier for Joey to find.)
3. Fill in the form with five answers from your notes doc:
   1. Project: P1, P2, P3 or P4.
   2. The feature (F) or user story (US) IDs your team added, changed or tested, from `docs/eri-backlog.md` (search it for your project number, such as `P2-`): at least one, like `P2-F4` or `P2-US2`. An ID you only tested counts; if you built nothing new, claim one you tested and say so in answer 4.
   3. Tick the first three boxes in section 5: no field asks for a disability or diagnosis; nothing scores or ranks candidates; no automated hiring or accommodation decision.
   4. One sentence on what a person who did not write it found when they tried it, under section 4.
   5. Your "What ERI would need" line, on the labelled line in section 1. Also replace the placeholder `What ERI would need:` line, the first line under the title in your project's `README.md` (built only a note or a recording? it goes there anyway), because the judge reads that README on the pull request page. Leaving the placeholder in place caps the "ERI could adopt it" row at 2; "wrong" means the run commands do not work as written (event page, Judging).
4. Tell Joey the pull request's address at the front table (before 3:30; by 3:00 is the aim; late rules: Awards on the event page). If a check says it is waiting for approval, Joey approves it. The checks are informational today: a red check never disqualifies a team and is not a score row, so spend your last minutes on the demo.

**A team that is only on the backup editor** does not open a pull request: Joey does, with your driver (Path 3, step 4).

First commit says "tell me who you are"? Run `git config --global user.name "Your Name"` and `git config --global user.email "you@example.com"`.

## Screen reader in a Codespace or the editor

Nobody has tested a screen reader in a Codespace or in the team editor yet (event page), so treat this as a starting point. The keys below come from VS Code's documentation, not from a test here (Alt is Option on a Mac).

- **Ready** means the page title shows your repo name and Ctrl+backtick lands you in a terminal that reads out a prompt. A visual file list is not the test.
- Shift+Alt+F1 toggles screen reader mode (VS Code often turns it on by itself); Alt+F1 opens Accessibility Help for the part you are in.
- Ctrl+backtick focuses the terminal. Ctrl+J shows or hides the bottom panel. F6 moves between regions. Ctrl+Shift+P opens the command palette.
- It does not work for you? Use your own laptop (path 2).

## Show a demo from the venue laptop

From 3:00 to 3:30, alongside hacking, each team brings its demo to the venue laptop, one at a time. Joey calls you. **Judges never get a team password and never need a login.**

1. **Codespace:** open the **Ports** tab, right-click your port, **Port Visibility**, **Public** (by keyboard: Ctrl+Shift+P, `Ports: Focus on Ports View`, arrow to your port, Shift+F10 or the Menu key for the context menu, then **Port Visibility**, **Public**; the same menu can copy the address), and open that link on the venue laptop. At your 3:00 to 3:30 demo check, open it once on the venue laptop and press **Continue** on GitHub's warning page, so the judges go straight to your app. Public means anyone with the link can open it, so fake data only. A Codespace sleeps when idle and a sleeping one closes its ports: before your demo check, reopen it at https://github.com/codespaces, run `npm start` again and check the link still opens (set the idle-time setting before creating the Codespace: [docs/PREP-CHECKLIST.md](docs/PREP-CHECKLIST.md#option-a-a-codespace-primary)). A school or work GitHub account may block Public ports: use a personal account or your own laptop.
2. **Your own laptop:** show your screen. Joey has USB-C and HDMI adapters; bring your own only for an unusual port.
3. **Backup editor:** your driver opens the team address on the venue laptop and types the password with the screen turned away from the room. Start the app, open the preview address, then leave the tab open and minimise it. Close it afterward.
4. **Any path:** keep a recording of the working demo on your phone, up to 3 minutes. If the live demo fails, play it; judges score what it shows. Sound (for example P2 audio) comes from the browser on the venue laptop: test it at the demo check.

A live demo is preferred; the recording is the fallback. No path costs you points, except that judges can score "Works end to end" only on what they see work. Start your demo with "All data in this demo is fake." Any teammate may present or read a script. Captions are on.

## Fix sheet: the errors we expect

| What you see | Try this |
| --- | --- |
| Account sign-up has a puzzle or will not finish | Choose the audio option. Still blocked? Call out Joey's name; use path 3 for now |
| Codespace stays on "Provisioning", or is not ready after 10 minutes | Delete it (it holds nothing yet) and use path 3 (screen reader users: path 2, your laptop). Do not make a second one |
| Codespace is slow to start, or `node -v` says older than 20 | Your fork may be older than the slim image. Open the team fork, press **Sync fork**, **Update branch**, then create a new Codespace (delete the old one only if it holds nothing) |
| The creation log shows red text or "SKIPPED" lines about PHP, WordPress or challenges 01 to 03 | Expected on the slim default: it has no PHP. If files appear and `node -v` says v20 or newer, ignore it |
| Codespace says creation had errors | If files appear on the left and a terminal at the bottom, keep going, but the setup step can fail quietly: run `node -v`; v20 or newer means fine. If not, delete it and use path 3 |
| The collaborator invite is not accepted | Teammate: check your email, or open the team fork's address and look for the yellow invite banner. Captain: Settings, Collaborators shows "Pending"; send the invite again |
| It asks you to fork, or says you cannot push | You opened the main repo, not the team fork. Delete the Codespace and open one from the team fork's page. On a laptop, `git remote -v` must show the team fork. If it shows the main repo, run `git remote set-url origin https://github.com/<captain's name>/hackreation-eri` (copy the address from the team card), check with `git remote -v`, then send your branch again with `git push -u origin <your branch>`; no re-clone is needed |
| Port preview shows "not found" or asks for a login on the venue laptop | In the Ports tab, make the port **Public**. Check the app is still running in the terminal |
| `npm start` says the address is in use | Another project is still running on that port. Press Ctrl+C in the terminal that started it. Still stuck: use port 8010, see [Ports](#ports-and-preview-addresses) (in a Codespace it appears as a new row in the Ports tab) |
| `npm start` says `python3` is not found | On Windows this is expected: use `py -m http.server PORT`, see "Windows without `python3`" in [Ports](#ports-and-preview-addresses). Elsewhere install Python 3 (https://www.python.org/downloads/) |
| `npm test` says node is not found, or node is older than 20 | Install Node 20 or newer from https://nodejs.org. No admin rights, or not done in 20 minutes? Stop and use a Codespace |
| "Permission denied" or "tell me who you are" on a push | Run the two `git config` lines above, and check you were added as a collaborator. Then raise a hand |
| Two people changed the same file | Pick one version, copy the rest by hand, commit. Talk before you merge. On the shared editor this cannot happen: there is one driver |
| Preview is blank | Is the app still running in the terminal? Run `npm start` again. Check the port |
| A strange text screen opened and nothing reads out | Type `:q!` then Enter (vim), or Ctrl+X (nano). Then raise a hand |
| Backup editor will not load | Check the team number in the address and the password. Try another browser. Then call out Joey's name |
| CI shows red on the pull request | It does not change your score. Keep building the demo; Joey and ERI read the check after the event |
| Wi-Fi drops | Tell Joey. A phone hotspot works. Work on a work or school laptop may be blocked by the network: use a personal device |
| Screen reader trouble in the editor or a Codespace | Do not wait: use your own laptop (path 2), or ask your team to give you the driver role in the editor and take the navigator or tester role if it does not work with your reader. Call out Joey's name if you need him. Keys: [Screen reader in a Codespace or the editor](#screen-reader-in-a-codespace-or-the-editor) |

## Rules and thanks

The rules are in [wiki/ESSENTIALS.md](wiki/ESSENTIALS.md). The first one: **fake data only**. Ask before you photograph anyone. Found a mistake in the spec or the docs? Tell Joey or write it in the notes doc. If something is not okay, tell Joey.

When the day ends: your team's code stays in the team pull request. Hand your card back. Winners go on the Meetup page; what happens after today is on the [event page](wiki/event/hackreation.md#after-the-event). Thank you from Mitobyte and ERI.
