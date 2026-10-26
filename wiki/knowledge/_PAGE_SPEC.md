---
title: Knowledge page spec
summary: How every page in wiki/knowledge/ is written, so people and LLMs can trust and maintain it.
last_verified: 2026-10-23
---

# Knowledge page spec (LLM-wiki format)

One topic per page. Target 60-220 lines. Markdown only.

## Required frontmatter
```yaml
---
title: Plain title
summary: One sentence an LLM can use to decide whether to open this page.
tags: [benefits, ssi, wisconsin]
jurisdiction: federal | wisconsin | milwaukee | dane | multi
last_verified: 2026-10-23        # date the sources were last opened
next_review: 2027-01-15          # e.g. after the January SSA COLA, or a law's effective date
review_owner: ERI benefits specialist manager   # a ROLE, never a private person's contact
confidence: high | medium | low  # how sure we are the page is current and correct
sources:
  - title: Source page title
    url: https://...
    accessed: 2026-10-23
---
```

## Required body sections (in this order)
1. `# Title`
2. **TL;DR**: 2-4 bullets with the answer and its key numbers
3. **Key facts**: a table of numbers, dates, thresholds and citations (statute, CFR, POMS section)
4. **How it works**: rules in plain language, using short sentences
5. **Caveats and gotchas**: what people get wrong, what changed recently, what's uncertain. Mark anything you could not confirm from an opened source with **(verify)**
6. **How ERI / a hackathon tool should use this**: concrete design or service implications, and what a tool must NOT do
7. **Related pages**: relative links
8. **Sources**: the same list as frontmatter, as markdown links

## Rules
- Facts come only from sources you actually opened. A search snippet is not a source. Cite primary sources (ssa.gov, ecfr.gov, docs.legis.wisconsin.gov, dhs.wisconsin.gov, dwd.wisconsin.gov, eeoc.gov, dol.gov, hhs.gov) over blogs.
- No legal or benefits advice for an individual. Pages explain rules and route people to qualified help (WIPA 1-877-826-1752, Disability Rights Wisconsin, the Client Assistance Program, an attorney).
- No private information: no personal emails or phones, nothing from internal emails. Public office lines and public program numbers are fine.
- Dates are absolute ("effective 2026-01-01"), never "recently".
