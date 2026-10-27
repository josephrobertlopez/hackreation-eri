#!/usr/bin/env python3
"""First run in a repository generated from this template.

Strips the previous event's specifics, re-derives everything that names the
repository, and then tells you what a GitHub template could not carry over at
all. See .github/TEMPLATE-SETUP.md for that second list in full.

    python3 tools/init_template.py                       # dry run, changes nothing
    python3 tools/init_template.py --list                # what each group holds
    python3 tools/init_template.py --strip event,teams --apply
    python3 tools/init_template.py --strip all --apply --rename-to acme/hack-2027

DRY RUN IS THE DEFAULT. Deleting a quarter of a repository on someone's behalf
because they typed the wrong word is not a reasonable thing for a script to do
unasked, so it prints the plan and makes you say --apply.

It does not rewrite prose. Stripping a directory that README or the wiki links
to leaves a broken link, and guessing at replacement sentences would be worse
than leaving them: it would read as finished text that nobody wrote. So the
last thing this does is run the repo's own link and derived-file gates and hand
you the exact list of what you now have to write yourself. A red gate you can
see beats a green one that is lying.
"""
from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Per group: why it is event-specific, and the paths it owns.
GROUPS: dict[str, tuple[str, list[str]]] = {
    "event": (
        "Slides, schedule and judging for one specific day, plus the log of how"
        " this repo got here.",
        ["deck", "wiki/event", "docs/refinement-log.md"],
    ),
    "hosting": (
        "Day-of hosting for one venue: per-team browser IDE and WordPress,"
        " pinned images, that network.",
        ["infra"],
    ),
    "teams": (
        "Scratch space that belonged to the previous event's teams.",
        ["teams"],
    ),
    "prompts": (
        "Copy-paste operator prompts written for this event's deployment and"
        " post-event triage.",
        ["prompts"],
    ),
    "retired": (
        "Challenge folders and workflows that an earlier round of this repo"
        " built and then superseded.",
        ["challenges/01-funding-gap-finder",
         "challenges/02-job-fit-checker",
         "challenges/03-job-post-checker",
         ".github/workflows/challenge-01-funding-gap-finder.yml",
         ".github/workflows/challenge-02-job-fit-checker.yml",
         ".github/workflows/challenge-03-job-post-checker.yml"],
    ),
}

KEEP_IN_STRIPPED_DIR = {"README.md"}
SLUG = re.compile(r"github\.com[:/]([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+?)(?=[/\s)\"'`]|\.git\b|$)")
# Prose and config only. Lockfiles are 90% `github.com/sponsors/<person>` and
# would bury the one slug that matters under four hundred that do not.
TEXT_SUFFIXES = (".md", ".txt", ".yml", ".yaml")
SKIP_DIRS = {".git", "node_modules", "vendor", "build", ".playwright-mcp"}
# github.com/<this>/... is never an owner. Without this the funding links and
# the docs links in every transitive dependency read as repositories.
NOT_AN_OWNER = {
    "sponsors", "en", "orgs", "apps", "features", "settings", "marketplace",
    "topics", "about", "pricing", "security", "login", "join", "readme",
    "site", "customer-stories", "collections", "trending", "notifications",
    "codespaces", "copilot", "enterprise", "新",
}


def run(cmd: list[str], **kw) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True, cwd=REPO,
                          check=False, **kw)


def origin_slug() -> str:
    """owner/repo of THIS clone, from the Actions context or the git remote."""
    env = os.environ.get("GITHUB_REPOSITORY", "").strip()
    if re.fullmatch(r"[\w.-]+/[\w.-]+", env):
        return env
    url = run(["git", "remote", "get-url", "origin"]).stdout.strip()
    m = re.search(r"[:/]([\w.-]+)/([\w.-]+?)(?:\.git)?/?$", url)
    return f"{m.group(1)}/{m.group(2)}" if m else ""


def walk_text_files() -> list[str]:
    out = []
    for root, dirs, names in os.walk(REPO):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for n in names:
            if n.endswith(TEXT_SUFFIXES):
                out.append(os.path.relpath(os.path.join(root, n), REPO))
    return sorted(out)


def du(path: str) -> tuple[int, int]:
    """(files, bytes) under a path."""
    if os.path.isfile(path):
        return 1, os.path.getsize(path)
    files = total = 0
    for root, dirs, names in os.walk(path):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for n in names:
            files += 1
            try:
                total += os.path.getsize(os.path.join(root, n))
            except OSError:
                pass
    return files, total


def plan_strip(groups: list[str]) -> list[tuple[str, str, int, int]]:
    plan = []
    for g in groups:
        _why, paths = GROUPS[g]
        for p in paths:
            if os.path.exists(p):
                f, b = du(p)
                plan.append((g, p, f, b))
    return plan


def find_slugs(current: str) -> dict[str, list[str]]:
    """Every owner/repo mentioned in the tree, and where. Never a literal."""
    hits: dict[str, list[str]] = {}
    for path in walk_text_files():
        try:
            body = open(path, encoding="utf-8", errors="replace").read()
        except OSError:
            continue
        for owner, name in SLUG.findall(body):
            if owner.lower() in NOT_AN_OWNER:
                continue
            slug = f"{owner}/{name.removesuffix('.git')}"
            if slug == current:
                continue
            hits.setdefault(slug, []).append(path)
    return {s: sorted(set(p)) for s, p in
            sorted(hits.items(), key=lambda kv: -len(set(kv[1])))}


def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--strip", default="event",
                    help="comma-separated groups, or `all`, or `none` "
                         f"(groups: {', '.join(GROUPS)})")
    ap.add_argument("--rename-to", metavar="OWNER/REPO",
                    help="rewrite every other owner/repo mentioned in the tree "
                         "to this one; default is to report them, not touch them")
    ap.add_argument("--apply", action="store_true",
                    help="actually write. Without it, nothing is changed.")
    ap.add_argument("--list", action="store_true",
                    help="describe each group and what it currently holds")
    args = ap.parse_args(argv)

    os.chdir(REPO)
    current = origin_slug()

    if args.list:
        print("Groups this script can strip:\n")
        for g, (why, paths) in GROUPS.items():
            present = [p for p in paths if os.path.exists(p)]
            f = sum(du(p)[0] for p in present)
            b = sum(du(p)[1] for p in present)
            print(f"  {g:9s} {len(present)}/{len(paths)} present, "
                  f"{f} file(s), {b // 1024} KB")
            print(f"            {why}")
            for p in paths:
                print(f"            {'-' if os.path.exists(p) else 'x'} {p}")
            print()
        print("x = not present in this copy.")
        return 0

    if args.strip.strip() == "all":
        groups = list(GROUPS)
    elif args.strip.strip() in ("", "none"):
        groups = []
    else:
        groups = [g.strip() for g in args.strip.split(",") if g.strip()]
        unknown = [g for g in groups if g not in GROUPS]
        if unknown:
            ap.error(f"unknown group(s): {', '.join(unknown)}. "
                     f"Known: {', '.join(GROUPS)}, all, none")

    mode = "APPLY" if args.apply else "DRY RUN (nothing will be written)"
    print(f"=== init_template: {mode}")
    print(f"this repository: {current or 'UNKNOWN (no origin remote)'}")
    print()

    # 1. strip -----------------------------------------------------------
    plan = plan_strip(groups)
    print(f"--- 1. strip {len(plan)} path(s) from group(s): "
          f"{', '.join(groups) or '(none)'}")
    for g, p, f, b in plan:
        print(f"    [{g}] {p}  ({f} file(s), {b // 1024} KB)")
    if not plan:
        print("    nothing to strip")
    if args.apply:
        for _g, p, _f, _b in plan:
            if os.path.isdir(p):
                keep = [k for k in KEEP_IN_STRIPPED_DIR
                        if os.path.exists(os.path.join(p, k))]
                for entry in sorted(os.listdir(p)):
                    if entry in keep:
                        continue
                    target = os.path.join(p, entry)
                    shutil.rmtree(target) if os.path.isdir(target) else os.remove(target)
                if not keep:
                    shutil.rmtree(p, ignore_errors=True)
                print(f"    removed {p}" + (f" (kept {', '.join(keep)})" if keep else ""))
            else:
                os.remove(p)
                print(f"    removed {p}")
    print()

    # 2. other owners/repos mentioned in the tree ------------------------
    hits = find_slugs(current)
    print(f"--- 2. owner/repo mentions that are not {current or 'this repo'}: "
          f"{len(hits)} distinct")
    for slug, paths in hits.items():
        print(f"    {slug}  in {len(paths)} file(s), e.g. {', '.join(paths[:3])}")
    if args.rename_to:
        if not re.fullmatch(r"[\w.-]+/[\w.-]+", args.rename_to):
            print(f"    ERROR: --rename-to {args.rename_to!r} is not owner/repo",
                  file=sys.stderr)
            return 2
        print(f"    -> rewriting all of the above to {args.rename_to}")
        if args.apply:
            changed = 0
            for slug, paths in hits.items():
                for path in dict.fromkeys(paths):
                    body = open(path, encoding="utf-8", errors="replace").read()
                    new = body.replace(slug, args.rename_to)
                    if new != body:
                        open(path, "w", encoding="utf-8").write(new)
                        changed += 1
            print(f"    rewrote {changed} file(s)")
    elif hits:
        print("    (reported only; pass --rename-to OWNER/REPO to rewrite them)")
    print()

    # 3. regenerate what is derived --------------------------------------
    print("--- 3. regenerate derived files")
    regen = [
        ([sys.executable, "tools/gen_backlog.py", "--quiet"],
         "backlog, from ERI's problem statements"),
        ([sys.executable, "tools/gen_issue_forms.py"],
         "issue forms + config.yml, whose URLs are derived from this repo"),
        ([sys.executable, "tools/build_llms_full.py"],
         "llms-full.txt, the flattened wiki (stripping wiki pages makes it stale)"),
    ]
    for cmd, why in regen:
        script = cmd[1]
        if not os.path.exists(script):
            print(f"    skip {script} (not in this copy)")
            continue
        print(f"    {'run' if args.apply else 'would run'}: {' '.join(cmd[1:])}"
              f"  -- {why}")
        if args.apply:
            proc = run(cmd)
            tail = (proc.stdout + proc.stderr).strip().splitlines()[-1:] or [""]
            print(f"        exit {proc.returncode}: {tail[0]}")
    print()

    # 4. hand back the real fallout --------------------------------------
    print("--- 4. gates, run now so you see what stripping broke")
    for cmd, label in (([sys.executable, "tools/check_links.py"], "links and heading anchors"),
                       ([sys.executable, "tools/check_derived.py"], "derived files"),
                       ([sys.executable, "tools/check_github_yaml.py"], ".github YAML")):
        if not os.path.exists(cmd[1]):
            continue
        proc = run(cmd)
        out = (proc.stdout + proc.stderr).strip()
        print(f"    {label}: exit {proc.returncode}")
        for line in out.splitlines()[:25]:
            print(f"        {line}")
        if proc.returncode != 0:
            print("        ^ these are yours to fix. Stripping a directory that"
                  " prose links to breaks the link, and this script does not"
                  " invent replacement sentences.")
    print()

    print("--- 5. what a GitHub template did NOT carry over")
    print("    Read .github/TEMPLATE-SETUP.md. The short version: branch")
    print("    protection, secrets and variables, issue labels, milestones,")
    print("    collaborators, environments, webhooks, merge-button settings,")
    print("    and the template flag itself. None of it is in any file, so")
    print("    none of it came with the files.")
    if not args.apply:
        print()
        print("DRY RUN: nothing was written. Re-run with --apply.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
