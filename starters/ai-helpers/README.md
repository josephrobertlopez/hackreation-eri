# AI helpers

> **ERI put some AI uses out of scope, in writing.** No AI-generated assessment
> of applicant suitability, no automated hiring or applicant scoring, never rank
> candidates based on disability, never suggest an accommodation from a
> disability label alone, and no automated accommodation decisions. Use a model
> to help you write code, to turn text into plain language, or to explain a
> match **your own rules already made** — never to judge a person. Full list:
> [ERI's limits on AI](../../wiki/company/tech-stack.md#eris-limits-on-ai).
>
> `prompts/classify-service-note.md` and `prompts/inclusive-job-post.md` were
> written for the retired challenges and map to none of ERI's four projects.

Prototypes here stay standalone and use synthetic data only. There are two ways to use AI:

1. **In chat (no code):** paste a prompt from `prompts/` plus a few rows of synthetic data into Claude or ChatGPT.
2. **In your app:** `php/llm.php` is a 40-line cURL client for Anthropic or OpenAI. It defaults to **mock mode**, so demos work with no key.

```bash
php starters/ai-helpers/php/hello_llm.php                    # mock mode
LLM_PROVIDER=anthropic LLM_API_KEY=sk-... LLM_MODEL=<model id> php starters/ai-helpers/php/hello_llm.php
```

| Prompt | For |
| --- | --- |
| `classify-service-note.md` | RETIRED, not in scope: billing; none of P1 to P4 needs it |
| `explain-job-match.md` | Example: a plain-language "why this job fits" |
| `inclusive-job-post.md` | RETIRED, not in scope: flags job-post barriers (retired challenge 03) |
| `plain-language.md` | Any content for job seekers or families |

**Rules:** synthetic data only. Bring your own API key and never commit it. A person makes every billing decision.
