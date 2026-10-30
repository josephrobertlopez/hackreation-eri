# Recommended stack

**The recommended stack is plain HTML, CSS and JavaScript that could be pasted into WordPress as a block or shortcode.** ERI's public sites run on **WordPress** (see [digital-properties.md](digital-properties.md)), so that is what ERI can keep. P1 to P4 already ship that way. The starters below are optional; PHP, MySQL and WordPress plugins are there if your project outgrows a plain page. For a phone-first prototype, Expo + Supabase. **Confirm with ERI before you count on any of these being adopted.**

| Target | Tools | Starter in this repo |
| --- | --- | --- |
| Websites | HTML/CSS, JavaScript/jQuery | `starters/static-web` |
| | PHP, SQL/MySQL/phpMyAdmin | `starters/php-mysql` |
| | WordPress | `starters/wordpress-plugin`, `starters/eri-job-card` (block) |
| Mobile apps | JavaScript, React Native/Expo, Postgres/Supabase | `starters/expo-supabase` |
| AI | Chat assistants (Claude, ChatGPT) or an API key you bring | `starters/ai-helpers` — **read the limits below first** |

## Pick by project

These are [ERI's four problem statements](../../docs/eri-problem-statements.md). Each has a different shape, and the shape decides the stack.

| ERI project | Start here | Why | Only if you need |
| --- | --- | --- | --- |
| **P1** Show Your Skills | `static-web` | Media + a preview page; nothing needs a server if the portfolio exports as a file | `expo-supabase` — if you want a real **view-only link** and native camera. Then you own the hosting question |
| **P2** My Workday Assistant | `static-web`, phone-first | One step at a time is local state. Must work at 320px and on a tablet | `expo-supabase` — if you want it installable with offline tasks |
| **P3** Job Coach Connection | `static-web`, two browser tabs | Employee view and coach inbox are two views over one state. Two tabs on one laptop is an honest demo of a simulated inbox | `php-mysql` or Supabase — if requests must cross **devices**, not tabs |
| **P4** Employer Opportunity Hub | `static-web`, then wrap as a WordPress plugin | Form in, explained matches out. **The most WordPress-ready of the four** and the likeliest for ERI's web team to host first | `php-mysql` — if the industry/task library outgrows a CSV |

**WordPress fit, honestly:** P4 is a natural plugin. P1 can be one, but media uploads are the hard part. **P2 and P3 are stateful apps, not page content** — forcing them into a plugin costs you the day. Build them standalone and say so in the demo.

## Three things no starter here does yet

ERI's statements need these. Nothing in `starters/` demonstrates them, and none is verified in this repo — budget time, and check on your own target browser early.

| Capability | Who needs it | The boring way that works |
| --- | --- | --- |
| **Photo / video / audio capture** | P1 (required: "at least one non-text method") | `<input type="file" accept="image/*,video/*,audio/*" capture>` gets you the phone camera and mic roll with zero JS. `MediaRecorder` records in-page if you want that. Expo: `expo-camera`, `expo-av` |
| **Audio instructions** | P1, P2 ("listen rather than read") | `speechSynthesis` needs no key, no file and no cost — **but it is UNVERIFIED on the day-of image.** On Linux with no speech voices installed it returns an empty voice list and silently does nothing, and the workspaces are Linux containers. Treat pre-recorded audio files as the real fallback, always ship the text, and verify this at the T-2 dry run |
| **Two roles, one state** | P3 (employee → coach inbox → response) | `localStorage` plus the `storage` event, or `BroadcastChannel`, syncs two tabs on one machine. Real cross-device needs a backend |

Also: **P2 needs step images.** The data generator makes CSVs, not pictures. Use simple icons or take four photos on your phone; ERI asked for pictures with the text, and a step with no picture fails AC-P2.3.

## ERI's limits on AI

Read this before using `starters/ai-helpers`.

ERI put these **out of scope in writing**, and they are not style preferences:

- **No AI-generated assessment of applicant suitability** (P1 §9).
- **No automated hiring or applicant scoring** (P1 §9, P4 §11).
- **Never rank candidates based on disability** (P4 §10).
- **Never suggest an accommodation from a disability label alone** (P4 §10).
- **No automated accommodation decisions**; complex legal questions go to qualified professionals (P4 §10).

So: use an LLM to help you *write code*, to turn text into plain language, or to explain a match **that your own rules already made**. Do not use it to judge a person. A model that outputs "this candidate is a 72% fit" is the exact product ERI said not to build, and it will lose on the rubric.

Two of the bundled prompts (`classify-service-note.md`, `inclusive-job-post.md`) were written for the retired challenges and no longer map to any of the four.

## Ground rules

- **Prototypes stay standalone.** No connections to ERI systems, and no AI agents pointed at anything real.
- Use only data in `data/` and your challenge's `data/`, which is synthetic.
- Prefer no build step and no new paid services. If you add a dependency, say why in your team README.
- Something you hand ERI should run from its README in under 10 minutes.
- **Accessibility is 25% of the score and it is tested, not eyeballed.** Every project above has keyboard, screen reader and plain-language requirements in ERI's own statement.
