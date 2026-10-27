#!/usr/bin/env python3
"""Properties of docs/eri-backlog.json. Called by tools/t/backlog_cases.sh.

Properties, not counts. A count assertion would go red the moment ERI adds a
row, which is the one time you most want the gate to stay out of the way and
let you read the diff.
"""
from __future__ import annotations

import json
import os
import re
import sys

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
BACKLOG = "docs/eri-backlog.json"
MD = "docs/eri-backlog.md"
fails: list[str] = []


def check(ok: bool, label: str, detail: str = "") -> None:
    print(f"  {'ok  ' if ok else 'FAIL'}  {label:<50} {detail}")
    if not ok:
        fails.append(label)


if not os.path.exists(BACKLOG):
    print(f"  FAIL  {BACKLOG} is missing")
    sys.exit(1)

data = json.load(open(BACKLOG, encoding="utf-8"))
entries = data["entries"]
ids = [e["id"] for e in entries]

check(len(ids) == len(set(ids)), "every ID is unique", f"{len(ids)} IDs")
check(all(re.fullmatch(r"P\d+-(F|US)\d+", i) for i in ids),
      "every ID matches P<n>-F<i> / P<n>-US<i>")
check(all(e["text"].strip() for e in entries),
      "every entry carries ERI's text")
check(all(e["kind"] in ("feature", "story") for e in entries),
      "every entry is a feature or a story")
check(all(e["feature"].strip() for e in entries if e["kind"] == "feature"),
      "every feature carries its feature name")
check(all(e["source"].startswith("docs/eri-problem-statements.md#")
          for e in entries),
      "every entry cites the source document and heading")

# Positional and contiguous: P2-F1..P2-F8 with nothing missing. A gap would
# mean a table row was silently dropped by the parser.
by_group: dict[tuple[str, str], list[int]] = {}
for e in entries:
    kind = "F" if e["kind"] == "feature" else "US"
    n = int(re.sub(r"^P\d+-(?:F|US)", "", e["id"]))
    by_group.setdefault((e["project"], kind), []).append(n)
gaps = [f"{p}-{k}" for (p, k), ns in by_group.items()
        if sorted(ns) != list(range(1, len(ns) + 1))]
check(not gaps, "IDs are contiguous from 1 within each group",
      ", ".join(gaps) if gaps else f"{len(by_group)} groups")

counts = data["counts"]
check(counts["entries"] == len(entries)
      and counts["features"] == sum(1 for e in entries if e["kind"] == "feature")
      and counts["stories"] == sum(1 for e in entries if e["kind"] == "story"),
      "the counts block agrees with the entries",
      f"{counts['features']}F + {counts['stories']}US = {counts['entries']}")

# Every ID in the JSON appears in the markdown table, and vice versa. The two
# files are read by different audiences and must not disagree.
md = open(MD, encoding="utf-8").read()
md_ids = set(re.findall(r"`(P\d+-(?:F|US)\d+)`", md))
check(md_ids == set(ids), "the markdown table and the JSON list the same IDs",
      f"{len(md_ids)} in markdown")

# Every project heading in the source document produced at least one entry. A
# project that parsed to nothing is a silently unclaimable project.
projects_with_entries = {e["project"] for e in entries}
declared = {p["id"] for p in data["projects"]}
check(declared == projects_with_entries,
      "every project in the document produced entries",
      ", ".join(sorted(declared)))

sys.exit(1 if fails else 0)
