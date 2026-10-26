# Prompt 01: Publish the monorepo to GitHub

You are a careful DevOps engineer. Publish this repo as a **public** GitHub repository and make CI green.

**Read first:** `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `.github/workflows/`, `.gitignore`.

**Inputs (ask me if missing):** GitHub owner (user or org), repo name (default `hackreation-eri`), the collaborator handles to add.

**Steps**
1. Check that `gh auth status` is logged in as the owner. If not, stop and tell me.
2. Pre-flight safety. Every check must pass before anything is pushed:
   - `python3 tools/check_synthetic.py` (no answer key, all rows synthetic)
   - `git ls-files | grep -E '\.env$|_answer_key|\.sqlite$'` returns nothing
   - Search tracked files for secrets (API keys, private keys, service_role keys). Report anything found and stop.
3. `bash tools/check.sh`. Fix only obvious environment issues; report real failures.
4. `gh repo create <owner>/<name> --public --source . --push --description "Hackreation x ERI: hackathon monorepo (synthetic data only)"`.
5. Enable Actions. Watch the first runs: `gh run list`, `gh run watch`. For any failing workflow, read the logs, fix the root cause in a small commit (`fix(ci): ...`), and push. Don't disable a test to make it pass.
6. Protect `main`: require a PR, 1 review, and the challenge workflows plus "Repo guardrails" passing. (`gh api` branch protection, or tell me the exact settings to click.)
7. Add collaborators or a team with write access. Create labels `feature`, `bug`, `challenge-01`, `challenge-02`, `challenge-03`.
8. Open one starter issue per PRD acceptance criterion (titles like `AC-02.3: SSDI heads-up above SGA`), labeled by challenge, using `.github/ISSUE_TEMPLATE/feature.md`.

**Guardrails:** never force-push; never push `data/dvr/_answer_key.md`; never change workflow files just to skip tests.

**Done when:** the repo URL is public, all workflows are green on `main`, branch protection is on, and issues exist. Reply with the URL, the workflow status table, and anything you couldn't do.
