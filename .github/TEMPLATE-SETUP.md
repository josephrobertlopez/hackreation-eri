# Generated this from a template? Read this first

A GitHub template carries **files**. Almost everything that makes this repo
behave the way it does is not a file, so none of it came with the files.

This page is the list, and the commands to put it back. Every command derives
the owner and repository from wherever you are — nothing here is hardcoded, so
it works unchanged in your copy.

```bash
REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
BRANCH="$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)"
echo "$REPO on $BRANCH"
```

Run `python3 tools/init_template.py --list` first, then
`python3 tools/init_template.py --strip event --apply`, to clear the previous
event's specifics. It is a dry run unless you pass `--apply`.

## Does not carry over

| Not carried | What breaks if you forget |
| --- | --- |
| **Branch protection / rulesets** | Anyone can push straight to the default branch, and the required status checks below are not required at all. This is the big one. |
| **Required status checks** | Attempts merge or land with a red suite, which is exactly the thing the suite exists to stop. |
| **Secrets and variables** (Actions, Dependabot, Codespaces) | Nothing in this repo needs one — the workflows are written to run with no secrets — but anything you add later will need them set by hand. |
| **Issue labels** beyond GitHub's defaults | The issue forms ask for `attempt`, `project:p1`…`project:p4` and `defect`. A label that does not exist is silently not applied, so your board does not filter. |
| **Issues, pull requests, discussions, milestones, projects** | Your copy starts empty. Fine — but any triage board has to be rebuilt. |
| **Git history, tags, releases** | A generated repo starts at one fresh commit. ADRs in `docs/adr/` are the only record of why anything is the way it is. |
| **Collaborators and team access** | Nobody but you can open a branch. On the morning of an event that is a twenty-minute queue at your desk. |
| **CODEOWNERS targets** | The *file* carries; the users and teams it names may not exist in your org, and a review requirement pointed at a non-existent team cannot be satisfied. |
| **Environments** and their protection rules | Only matters if you add deployment. |
| **Webhooks, deploy keys, app installations** | Notifications and integrations stay silent. |
| **Actions settings**: whether Actions run at all, allowed actions, default token permissions, approval for first-time contributors | In a public repo taking pull requests from people who are not collaborators, "require approval for first-time contributors" decides whether any attempt's CI runs without you clicking. Check it before the event, not during. |
| **Merge-button settings**: squash / merge / rebase, auto-delete head branches, auto-merge | This repo's model assumes squash and assumes branches are deleted on merge. See the stacked-PR warning in [CONTRIBUTING.md](../CONTRIBUTING.md). |
| **Pages, description, topics, social preview** | Cosmetic, except Pages if you were serving anything. |
| **The template flag itself** | A repo generated from a template is not itself a template. If you want others to generate from yours, turn it on. |

Verify rather than trusting this table — it is a snapshot of GitHub's
behaviour, and GitHub changes:

```bash
gh api "repos/$REPO" --jq '{isTemplate,visibility,default_branch,allow_squash_merge,delete_branch_on_merge}'
gh api "repos/$REPO/branches/$BRANCH/protection" 2>&1 | head -5   # 404 = none
gh label list --repo "$REPO"
gh api "repos/$REPO/actions/permissions"
```

## Set by hand, in this order

### 1. Labels the issue forms reference

```bash
gh label create attempt   --repo "$REPO" --description "An attempt at an ERI project" --color 0E8A16 --force
gh label create defect    --repo "$REPO" --description "The spec, a test or a gate is wrong" --color D93F0B --force
for n in 1 2 3 4; do
  gh label create "project:p$n" --repo "$REPO" --description "ERI project $n" --color 1D76DB --force
done
```

### 2. Branch protection, with the two required checks

The required contexts are the **job names**, and there are exactly two from
`conformance.yml`, plus the repo-wide one:

| Context | From | What it asserts |
| --- | --- | --- |
| `Conformance (changed projects)` | `.github/workflows/conformance.yml` | the touched project's suite passed, or there was genuinely nothing to run |
| `Attempt declaration (backlog IDs)` | same file | the PR declares a real project and real backlog IDs, one attempt, prohibitions ticked |
| `Repo guardrails` | `.github/workflows/repo-guardrails.yml` | synthetic data, links resolve, derived files current, no secrets |

**Require the aggregator, never a per-project leg.** `P2 suite` is not a valid
required check here: change-aware CI does not create it on a PR that does not
touch P2, and a required check that never reports blocks the PR forever.
`Conformance (changed projects)` always reports, and maps a skipped matrix to
green. That is the whole reason it exists.

```bash
cat > /tmp/protection.json <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Conformance (changed projects)",
      "Attempt declaration (backlog IDs)",
      "Repo guardrails"
    ]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "required_conversation_resolution": true,
  "restrictions": null
}
JSON
gh api -X PUT "repos/$REPO/branches/$BRANCH/protection" --input /tmp/protection.json
```

Two judgement calls in there, both deliberate:

- `enforce_admins: false`. If you are the only reviewer and also the only code
  owner, `true` locks you out of your own repo with no second person to let you
  back in. Turn it on when there are two of you.
- `required_approving_review_count: 1`. For an event where attempts stay open
  and are compared rather than merged, review is the point and merging is not.
  If nothing is ever merged, protection is mostly there to stop an accident.

### 3. Merge behaviour

```bash
gh api -X PATCH "repos/$REPO" \
  -F allow_squash_merge=true -F allow_merge_commit=false \
  -F allow_rebase_merge=true -F delete_branch_on_merge=true
```

`delete_branch_on_merge=true` is what makes stacked pull requests dangerous
here — GitHub auto-closes a PR when its base branch is deleted. That is
documented in [CONTRIBUTING.md](../CONTRIBUTING.md) as a rule for teams, and
it is this setting that makes the rule load-bearing.

### 4. Actions, before the doors open

If attempts will come from people who are not collaborators, decide now whether
their first run needs your click:

```bash
gh api "repos/$REPO/actions/permissions"
gh api "repos/$REPO/actions/permissions/workflow"   # default token permissions
```

Every workflow here declares `permissions: contents: read` and needs no
secrets, so a read-only default token is correct and safe.

### 5. The template flag

Turn it on only after your copy is the thing you want others to start from:

```bash
gh api -X PATCH "repos/$REPO" -F is_template=true
```

## What the repo expects, so you know what you are turning on

- Attempts branch as `attempt/<team>/p<n>-<thing>` and open pull requests
  against the default branch. They stay open; they are compared, not merged
  into each other.
- Several attempts at the same project is the normal case, not a conflict.
- The backlog IDs a PR claims are checked against `docs/eri-backlog.json`,
  which is generated from the problem statements document. If that document is
  missing, the declaration check fails loudly rather than validating claims
  against nothing — which is the correct behaviour and will be the first thing
  you hit in a copy whose problem statements you have not replaced yet.
- Change-aware CI runs the touched project's suite only. Forty pull requests
  cost forty suite runs, not a hundred and sixty.

## Replacing the subject matter entirely

The machinery is not specific to ERI, but the backlog parser is specific to the
*shape* of the document: `## Project <n>: <title>`, a `### N. Core features`
two-column table, and a `### N. User stories` bullet list. Keep that shape and
`tools/gen_backlog.py` works on your problem statements unchanged. Change the
shape and the generator needs editing — it will tell you, by parsing zero
entries and refusing to write an empty backlog.
