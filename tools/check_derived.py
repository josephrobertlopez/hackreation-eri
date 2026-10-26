#!/usr/bin/env python3
"""Fail if a derived file has drifted from its source.

Two things in this repo are copies with a generator, and neither had a gate.
challenges/02 and 03 already prove the pattern works: `npm run sync:wp` plus
`git diff --exit-code -- wp-plugin` in CI. That guard caught a real
accessibility regression. These two did not have an equivalent, so they were
correct only for as long as nobody edited the source.

1. llms-full.txt is built from wiki/ by tools/build_llms_full.py. The README
   points AI coding tools at the wiki, and this is the flattened copy they
   read. A stale copy means every assistant at the event is answering from
   outdated domain rules, including the benefits rules.

2. challenges/01-funding-gap-finder/data/ is a byte-identical copy of the
   shared data/. Challenge 01's tests assert exact counts (22 flags, 5
   unclaimed Ticket payments, 10 under-claimed county months). If the shared
   data is regenerated, the challenge keeps grading against its old copy and
   agrees with nothing.
"""
import filecmp
import os
import subprocess
import sys

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

CHALLENGE_01_DATA = "challenges/01-funding-gap-finder/data"
problems = []


def check_llms_full():
    """Rebuild llms-full.txt and compare against what is committed."""
    if not os.path.exists("llms-full.txt"):
        problems.append("llms-full.txt is missing; run tools/build_llms_full.py")
        return
    with open("llms-full.txt", "rb") as fh:
        before = fh.read()
    proc = subprocess.run(
        [sys.executable, "tools/build_llms_full.py"],
        capture_output=True, text=True, check=False,
    )
    if proc.returncode != 0:
        problems.append(f"tools/build_llms_full.py failed: {proc.stderr.strip()[:200]}")
        return
    with open("llms-full.txt", "rb") as fh:
        after = fh.read()
    if before != after:
        # Put the committed version back; this is a check, not a fixer.
        with open("llms-full.txt", "wb") as fh:
            fh.write(before)
        problems.append(
            f"llms-full.txt is stale ({len(before)} bytes committed, "
            f"{len(after)} regenerated). Run: python3 tools/build_llms_full.py"
        )


def check_challenge_data():
    """Every CSV under the challenge's data/ must match the shared data/."""
    if not os.path.isdir(CHALLENGE_01_DATA):
        return
    for root, _dirs, names in os.walk(CHALLENGE_01_DATA):
        for name in names:
            if not name.endswith(".csv"):
                continue
            copy = os.path.join(root, name)
            shared = os.path.join("data", os.path.relpath(copy, CHALLENGE_01_DATA))
            if not os.path.exists(shared):
                problems.append(f"{copy}: no matching file at {shared}")
            elif not filecmp.cmp(copy, shared, shallow=False):
                problems.append(
                    f"{copy} has drifted from {shared}. "
                    f"Copy the shared file over it, or delete the copy."
                )


check_llms_full()
check_challenge_data()

if problems:
    print("derived files are stale:")
    for p in problems:
        print(f"  {p}")
    sys.exit(1)
print("derived files current (llms-full.txt, challenge 01 data copy)")
