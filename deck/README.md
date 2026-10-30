# Attendee kickoff deck (Marp)

The deck **is** `attendee-kickoff.md`. It's plain [Marp](https://marp.app) markdown, so it diffs, reviews and edits like code. Present it straight from VS Code (Marp extension), or render it:

```bash
npx @marp-team/marp-cli@latest deck/attendee-kickoff.md --pdf     # or --pptx, --html
```

Rendered files are git-ignored, so none is stored in the repo. `attendee-kickoff.md` is the single source and the plain-text version: [README.md](../README.md), [wiki/ESSENTIALS.md](../wiki/ESSENTIALS.md) and [wiki/event/hackreation.md](../wiki/event/hackreation.md) link to the same facts; event facts (times, place, doors, help, judging) live only in [wiki/event/hackreation.md](../wiki/event/hackreation.md). The printed start handout and any QR codes are made separately from [START-HERE.md](../START-HERE.md). Nobody has checked a PDF or HTML render with a screen reader yet, so do not promise one. Plain default theme on purpose: no branding until ERI and Mitobyte approve it.
