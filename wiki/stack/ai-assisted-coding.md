---
title: AI-assisted coding in this repo
summary: How to get good results from Claude, ChatGPT or Copilot in a 4-hour build. Point the tool at AGENTS.md and llms.txt, feed it the PRD, ask for small diffs and tests, check accessibility and security yourself, never paste real data, and catch the usual hallucinations.
tags: [stack, ai, claude, chatgpt, copilot, workflow, security, accessibility]
last_verified: 2026-10-23
next_review: 2027-01-23
review_owner: Hackathon technical lead (Mitobyte) with ERI web team lead
confidence: medium
sources:
  - title: Claude Code docs, How Claude remembers your project (CLAUDE.md and AGENTS.md)
    url: https://code.claude.com/docs/en/memory
    accessed: 2026-10-23
  - title: GitHub Docs, Support for different types of custom instructions
    url: https://docs.github.com/en/copilot/reference/custom-instructions-support
    accessed: 2026-10-23
  - title: Expo docs llms.txt
    url: https://docs.expo.dev/llms.txt
    accessed: 2026-10-23
  - title: WordPress developer reference, register_rest_route()
    url: https://developer.wordpress.org/reference/functions/register_rest_route/
    accessed: 2026-10-23
  - title: Supabase, API keys
    url: https://supabase.com/docs/guides/getting-started/api-keys
    accessed: 2026-10-23
  - title: MDN, Element.innerHTML (security considerations)
    url: https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
    accessed: 2026-10-23
---

# AI-assisted coding in this repo

## TL;DR
- **Load the rules first.** Claude Code reads `CLAUDE.md`, which in this repo says "Read and follow AGENTS.md". Copilot's cloud agent and CLI read `AGENTS.md`. Copilot Chat in VS Code reads `AGENTS.md`, but on GitHub.com, JetBrains and other IDEs it reads only `.github/copilot-instructions.md`. For ChatGPT or Claude.ai chat, **paste `llms.txt`** or upload `llms-full.txt`.
- **Give it the PRD** (`wiki/prds/0X-*.md`) and the challenge folder. Ask for **one small diff at a time**, with a test.
- **You own accessibility, security and facts.** The assistant will write `innerHTML` with user input, put keys in front-end code, and invent SSA numbers. Check each one using the checklist below.
- **Never paste real data.** Use only `data/`, which is synthetic. That applies to prompts and screenshots too.

## Minimal working example
### 1. Kick-off prompt (paste as-is, then edit the bracketed parts)
```text
You are helping my team at Hackreation x ERI. Read AGENTS.md, wiki/ESSENTIALS.md,
wiki/prds/02-job-fit-checker.md and wiki/stack/javascript-jquery.md before writing code.
We work only in teams/[our-team]/. Stack: plain HTML/CSS/JS (IIFE pattern like
challenges/02-job-fit-checker/web/job-fit.js), no build step, no new dependencies.
Data: synthetic files in data/ only.
Task: [one feature, e.g. "add a 'commute minutes' field to the form and the core logic"].
Rules: show a short plan first, then a minimal diff. Add or update tests in tests/test.js
(node, no framework, exit code 1 on failure). Use textContent, never innerHTML with input.
Every input needs a visible label; results get focus or a role="status" update.
Benefits numbers must come from wiki/knowledge/benefits/benefits-quick-reference-2026.md
and be labeled "Estimate only" with WIPA 1-877-826-1752. If unsure, say so; don't guess.
```

### 2. Loop: about 20 minutes per cycle
```bash
# after each AI change
node teams/<team>/tests/test.js        # PASS lines, exit 0
bash tools/check.sh                     # repo smoke tests still pass
git diff --stat                         # is the change small and inside teams/<team>/ ?
```
Then do a **30-second keyboard pass**: Tab through it, submit, and listen for the result. Commit. Next small task.

### 3. Review prompt (use a fresh chat, or ask the tool to review its own diff)
```text
Review this diff for: (1) XSS - any innerHTML/.html() with user, CSV, API or LLM text;
(2) secrets in front-end code or committed .env; (3) missing labels, focus handling,
contrast, 44px targets; (4) any number about SSI/SSDI/DVR not traceable to the wiki;
(5) real-looking personal data. List problems with file:line. Don't rewrite code yet.
```

### Pointing each tool at the rules
| Tool | What it reads | Do this |
| --- | --- | --- |
| Claude Code | `CLAUDE.md` (here: "Read and follow AGENTS.md"); it can also use `AGENTS.md` | Start in the repo root |
| Copilot cloud agent / CLI | `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md` | Nothing extra |
| Copilot Chat (VS Code) | `AGENTS.md` and `.github/copilot-instructions.md` | Nothing extra |
| Copilot Chat (GitHub.com, JetBrains, others) | `.github/copilot-instructions.md` only | Attach `AGENTS.md`, or ask organizers to add that file (verify that it exists) |
| ChatGPT / Claude.ai chat | Only what you paste | Paste `llms.txt`, `AGENTS.md`, the PRD and the file you're changing |
| Expo work, any tool | Training data that is often stale | Also give it `https://docs.expo.dev/llms.txt` and `starters/expo-supabase/AGENTS.md` |

## Do / Don't checklist
- [ ] **Do** ask for a plan before code, and **reject diffs that touch `starters/`, `data/` or `wiki/`** unless you asked for that.
- [ ] **Do** ask for tests first, or alongside the code ("write a failing test for X, then make it pass").
- [ ] **Do** make the assistant cite a file or URL for every domain fact. "Where did $1,690 come from?" should have an answer: `wiki/ESSENTIALS.md`.
- [ ] **Do** keep AI features in your app **off by default and mockable**. `starters/ai-helpers/php/llm.php` defaults to mock mode.
- [ ] **Don't** paste names, case notes, SSNs, benefit amounts or screenshots of real systems, even "just to test". Use `data/job_seekers.csv`.
- [ ] **Don't** accept a new npm package, framework or build step without a one-line reason in your README.
- [ ] **Don't** let it "fix" a permission error by disabling RLS, adding a service key, or using `permission_callback => '__return_true'` on a write route.

## Security
- **Secrets:** API keys go in env vars (`LLM_API_KEY`) or a git-ignored `.env`, never in prompts you share and never in browser or Expo code. Supabase: only the publishable/anon key goes to clients. The secret/service_role key "bypasses RLS" and must not be sent "over chat".
- **Output is untrusted.** LLM text rendered in your UI goes through `textContent` or `esc_html`. MDN calls `innerHTML` "probably the most common vector for cross-site scripting (XSS)".
- **Prompt injection:** a synthetic job post can contain "ignore previous instructions". Treat model output as data. Never let it pick URLs to call or SQL to run.
- **Consent rule (real life):** DVR requires a consumer's prior consent before any AI tool touches their information (`wiki/knowledge/compliance/vr-confidentiality-34-cfr-361-38.md`). Build a visible on/off switch.

## Accessibility (check it yourself; assistants claim compliance they don't deliver)
- Ask it to "list every input and its label" and "say where focus goes after submit". Then verify that with the keyboard.
- Run Lighthouse and axe on what it built ([html-css-accessibility.md](html-css-accessibility.md)). Don't accept "this is WCAG compliant" as a claim.
- Ask for plain language at about a 6th-grade level, then read it aloud yourself.

## Common AI-assistant mistakes to watch for (and how to check)
| Hallucination | How to check |
| --- | --- |
| **Wrong WordPress hooks**: `register_rest_route` outside `rest_api_init`, no `permission_callback` (a `_doing_it_wrong` notice since WP 5.5), `wp_enqueue_script` called at top level instead of in a `wp_enqueue_scripts` callback or a shortcode | Compare with `starters/wordpress-plugin/eri-hello/eri-hello.php`, [wordpress-plugin.md](wordpress-plugin.md) and developer.wordpress.org. Run with `WORDPRESS_DEBUG: 1` and read the notices |
| **Missing escaping in PHP**: `echo $title` | Must be `esc_html()`, `esc_attr()` or `htmlspecialchars()`. Look for `echo` lines |
| **Outdated Expo APIs**: `expo eject`, a global `expo-cli`, "managed vs bare", `npm install` for native modules, `SafeAreaView` from `react-native` | Expo's `llms.txt` lists these as outdated. Use `npx expo install`, `npx expo-doctor`, and the versioned docs for SDK 58 |
| **Expo Router code in the single-`App.js` starter** (or the reverse) | Look at `index.js` and `package.json`: `expo-router` isn't installed here |
| **Invented SSA/benefits numbers** (an old SGA, a "$2,000 TWP", made-up 2027 figures) | Must match `wiki/ESSENTIALS.md` and `wiki/knowledge/benefits/benefits-quick-reference-2026.md`, e.g. SGA $1,690 / $1,770, TWP $1,210 / $1,270, SSI FBR $994 / $1,029 (2026 / 2027) |
| **Invented phone numbers or programs** | WIPA is 1-877-826-1752. DRW/CAP is 800-928-8778. Anything else needs a source |
| **Dead incentives** pitched to employers (the Section 503 "7% goal", WOTC) | `wiki/ESSENTIALS.md` says both are out as of 2026 |
| **Billing "optimization"** copy for PRD 01 | Forbidden. Tools flag and people decide (`AGENTS.md`) |
| **jQuery 3-only APIs** (`$.trim`, `$.isArray`) | Removed in jQuery 4.0. Use native equivalents |
| **Fake test passes**: a test that prints PASS without asserting anything | Read the test. Break the code on purpose and confirm the test goes red |
| **Made-up model IDs or API fields** in `llm.php` calls | Take model IDs from the provider's docs (`LLM_MODEL` env), and keep mock mode working |

## How to hand off to ERI
- In the team README, say **which AI tools you used and for what**, and which parts a human reviewed line by line.
- Remove prompts, chat logs and any pasted data from the repo. Keep reusable prompts in a `prompts/` folder, as `starters/ai-helpers/prompts/` does.
- The final diff should pass `node tests/test.js` and `bash tools/check.sh`, and should carry a short accessibility note. ERI's small team must be able to read every line without an AI.
- Any AI feature ships **disabled by default**, with a mock mode and a note on the consent requirement.

## Sources
- [Claude Code memory (CLAUDE.md, AGENTS.md)](https://code.claude.com/docs/en/memory)
- [GitHub Copilot custom-instruction support by surface](https://docs.github.com/en/copilot/reference/custom-instructions-support)
- [Expo llms.txt](https://docs.expo.dev/llms.txt): lists outdated LLM assumptions about Expo
- [WordPress register_rest_route()](https://developer.wordpress.org/reference/functions/register_rest_route/): `permission_callback` and the `rest_api_init` requirement
- [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys) · [MDN innerHTML security](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
