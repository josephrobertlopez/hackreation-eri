#!/usr/bin/env python3
"""Which project suites does this diff actually need?

Forty pull requests against four projects is 160 suite runs if every PR runs
everything. This maps a changed-file list onto the projects those files belong
to, so a PR that only touches P2 runs P2.

The project list is DISCOVERED from the filesystem (`challenges/p<n>-*`), never
hardcoded. A hardcoded matrix rots the moment a project folder is renamed, and
rots silently: the leg disappears and the aggregator stays green.

Topology changes -- the workflows themselves, the shared tools, ERI's problem
statements -- run every project, because the thing that changed is the thing
that decides what to run.

    tools/derive_touched_projects.py --changed changed.txt
    git diff --name-only origin/main...HEAD | tools/derive_touched_projects.py
    tools/derive_touched_projects.py --all          # full fan-out

Output is one JSON array of objects on stdout:

    [{"id":"P2","dir":"challenges/p2-my-workday-assistant","runner":"npm"}]

With --github-output it also appends `projects=` and `reason=` to $GITHUB_OUTPUT.
An empty diff yields `[]`, which the caller must guard with
`if: needs.detect.outputs.projects != '[]'` -- GitHub Actions expands a matrix
over an empty array into one degenerate empty leg, which then fails on a
missing key rather than skipping.
"""
from __future__ import annotations

import argparse
import glob
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_GLOB = "challenges/p[0-9]*-*"
PROJECT_DIR = re.compile(r"^challenges/p(\d+)-[a-z0-9-]+$")

# A change to any of these decides what runs, so it runs everything.
TOPOLOGY = (
    ".github/workflows/",
    ".github/PULL_REQUEST_TEMPLATE.md",
    "tools/",
    "docs/eri-problem-statements.md",
    "docs/eri-backlog.json",
    "CONTRIBUTING.md",
)


def discover() -> list[dict]:
    """Every project folder that has a suite, in ID order."""
    found = []
    for path in sorted(glob.glob(PROJECT_GLOB)):
        path = path.replace(os.sep, "/")
        m = PROJECT_DIR.match(path)
        if not m or not os.path.isdir(path):
            continue
        if os.path.exists(os.path.join(path, "package.json")):
            runner = "npm"
        elif os.path.exists(os.path.join(path, "composer.json")):
            runner = "composer"
        else:
            # A folder with no manifest cannot be run. Reported, not silently
            # dropped: "its suite did not run" must never look like "it passed".
            runner = "none"
        found.append({"id": f"P{m.group(1)}", "dir": path, "runner": runner})
    return sorted(found, key=lambda p: (len(p["id"]), p["id"]))


def derive(changed: list[str], projects: list[dict]) -> tuple[list[dict], str]:
    if not projects:
        return [], "no challenges/p<n>-* project folders exist in this repo"

    topology = sorted({c for c in changed if c.startswith(TOPOLOGY)})
    if topology:
        return projects, ("topology change (%s) -> every project"
                          % ", ".join(topology[:3])
                          + (f" (+{len(topology) - 3} more)" if len(topology) > 3 else ""))

    hit = {}
    for c in changed:
        for p in projects:
            if c.startswith(p["dir"] + "/"):
                hit[p["id"]] = p
    if not hit:
        return [], (f"{len(changed)} changed file(s), none under a project folder"
                    " -> repo-wide gates only")
    chosen = [p for p in projects if p["id"] in hit]
    return chosen, "changed: " + ", ".join(p["id"] for p in chosen)


def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--changed", help="file holding one changed path per line")
    ap.add_argument("--all", action="store_true",
                    help="every discovered project, whatever the diff")
    ap.add_argument("--github-output", action="store_true",
                    help="also append projects=/reason= to $GITHUB_OUTPUT")
    args = ap.parse_args(argv)

    os.chdir(REPO)
    projects = discover()

    if args.all:
        chosen, reason = projects, "--all -> every discovered project"
    else:
        if args.changed:
            raw = open(args.changed, encoding="utf-8").read()
        elif not sys.stdin.isatty():
            raw = sys.stdin.read()
        else:
            ap.error("give --changed FILE, pipe paths on stdin, or pass --all")
        changed = [ln.strip().replace(os.sep, "/")
                   for ln in raw.splitlines() if ln.strip()]
        chosen, reason = derive(changed, projects)

    blind = [p for p in chosen if p["runner"] == "none"]
    if blind:
        print("ERROR: these project folders were touched but have no "
              "package.json or composer.json, so nothing can be run for them:",
              file=sys.stderr)
        for p in blind:
            print(f"  {p['dir']}", file=sys.stderr)
        print("Restore the folder's manifest, or move the work to a folder that "
              "has one. A suite that cannot run must not report as passing.",
              file=sys.stderr)
        return 2

    payload = json.dumps(chosen, separators=(",", ":"))
    print(payload)
    print(f"# discovered {len(projects)} project(s); {reason}", file=sys.stderr)

    out = os.environ.get("GITHUB_OUTPUT")
    if args.github_output and out:
        with open(out, "a", encoding="utf-8") as fh:
            fh.write(f"projects={payload}\n")
            fh.write(f"reason={reason}\n")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
