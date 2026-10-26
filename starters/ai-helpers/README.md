# AI helpers

Prototypes here stay standalone and use synthetic data only. There are two ways to use AI:

1. **In chat (no code):** paste a prompt from `prompts/` plus a few rows of synthetic data into Claude or ChatGPT.
2. **In your app:** `php/llm.php` is a 40-line cURL client for Anthropic or OpenAI. It defaults to **mock mode**, so demos work with no key.

```bash
php starters/ai-helpers/php/hello_llm.php                    # mock mode
LLM_PROVIDER=anthropic LLM_API_KEY=sk-... LLM_MODEL=<model id> php starters/ai-helpers/php/hello_llm.php
```

| Prompt | For |
| --- | --- |
| `classify-service-note.md` | PRD 01: which DVR milestone a note supports, plus what's missing |
| `explain-job-match.md` | PRD 02: a plain-language "why this job fits" |
| `inclusive-job-post.md` | Brief 3: flags job-post barriers |
| `plain-language.md` | Any content for job seekers or families |

**Rules:** synthetic data only. Bring your own API key and never commit it. A person makes every billing decision.
