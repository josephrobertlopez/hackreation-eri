# Optional prep: only if you want a head start

**You do not have to prepare, but ten minutes on Friday helps a lot.** Make a verified GitHub account and, if you can, open one test Codespace (or install Node 20, Python 3 and git). No laptop or account? Come anyway: there is a backup team editor that needs no account. The day-of path is in [START-HERE.md](../START-HERE.md). Times, place, help and judging are on the [event page](../wiki/event/hackreation.md). The four projects are in [ERI's problem statements](eri-problem-statements.md).

This page is the Friday-night setup. Do whichever of A or B you like; neither is required.

## Not coding? Nothing to do.

Design, writing, testing, ERI knowledge and presenting are full roles. Tools you might bring: paper and a pen, an iPad or tablet, a Chromebook, a phone for recording. The roles and first tasks are in [START-HERE.md](../START-HERE.md#not-a-coder-your-tasks). Read the four projects if you like (5 minutes): [ERI's problem statements](eri-problem-statements.md).

## Step 0: a GitHub account (only if you will use a Codespace or your laptop)

Use a screen reader? Do Option B on your own laptop: it keeps your own tools and settings. You do not need a Codespace, and nobody has tested a screen reader in one yet.

1. Make a free account at https://github.com/signup and verify your email. The sign-up has a puzzle; choose the audio option. Blocked? Reply on the Meetup post and Joey helps you on Saturday. Or come anyway and use the backup team editor.

## Option A: a Codespace (primary)

A Codespace is your own workspace in the browser. The default is a slim image (Node 20, Python 3, git; no PHP, no Docker), enough for P1 to P4. It is usually ready in about 2 minutes; opening one on Friday night proves it works for you. On Saturday your team will open one from its team fork (see [START-HERE.md](../START-HERE.md)). Only the WordPress lead, or a team that wants PHP or Docker, needs the full configuration: START-HERE, [Path 1](../START-HERE.md#path-1-codespaces-a-free-github-account-any-laptop-with-a-browser) (it starts slower; create it at kickoff).

1. Open https://github.com/josephrobertlopez/hackreation-eri, press **Code**, **Codespaces**, **Create codespace on main**. GitHub may say it will make your own copy (a fork): choose **Create fork** or **Continue**; that is normal. This test Codespace is read-only for you: do not commit in it.
2. Wait until you see files on the left and a terminal at the bottom. Do not refresh and do not make a second one. Run `node -v`; it should say v20 or newer. Not ready after 10 minutes? Delete it. You lose nothing: use the backup team editor on Saturday.
3. Never delete a Codespace that holds work not yet on GitHub (an empty one that never became ready is fine to delete). It sleeps when idle and closes its ports; reopen it at https://github.com/codespaces. At https://github.com/settings/codespaces, **Default idle timeout** can be raised to 4 hours. Do that before you create the Codespace: it does not change one that already exists.

This Friday test proves your account and the start of the slim image from the main repo only. It cannot prove the Saturday steps (a collaborator invite, a Codespace opened on someone else's fork): nobody has tried those yet. On Saturday your team opens its Codespace from the team fork. A free account has a monthly Codespaces allowance; [GitHub's billing page](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-codespaces/about-billing-for-github-codespaces) has the current numbers.

## Option B: your own laptop (primary)

Best if you use a screen reader. Plan up to an hour.

1. Install Git (https://git-scm.com/download/win on Windows), Node 20 or newer (https://nodejs.org; the projects' `npm test` needs it), VS Code (https://code.visualstudio.com/download) and Python 3 (https://www.python.org/downloads/; `npm start` runs `python3 -m http.server`; tick "Add python.exe to PATH"). **On Windows `npm start` will still fail, because there is no `python3` command (only `py`): run `py -m http.server PORT` in the project folder instead (ports in [START-HERE](../START-HERE.md#ports-and-preview-addresses)).** **No admin rights, or an install not finished in 20 minutes? Stop and use a Codespace (Option A): it needs only a browser.** Choices that need no admin (not verified on a locked-down laptop): Node as the `.zip` download from https://nodejs.org/en/download, the VS Code **User Installer**, the current-user option of Git for Windows.
2. Open VS Code with no folder and press Ctrl + backtick (the key above Tab). A terminal opens. On Windows it is PowerShell, which is fine.
3. Run `git clone https://github.com/josephrobertlopez/hackreation-eri`, then `cd hackreation-eri`, then `code .`.
4. To send work from your laptop to the team fork (it needs your account and the accepted invite): install the GitHub CLI (`winget install GitHub.cli` on Windows, `brew install gh` on Mac), run `gh auth login --hostname github.com --git-protocol https --web`, then `gh auth setup-git`, then `git config --global core.editor "code --wait"` so git never opens an editor you cannot read. The sign-in prints an eight-character code and a web address: press Enter and the browser opens; if it does not, open https://github.com/login/device yourself and type the code (it expires in 15 minutes). Read the code back from the terminal before you press Enter.
5. Check it: `bash tools/check.sh`. Exit code 2 is fine; it means optional tools are missing. No bash on Windows? Skip it and run a project instead: `cd challenges/p1-show-your-skills` then `npm start` or `py -m http.server 8000`. Open http://localhost:8000/web/.

Screen reader users: reply "Screen reader" on the Meetup post; what happens next is under Getting help on the [event page](../wiki/event/hackreation.md#getting-help). Press H to jump by heading on this page.

## For everyone

- Bring headphones if noise bothers you. Stepping out for a break is fine.
- Set your zoom and font size at home. Turn on your own tools (dark mode, captions, voice control).
- Need a step-free route, quiet space, captions, or text copies? Reply on the Meetup post.
- Fake data only, always ([rules](../wiki/ESSENTIALS.md)).
