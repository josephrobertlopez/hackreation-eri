# Full stack per project — an adversarial review

> **This document was itself adversarially reviewed on 2026-10-26, and four of
> its five central claims were refuted.** Five independent reviewers were asked
> to refute rather than confirm it. What they found is corrected in place, each
> correction marked and each verified by re-running the code rather than by
> taking a reviewer's word:
>
> - **P1** argued from a `localStorage` cap that this project forbids outright.
>   Replaced with the measured share-channel limit.
> - **P2** claimed ERI posed an irreconcilable demand. That rested on a
>   truncated quote; ERI specified consent-gated disclosure.
> - **P3** called the state machine the product and the transport a detail.
>   Backwards — authorization is the unbuilt half, and four lying impostors
>   advance the status today.
> - **P4** stated a prohibition ERI never wrote, by cutting three words off one
>   of their bullets inside quotation marks.
> - **Cross-cutting** said a static file server is enough. It is not enough for
>   a phone, which ERI asks for twice.
>
> Four quotations of ERI had been cut at a comma, each one dropping the
> qualifying clause so their rule read **stricter** than they wrote it. Three
> were load-bearing for a conclusion. That is now a gate —
> `tools/check_quotes.py`, wired into `tools/check.sh` and CI — which fails any
> quotation of ERI that stops mid-sentence without an ellipsis. It found a
> fourth truncation the human reviewers missed. **Its limit, stated plainly: it
> only sees quoted spans. A paraphrase that misstates ERI is not mechanically
> catchable, and one of the four errors above was exactly that.**

**What this is.** ERI's [problem statements](eri-problem-statements.md) describe
four real applications. The MVPs they wrote are deliberately small, so the
`challenges/` folders ship as static pages with no dependencies — that is
correct for a one-day build and it is **not** what each product requires.

This file answers the question the MVPs hide: *if you built what ERI's §4
feature list actually describes, what stack would it take, and where would it
hurt?* It is adversarial on purpose. Every option below has a named trap.

**Read the inference warning.** ERI never names a language, framework,
database, hosting model, SLA, auth model or WCAG level — verified by grep over
their document, 46 technical terms, all zero except "mobile-friendly",
"smartphone or tablet", and one mention each of hosting and authentication
*as things out of scope*. So every stack below is **our inference, not their
requirement.** ERI gets to overrule all of it.

**Two constraints that kill otherwise-good stacks, stated once:**

1. **ERI runs WordPress.** (`wiki/company/digital-properties.md`.) A beautiful
   thing in a stack their web team cannot host is a prototype, not an adoption.
2. **There is no budget line.** Any design needing a paid API key — speech-to-
   text, SMS, a hosted LLM — is undeployable for ERI even if it demos well.

---

## P1 Show Your Skills

### What ERI's §4 demands that the MVP does not

| ERI's words | the requirement nobody wrote down |
|---|---|
| "photos, short videos, audio recordings" | file upload, and **video is megabytes** |
| "Generate a view-only link" | hosting, a row per portfolio, an unguessable token |
| "captions or transcripts for audio/video" (§7) | either hand-typed, or **speech-to-text** |
| "Users must control what information they share" (§10) | per-item visibility, and revocation |
| "full identity verification … out of scope" (§9) | so the link **is** the credential |

### The arithmetic that decides the stack

**Corrected 2026-10-26.** An earlier draft argued from `localStorage`'s ~5MB
cap against a 30–60MB video. Both halves were wrong and the argument is
withdrawn. A default-settings phone video is nearer **60–200MB** (4K/30 has
been the iPhone default for years), and more importantly **`localStorage` binds
nothing here**: `test/guardrails.test.js:101` forbids
`localStorage|sessionStorage|indexedDB|document.cookie` outright in this
project. IndexedDB — available everywhere, quota in the gigabytes — would hold
a 60MB video without complaining. A team that re-derived the old argument would
correctly refute it and go build the upload.

**The number that actually decides it is the share channel, and it is
measured.** The sample portfolio — 3 skills, 4 examples, no uploads — encodes
to a **3,121-character** URL fragment, growing **+639 characters per
300-character written example** (base64 costs 1.33×, JSON overhead the rest).
Against real channel limits:

| channel | limit | the shipped 3,121-char link |
| --- | --- | --- |
| QR code (v40, ECC-L, byte mode) | 2,953 bytes | **cannot encode** |
| Discord message | 2,000 chars | **will not send** |
| plain-text email line (RFC 5322) | 998 chars | **broken** |
| self-contained `.html` export | 20–25MB attachment | fine until media |

QR is the one that matters: handing a link to an employer standing in a room is
ERI's own §8 demo. So **the ceiling is ~2,000–2,953 characters and the
three-skill sample already exceeds it.** Nothing in the 271 tests measures link
length.

The ten-line fix, also measured: `CompressionStream('gzip')` takes the same
payload from 3,119 to **1,227** characters — a 2.54× reduction that puts it
back inside both the QR and the Discord limit.

And the defect neither number reveals: `decodeShareLink` validates only
`Array.isArray(parsed.skills)`, so a **portfolio can be forged in a disabled
person's name** asserting any capability, in about 400 characters. Escaping is
solid, so this is not XSS — it is content integrity, in a hiring context, and
ERI's §9 descopes verifying the *person*, not the *artifact*.

### Stack layer by layer

| layer | what it has to do |
|---|---|
| client | accessible forms, media capture, preview, export |
| capture | `<input type="file" capture>` or `MediaRecorder` |
| transport | presigned/direct upload, not a PHP form POST |
| storage | object storage for media, row store for the portfolio |
| identity | ideally **none** — a token in the link, not an account |
| share | token → portfolio, revocable, no listing endpoint |
| infra | **HTTPS mandatory** — `getUserMedia` needs a secure context |

### Three real options

**A — Supabase (Postgres + Storage + RLS) + vanilla JS.** Fastest to rung 3.
Storage gives direct uploads with signed URLs; a `portfolios` table with a
random `share_token` and an RLS policy keyed on it gives view-only links
without accounts. Starter already in-repo: `starters/expo-supabase`.
*Trap:* it is a new vendor, a new account and a new dependency ERI never
agreed to, and free tiers pause idle projects — check current terms before
promising ERI anything.

**B — PHP + MySQL on ERI's existing host.** Highest adoption odds; zero new
vendors. *Trap, and it is fatal for video:* shared hosting commonly caps
`upload_max_filesize` between 2MB and 64MB, and `post_max_size` and
`max_execution_time` cap it again. Check the real `php.ini` before designing
around it. No transcoding, no resumable uploads.

**C — WordPress plugin using the Media Library.** Media handling, permissions
and an admin UI for free, and ERI's team already runs it. *Trap:* WP's media
model assumes a logged-in user. A job seeker making a portfolio is exactly the
person who should not need a WordPress account, so you inherit an auth model
that fights the product.

### The move I would actually make

**Do not host video. Link to it.** Let the portfolio hold a link to a video on
YouTube, Drive or OneDrive, with the transcript typed in. That deletes object
storage, transcoding, upload limits and most of the privacy surface in one
decision, keeps ERI's §8 "at least one non-text method of demonstrating a skill",
and is what a
nonprofit would really do. Photos and audio are small enough to host; video is
not. Transcripts stay hand-typed, because STT needs a paid key.

### Rungs

| rung | scope | stack added | honest cost |
|---|---|---|---|
| 1 ✅ | export a file, fragment link | none | shipped |
| 2 | real camera/mic capture | **HTTPS** | 1–2h once TLS exists |
| 3 | photos + audio hosted, token link | Postgres + object storage | half a day |
| 4 | per-item visibility, revocation | the above + policy work | a day |
| ✗ | auto transcripts | paid STT | **do not** — no budget |

---

## P2 My Workday Assistant

### What ERI's §4 demands that the MVP does not

| ERI's words | the requirement nobody wrote down |
|---|---|
| "Create a task … describe its steps" | an authoring UI, and therefore **two roles** |
| "list of **assigned** tasks for the day" | assignment crosses devices → **sync** |
| "Reminders … for scheduled activities" | **push** plus a scheduler |
| "Audio support" | audio files (storage) or TTS |
| "Support use on a smartphone or tablet" (§7) | offline on bad stockroom wifi → **PWA** |
| "Task progress should remain private unless the employee understands and agrees to share it" (§10) | **consent**, default-off, with the wording on screen |

### Consent, not a contradiction

**Corrected 2026-10-26.** An earlier draft of this section claimed §4 and §10
posed an irreconcilable demand. That rested on two misquotations of ERI, both
caught by `tools/check_quotes.py`: §10 says employers must not monitor workers
"without their knowledge", and that progress stays private "unless the employee
understands and agrees to share it". Both qualifying clauses had been dropped,
and they are the clauses that resolve it. ERI specified **consent-gated
disclosure**, not a prohibition.

Also corrected: "§4 wants supervisors to assign tasks" was our inference, not
ERI's text. "assign" appears once in their P2, as an adjective in "Display a
simple list of assigned tasks for the day." And §9 already closes the
monitoring surface outright — automated performance evaluation, time tracking
and location tracking are all out of scope.

So the build is: employee-owned progress, a coach write-only assignment
channel, and completion disclosure **off by default** with the consent wording
on screen. `web/storage.js` already quotes §10 in full, and the project README
specifies this as pick-one item 5. What genuinely remains for ERI is narrow —
retention duration, and whether a coach sees completions or only assignments.

### Stack layer by layer

| layer | what it has to do |
|---|---|
| client | one step at a time, 320px, large targets, offline |
| offline | service worker + IndexedDB, with a sync queue |
| auth | coach and employee, different capabilities |
| data | tasks, steps, assignments, completions |
| storage | step images, optional audio |
| async | scheduled reminders → push |
| infra | HTTPS (service workers require it) |

### Three real options

**A — Expo + Supabase.** The repo's `starters/expo-supabase`. Real push via
Expo's notification service, real offline storage, Postgres + RLS for the two
roles, and it runs on iOS, Android and web from one codebase.
*Trap:* shipping to an actual iPhone needs an Apple developer account and
TestFlight. Not achievable in a day. You will demo in Expo Go or on web.

**B — PWA + Supabase.** No app stores. *Trap, and it is the big one:* **iOS
web push requires iOS 16.4+ and the user adding the app to their home
screen.** Permissions are fragile and silent when they fail. If an employee
has an iPhone, "reminders" may simply never arrive and nothing will tell you.

**C — WordPress + custom tables.** Adoptable by ERI's team. *Trap:* WordPress
is a content system, not a sync engine. You would hand-roll conflict handling
and polling, and get the worst of both.

### The move I would actually make

**Reminders are in-app, not push, and offline sync is not promised.** An
in-app list with times satisfies the intent and needs no VAPID keys, no
scheduler and no iOS permission dance. And offline sync means conflict
resolution — a coach edits a task while an employee is mid-way through it
offline — which is a genuinely hard distributed problem and a terrible thing
to discover at 3pm. Keep authoring as a template a coach edits, as rung 1
already does.

### Rungs

| rung | scope | stack added | honest cost |
|---|---|---|---|
| 1 ✅ | three tasks, local progress, template authoring | none | shipped |
| 2 | coach authoring UI | accounts, two roles | half a day |
| 3 | assignments syncing to a phone | Postgres + auth + RLS | a day |
| 4 | reminders | scheduler; **push is a trap on iOS** | a day, may not work |
| ✗ | offline-first with conflict resolution | sync engine | not in a day |

---

## P3 Job Coach Connection

### What ERI's §4 demands that the MVP does not

| ERI's words | the requirement nobody wrote down |
|---|---|
| "Deliver the request to a designated job coach" | a server, and **two authenticated roles** |
| "sent, seen, or answered" | status semantics that cannot be faked |
| "review messages within the current session" (§4) | deliberately **no** retention — ERI scoped this |
| "coaches … support several employees across worksites" (§2) | notifications to a roaming coach |
| "secure authentication, protected communications, record retention" (§10) | ERI naming the production stack themselves |
| "distinguish routine … from emergencies" (§10) | a second, non-digital path |

### Why this one deserves the most conservative stack

This is the only project of the four where a wrong implementation can **hurt
someone**. A status that reads "seen" when nobody looked, or a UI that implies
a coach is standing by, gives false reassurance to a disabled employee mid-
shift. Every realtime library makes it trivially easy to render "delivered" as
"seen" — which is precisely the harm. So: boring transport, explicit human
actions, no presence indicators.

### Stack layer by layer

| layer | what it has to do |
|---|---|
| client | two separate views, large icon+text controls |
| transport | push-to-coach and reply-to-employee |
| auth | employee and coach, and **who may receive** (§10) |
| data | requests, statuses, replies, retention policy |
| async | notify a coach who is not at a desk |
| infra | HTTPS; retention and logging policy |

### Three real options

**A — Supabase Realtime + Postgres + RLS.** Closest to done in a day for
rung 3. *Trap:* realtime makes faking "seen" one line away, and RLS policies
for a two-role inbox are easy to get subtly wrong — a wrong policy here leaks
one employee's request to another.

**B — PHP + MySQL with 5-second polling on ERI's host.** Unfashionable and
genuinely the most adoptable thing on this page: no new vendor, no websockets,
nothing to explain to ERI's web team. *Trap:* polling N coaches at 5s is fine
at this scale and nothing else; don't let it grow.

**C — Node + ws + SQLite in Docker.** Pleasant to build, **nothing ERI can
host.** Only pick it if the team's goal is the demo, and say so out loud.

### The move I would actually make

**Corrected 2026-10-26, and this one is a reversal, not a tidy-up.** An earlier
draft said rung 1 had proved the hard part and "the transport is a detail."
That is backwards.

What rung 1 proves is narrower than it looked. Its suite refuses 7 impostor
actors and 14 invented events — and **every one of them declares a non-coach
role**. An actor that simply asserts `role: 'coach'` passes, because
`requireCoachActor()` checks the self-asserted role and a non-empty id and
**never compares `actor.id` to the request's designated `coachId`**. Measured
against the real module, four lying impostors all advanced the status:

```
employee self-asserting role=coach  -> seen,     seenBy=employee-sam-rivera
non-designated coach opens it       -> seen,     seenBy=coach-someone-else
unknown actor replies               -> answered, by totally-unknown
negative timestamp                  -> accepted, seenAt=-99999
```

So the employee can mark their own request seen, by themselves. The property
the suite proves is *"a status will not advance for an event that admits it is
not from a coach."* The property this section claimed is *"a status only moves
when a coach really did something."* The gap between those two sentences is the
entire authorization model, and it is **0% built**.

What makes the invariant hold today is not the state machine — it is that rung
1 has no network and no adversary, with `fetch`, `WebSocket`, `EventSource` and
`sendBeacon` banned outright. The state machine is the cheap, finished half:
pure, immutable, no clock, genuinely good work. **The authorization binding is
the half that carries the harm.** Changing transport does nothing about it:
`POST /seen.php?id=123` with no session check is identical to a bad RLS UPDATE
policy.

So polling-over-realtime stands as a recommendation about *adoptability* — no
vendor, no websockets, nothing new for a WordPress shop to host — and not as a
mitigation for faked status. Rung 3 gets one line ahead of everything else:
**derive the actor from the session server-side, and reject any `coach-opened`
or `coach-replied` whose `actor.id` is not the request's designated `coachId`.
The falsifier is a request advanced by a coach who is not the designated one,
and it must fail.** That falsifier does not exist today.

And the affordance ERI's features never offer: **"ask someone here."** Across
§4's seven features, §5's five stories, §6's six MVP steps and §8's five
criteria, the recipient is the job coach every single time — zero alternative
recipients. But ERI gestures at the nearby human three times elsewhere: §3
names "Authorized workplace support staff when appropriate" as a user class,
§2 names the loss of "immediate in-person assistance", and §10 points at
established emergency procedures. So adding it is not scope creep — it closes
ERI's own gap between §3 and §4.

Rung 1 already half-built it as copy: `fixtures/copy.js` tells the employee to
"tell the person in charge at your worksite as well," and every support need
carries a `tryFirst`. It is a sentence, not a control. **Promote it to a
control** — model it on the emergency rail, a depth-1 sibling of home that
sends nothing, which `flow.js` already proves costs zero interactions on the
request path. ~1h for the control; the per-worksite roster is ERI's ongoing
cost. Carry ERI's §2 constraint while doing it: the named barrier is
"discomfort interrupting a supervisor", so a version that pings the supervisor
rebuilds the exact barrier the product exists to route around.

### Rungs

| rung | scope | stack added | honest cost |
|---|---|---|---|
| 1 ✅ | two tabs, one machine, simulated inbox | none | shipped |
| 2 | two devices on the LAN | tiny server + store | half a day |
| 3 | real inbox, real auth | Postgres + auth + RLS | a day |
| 4 | notify a roaming coach | push or SMS (**SMS costs money**) | a day |
| ✗ | retention and records policy | — | ERI's decision, not a build |

---

## P4 Employer Opportunity & Support Hub

### What ERI's §4 demands that the MVP does not

ERI lists seven features and §6 scopes the build to **one**. The other six are
the ones their §2 problem statement actually names as employer pain.

| ERI's words | the requirement nobody wrote down |
|---|---|
| "Skills-to-tasks matching" | a task library — real ones come from **O*NET** |
| "Disclosure guidance" | legally sensitive content, curated not generated |
| "Accommodation explorer … authoritative resources" | indexing JAN content |
| "Onboarding planner … checklist" | document generation |
| "Resource connections: JAN, EEOC, DVR" | link curation and rot-checking |
| "Do not automatically rank candidates based on disability" (§10) | forbids the protected attribute as an input — not ML in the matching path |

### The trap hiding inside "plausible"

§9 asks for "at least three **plausible** workplace tasks." A lookup joining
`organizing` → `organize merchandise` is plausible and worthless. Nothing in
ERI's criteria distinguishes a useful suggestion from a tautological one, so
this criterion is passed trivially and tells a judge nothing.

### Why the data layer is harder than it looks

O*NET (US Dept. of Labor, free) covers on the order of a thousand occupations
with thousands of task and skill rows — check the current release before
sizing it. Its register is institutional: *"Perform for or Work Directly with
the Public."* A disabled job seeker describes themselves as *"I'm good at
greeting people."* The gap is **semantic and register**, and embeddings narrow
the first while doing nothing for the second. A curated vocabulary of a few
dozen plain-language skills, mapped by hand, beats a full ingest for this
audience — which is what rung 1 does.

### Stack layer by layer

| layer | what it has to do |
|---|---|
| client | accessible multi-step form, explained output |
| matching | needs ↔ skills, **with citations** (§9 requires reasoning) |
| data | industries, tasks, skills vocabulary, resources |
| content | disclosure and accommodation text, quoted not written |
| output | an action plan an employer can keep |
| auth | only if employers save sessions — avoid |

### Three real options

**A — Static JSON + client-side matching.** What rung 1 ships. Hostable
anywhere, auditable, no vendor. *Trap:* the vocabulary is only as good as the
hand-curation, and it will not generalise past the fixtures.

**B — Python ETL + Postgres + full-text search.** Real O*NET ingest. *Trap:*
a day of data wrangling, and you still own the register mismatch above.

**C — Embeddings + pgvector.** Semantic matching. **Permitted, and measured.**
An earlier draft called this "exactly what ERI's §10 forbids" — that rested on
a truncated quote and is withdrawn. §10 bars disability as a ranking input and
bars automated hiring or accommodation decisions. It does not bar ML in the
matching path, and the shipped guards already make the barred things
unreachable: there is no disability field to rank on.

Measured on this repo, not asserted: `nomic-embed-text` (137M, local, free, no
API key) scored **8/10 top-1** against O*NET task statements, and **5/8** on
employer needs in real register where the curated keyword matcher scored
**2/8**. *Trap:* embeddings find **tasks**, never rate **people** — and a
cosine is not a reason, so a suggestion still has to carry the citation §9
demands.

### The move I would actually make

**WordPress plugin, static data, print CSS.** P4 is the most WordPress-ready
of the four and the likeliest for ERI's web team to host first. Skip PDF
libraries — the browser's print-to-PDF with a print stylesheet is free and
accessible. And keep every word of disclosure and accommodation guidance as a
**quote with a link** to JAN or EEOC; generating it is both out of scope and
the single biggest legal risk in the repo.

### Rungs

| rung | scope | stack added | honest cost |
|---|---|---|---|
| 1 ✅ | fixture industries, cited matches, action plan | none | shipped |
| 2 | WordPress plugin, print stylesheet for paper | WP + print CSS. **Not** "print-to-PDF is accessible" — that was withdrawn: tagged-PDF export is Chromium-only and never PDF/UA-conformant, and ERI never asked for a PDF | half a day, plus the a11y evidence base: the 46 a11y and conformance tests run against the bare page, and a page-builder theme invalidates them |
| 3 | O*NET 31.0 ingest — 94,640 ability rows, 305,389 work-context rows | MySQL import, because it ships as `db_31_0_mysql.zip` (no Python service, and CC BY 4.0 attribution is mandatory) | the load is a day. The plain-language curation is the real cost and this table never priced it |
| 4 | disclosure + accommodation, quoted | curation, no generation | half a day |
| ✗ | ranking candidates, or an automated hiring/accommodation decision | — | **forbidden by ERI §10** |

---

## Cross-cutting

### §12 is the real product

ERI says a developed version would connect P1's portfolio to P4. That matters
because, alone, **P1 produces an artifact with no reader and P4 runs on a
candidate who does not exist.** Each has exactly the hole the other fills.
Together they need consent-scoped sharing between two applications — real
distributed work, and the strongest thing to show ERI. Rung 1 of P4 already
loads a profile carrying a consent block and **throws** when consent is
absent, so the seam exists.

### Where the costs actually land

| hidden cost | bites |
|---|---|
| **auth** | P1 r4, P2 r2, P3 r3 — three of four, nobody budgets it |
| **HTTPS** | any camera capture, any service worker |
| **a paid key** | STT, SMS, hosted LLM — all undeployable for ERI |
| **conflict resolution** | the moment anything is offline-first |
| **accessibility** | all four, every rung, and it is the heaviest rubric weight |

### TLS is not optional, and this page said it was

**Corrected 2026-10-26.** An earlier draft said a static file server is enough
for all four, with TLS needed only for camera capture. Wrong, and the correction
matters more than anything else on this page, because it bites at demo time.

Every project's `npm start` is `python3 -m http.server`. From a phone, the
origin is `http://192.168.x.x:PORT`, which is **not a secure context**. So:
`navigator.mediaDevices` is `undefined` (not an error — undefined, so a feature
detect reads as "this browser doesn't support it"), `navigator.clipboard` is
gone, service workers will not register, and `SpeechRecognition` is absent.
`localhost` does **not** rescue this — the exemption applies on the browsing
device, so it covers the laptop and not the phone.

ERI asks for phone support twice — P2 §7 "Support use on a smartphone or
tablet", P4 §8 "Mobile-friendly design" — and a judge will pick up a phone. So
**TLS is the precondition for demoing any of the four on a phone**, not a
camera-only concern. The day-of stack provides it via Caddy; a laptop fallback
does not, which means a team that falls back loses the phone demo along with
the box.

Two smaller ones in the same claim. **P3's limit is tighter than "cross-device"
suggests**: `BroadcastChannel` + `localStorage` are same-origin *and same
browser profile*, so a second browser, an incognito window, or two laptops all
break it — not merely a second device. And **the document root is the cheapest
thing to get wrong**: all four import across the `web/` boundary, so serving
`web/` as the root — which is exactly what `compose.yaml` does for the retired
challenges — 404s every fixture and renders a blank page. "A static file server
is enough" is only true with *"and the root is the project directory, not
`web/`"* attached.

Finally, two infra defects found by the same review and fixed in the repo
rather than described here: `infra/generate.py` mounted the Caddyfile and the
MySQL init SQL **without the `:z` SELinux label** that `compose.yaml` spends ten
lines explaining — on a Fedora host that is no routing and no team databases,
simultaneously, at `docker compose up`. And the T-1 runbook step regenerated
credentials after MySQL's data volume was already seeded, which silently
invalidates the printed slips; it now says `down -v` first.

### If you take one thing from this page

The difficulty people underestimate at this event is not the backend. **It is
getting one accessible, keyboard-navigable, screen-reader-correct flow shipped
in six hours.** Rung 1 is not nothing: it is where that work lives, and it is
25% of the score — a weight **we** proposed, not one ERI set. The backend rungs
are where a strong team goes next, not where the event is won.

And the uncomfortable one, which the reviews made unavoidable: **four of five
sections of this page were wrong in their central claim, and the code was more
honest than the review of it every single time.** `web/storage.js` quoted ERI's
§10 in full while this page truncated it. `guards.js` already made ERI's real
prohibitions unreachable while this page invented a wider one. Prefer the
tests to the prose, including this prose.

### Open questions for ERI

1. Would you host anything outside WordPress? (Decides Supabase vs PHP.)
2. Is there any budget for a paid API key? (If no, several rungs close.)
3. For P2 — who may see an employee's task progress, and for how long? That
   is a policy decision no schema can make.
4. For P3 — what is the honest expectation for a coach reply, and what should
   the UI say about it?
5. For P1 — is linking to video on Drive or YouTube acceptable instead of
   hosting it?
