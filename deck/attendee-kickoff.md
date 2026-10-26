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
Slides and schedule as plain text: `deck/attendee-kickoff.md` and `wiki/event/hackreation.md`

<!-- Speaker: welcome, thank ERI, Wisconsin Tech Month closer. -->

---

# Who is ERI?

- A Madison nonprofit, since 1990, with about 29 staff
- Helps people with disabilities get and keep jobs
- The catch: a paycheck can shrink a Social Security disability check (SSI or SSDI) or put health coverage (Medicaid) at risk
- So many people say no to work out of fear
- ERI's benefits counselors (WIPA) answer: "What happens if I take this job?"

---

# How ERI gets paid, and who keeps your code

- Most income is paid per service, by Social Security and by Wisconsin's job agency for people with disabilities (DVR)
- ERI is paid only when work is done, written up and claimed
- Margins are thin, so saved staff time and missed billing are real money
- A small web team runs ERI's WordPress sites. Build on their stack
- Your code is MIT licensed, so anyone can reuse it

---

# The 6 rules

1. **Fake data only.** It's in `data/`. Real client data is protected by law
2. **No connection to ERI systems.** Your prototype stands alone
3. **AI is optional.** Here it sees fake data only. In real use, the client must agree first
4. **Benefits answers are estimates.** Wrong answers hurt people. Always show "Estimate only" and WIPA: 1-877-826-1752
5. **Billing tools flag; people decide.** It's public money
6. **Accessible or it doesn't count**: keyboard, labels, focus, contrast, plain words

---

# Pick one challenge

| # | Build | For | ERI gets |
| --- | --- | --- | --- |
| **01** | Funding gap finder | ERI finance | A prototype ERI reviews later |
| **02** | "Is this job right for me?" | Job seekers | A WordPress plugin ERI can review |
| **03** | Inclusive job post checker | Employers | A WordPress plugin ERI can review |

Each one has a spec (PRD), fake data, tests, and a hello world that already runs.
Pick one "You add" item. Finish it with a test, then pick the next.
One role per team needs no code: plain words, keyboard and screen reader tests, the demo story.

---

# Start in 2 minutes

1. Open your team's URL. The password is on your slip
2. You get VS Code in the browser and your own WordPress (02 and 03 are plugins)
3. Open your challenge's `README.md` and run the hello world
4. Run its tests: `npm test` (02, 03) or `composer install && composer test` (01)

Preview: add `/proxy/8000/` to your URL (01 uses `/proxy/8080/`)
Screen reader user, or prefer your laptop? Clone the repo and run `bash tools/check.sh`, or use Codespaces. The browser IDE isn't tested with a screen reader yet.
Stuck 15 minutes, or need your slip another way? Ask a mentor.

---

# 01: Funding gap finder

**Problem:** ERI is paid only for work that's authorized, delivered *and* claimed. Gaps hide between funders.

**Already works:** 3 fake exports (DVR, Ticket to Work, county), one ledger, 22 flags

```
cd challenges/01-funding-gap-finder && php src/etl.php
```

**You add:** DVR hire and preferred-outcome rules; late reports; a review workflow with an audit trail

---

# 02: "Is this job right for me?"

**Problem:** at a job offer, people can't tell whether the hours, the bus, and their **benefits** work out.

**Already works:** Answer 4 questions. Get pay, an SSI/SSDI heads-up, the commute and "Call WIPA"

```
cd challenges/02-job-fit-checker && npm start
```

**You add:** pick from sample jobs; a short profile with top-3 matches; bus times; Spanish

---

# 03: Inclusive job post checker

**Problem:** job posts screen out qualified disabled applicants ("must lift 50 lbs", "driver's license").

**Already works:** Paste a post. Get flags, rewrites, an accommodation line and "Talk to ERI"

```
cd challenges/03-job-post-checker && npm start
```

**You add:** one-click rewrite; smarter rules; a "have ERI review my post" link

---

# Use AI well

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
- Tried once with a **screen reader** (VoiceOver: Cmd+F5, or NVDA on Windows)

Judges will check this in 2 minutes.

---

# How you're judged (proposed)

| Criterion | Weight |
| --- | --- |
| Solves ERI's problem | 30% |
| Accessible | 25% |
| Works end to end (a live demo on fake data) | 20% |
| ERI could adopt it (their stack, no paid services, a README that runs) | 15% |
| Presentation | 10% |

**The Golden Byte**, People's Choice, Best in Design, Best in Innovation, Best in Teamwork

Judges include the ERI liaison. Organizers explain the awards and set the final rubric at kickoff.

---

# Your 3-minute demo

1. **Who** it's for and their problem (20 sec)
2. **Live demo** on fake data (2 min)
3. **What ERI needs** to adopt it (20 sec)
4. **Accessibility** you tested (20 sec)

Open your pull request by 3:00, with one new passing test. CI takes a few minutes; a mentor can help fix a red build.
That PR is your portfolio piece. Call it a Hackreation prototype, not an ERI product.

Demos and awards start at 4:00 (public Meetup page; organizers confirm times).

---

<!-- _class: lead -->

# Questions? Ask a mentor or the ERI liaison

After today: ERI reviews every project and decides.

ERI is not promising to adopt, host or support any project.

If ERI picks one, a volunteer helps its web team test it on a test site first.

**Let's build.**
