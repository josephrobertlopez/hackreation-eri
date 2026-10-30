# AGENTS.md: instructions for AI coding assistants

You are helping a team at **Hackreation x ERI** (Oct 31, 2026), a one-day hackathon. Coding time is a few hours, and demos are short (about 3 minutes).

## Read before writing code
0. `wiki/ESSENTIALS.md`: the one-page rules. Always enforce these.
1. `wiki/event/hackreation.md`: schedule, challenges, judging
2. The PRD for the team's challenge in `wiki/prds/`
3. `wiki/stack/<tech>.md` for how to build on the stack correctly (hooks, escaping, Expo APIs, RLS), then `wiki/company/tech-stack.md`: **build on the recommended stack** (HTML/CSS/jQuery, PHP, MySQL, WordPress; Expo + Supabase for mobile)
4. `wiki/domain/` for quick rules, and `wiki/knowledge/` for the deep, sourced knowledge base (benefits, employment law, compliance, the Wisconsin landscape, datasets, ERI org). Check each page's `last_verified` and `confidence`.

## Hard rules
- **Synthetic data only.** Use your project's `fixtures/` (or `data/job_seekers.csv`, `data/job_postings.csv`). Never ask for, invent realistic, or accept real client info (names, SSNs, case notes, benefits).
- **No connections to ERI systems.** Prototypes are standalone.
- **Accessibility is required**, by ERI's own list in `wiki/domain/accessibility.md`: labels, keyboard, focus, contrast, live regions, plain language. WCAG is a useful reference, not a claim: say "we did the keyboard pass and the screen reader pass", never "compliant" ([CONTRIBUTING.md](CONTRIBUTING.md), section 7).
- **DVR's provider agreement says any AI tool used with a DVR consumer's information needs that consumer's prior written or verbal consent** (see `wiki/knowledge/compliance/vr-confidentiality-34-cfr-361-38.md`). Design AI features so they can be switched off or gated behind recorded consent.
- **Billing (only if you build a billing tool; none of P1 to P4 does):** flag only. Never write logic or copy that suggests documentation wording to reach a higher rate. A person approves every billing decision.
- **Benefits math:** label results "estimate only" and route to Wisconsin WIPA (1-877-826-1752).
- **Secrets:** read API keys from env vars or `.env` (git-ignored). Never hard-code them.
- Keep dependencies minimal. Prefer no build step. Explain any new dependency in the team README.
- Work inside your project folder `challenges/p<n>-.../`. Don't modify `starters/`, `data/` or `wiki/` unless asked.

## Defaults
- PHP 8.2+ (8.3 preferred; 8.1 is end of life), PDO with prepared statements, escape all output (`htmlspecialchars` / WordPress `esc_html`).
- WordPress: prefix with `eri_`; shortcode or REST; no paid plugins.
- Expo: SDK 58 (see `starters/expo-supabase/AGENTS.md`); use `npx expo install`.
- Write a short `README.md` in the team folder with run steps that take under 10 minutes.
