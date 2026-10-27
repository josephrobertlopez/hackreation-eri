#!/usr/bin/env python3
"""Parse every YAML file under .github/ and check the shape GitHub requires.

A workflow or issue form that does not parse fails at the worst possible time:
GitHub accepts the push, then silently never runs the workflow, or shows the
issue form as a broken template. Neither produces a red check, because there
is no check to go red.

So this parses them, and then asserts the handful of structural things that
are cheap to get wrong and expensive to discover on the day:

  workflows    a name, a trigger, at least one job, and every `needs:` naming
               a job that exists in the same file
  issue forms  a name, a description, a non-empty body, every body item having
               a known `type`, and every input carrying a label

Needs PyYAML. If PyYAML is absent it exits 3 (unproven, not passing) rather
than 0, because "the checker could not run" must never read as "the files are
fine". Run it from anywhere:

    python3 tools/check_github_yaml.py
"""
from __future__ import annotations

import glob
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ITEM_TYPES = {"markdown", "input", "textarea", "dropdown", "checkboxes"}


def main() -> int:
    try:
        import yaml
    except ImportError:
        print("SKIPPED: PyYAML is not installed, so nothing was parsed.",
              file=sys.stderr)
        print("pip install pyyaml  (exit 3 = unproven, not passing)",
              file=sys.stderr)
        return 3

    os.chdir(REPO)
    paths = sorted(glob.glob(".github/**/*.yml", recursive=True)
                   + glob.glob(".github/**/*.yaml", recursive=True))
    if not paths:
        print("ERROR: no YAML found under .github/.", file=sys.stderr)
        return 1

    problems: list[str] = []
    for path in paths:
        try:
            doc = yaml.safe_load(open(path, encoding="utf-8"))
        except yaml.YAMLError as exc:
            problems.append(f"{path}: does not parse: {exc}")
            print(f"  FAIL  {path}")
            continue
        if not isinstance(doc, dict):
            problems.append(f"{path}: top level is {type(doc).__name__}, not a mapping")
            print(f"  FAIL  {path}")
            continue

        detail = ""
        if path.startswith(".github/workflows/"):
            jobs = doc.get("jobs") or {}
            if not doc.get("name"):
                problems.append(f"{path}: no `name:`")
            # PyYAML resolves the bare key `on` to the boolean True (YAML 1.1).
            if "on" not in doc and True not in doc:
                problems.append(f"{path}: no trigger (`on:`)")
            if not isinstance(jobs, dict) or not jobs:
                problems.append(f"{path}: no jobs")
                jobs = {}
            for job_id, job in jobs.items():
                if not isinstance(job, dict):
                    problems.append(f"{path}: job {job_id} is not a mapping")
                    continue
                needs = job.get("needs") or []
                needs = [needs] if isinstance(needs, str) else needs
                for dep in needs:
                    if dep not in jobs:
                        problems.append(
                            f"{path}: job {job_id} needs `{dep}`, which is not "
                            "a job in this file")
                if not job.get("steps") and not job.get("uses"):
                    problems.append(f"{path}: job {job_id} has no steps")
            names = [j.get("name", jid) for jid, j in jobs.items()
                     if isinstance(j, dict)]
            detail = f"{len(jobs)} job(s): " + ", ".join(str(n) for n in names)

        elif path.startswith(".github/ISSUE_TEMPLATE/"):
            if path.endswith("config.yml"):
                if "blank_issues_enabled" not in doc:
                    problems.append(f"{path}: no `blank_issues_enabled:`")
                links = doc.get("contact_links")
                if links is None:
                    problems.append(f"{path}: no `contact_links:` key")
                    links = []
                for link in links or []:
                    for key in ("name", "url", "about"):
                        if not (isinstance(link, dict) and link.get(key)):
                            problems.append(f"{path}: a contact link has no `{key}`")
                detail = f"{len(links or [])} contact link(s)"
            else:
                for key in ("name", "description", "body"):
                    if not doc.get(key):
                        problems.append(f"{path}: no `{key}:`")
                body = doc.get("body") or []
                boxes = 0
                for i, item in enumerate(body):
                    if not isinstance(item, dict):
                        problems.append(f"{path}: body[{i}] is not a mapping")
                        continue
                    kind = item.get("type")
                    if kind not in ITEM_TYPES:
                        problems.append(f"{path}: body[{i}] type {kind!r} is "
                                        "not one GitHub accepts")
                        continue
                    attrs = item.get("attributes") or {}
                    if kind == "markdown":
                        if not attrs.get("value"):
                            problems.append(f"{path}: body[{i}] markdown is empty")
                    elif not attrs.get("label"):
                        problems.append(f"{path}: body[{i}] ({kind}) has no label")
                    if kind == "checkboxes":
                        opts = attrs.get("options") or []
                        boxes += len(opts)
                        if not opts:
                            problems.append(f"{path}: body[{i}] has no options")
                        for o in opts:
                            if not (isinstance(o, dict) and o.get("label")):
                                problems.append(
                                    f"{path}: body[{i}] has an option with no label")
                    if kind == "dropdown" and not (attrs.get("options") or []):
                        problems.append(f"{path}: body[{i}] dropdown has no options")
                detail = f"{len(body)} body item(s), {boxes} checkbox(es)"

        print(f"  ok    {path}" + (f"  ({detail})" if detail else ""))

    print()
    if problems:
        print(f"{len(problems)} problem(s):")
        for p in problems:
            print(f"  - {p}")
        return 1
    print(f"all {len(paths)} YAML file(s) under .github/ parse and have the "
          "shape GitHub requires")
    return 0


if __name__ == "__main__":
    sys.exit(main())
