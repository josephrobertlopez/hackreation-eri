#!/usr/bin/env python3
"""Guardrail for CI and for laptops: every CSV must be marked synthetic, and
the judges' answer key must never be committed.

Scans the union of git-tracked files AND files present on disk. Both halves
matter and they catch different things:

  * tracked-only (the original behaviour) misses a CSV that has been dropped
    into data/ but not committed yet -- which is exactly when you want to be
    told, because the commit IS the exposure on a public repo.
  * disk-only would miss a file deleted from the working tree but still in
    history.

It also refuses to run vacuously. The original enumerated with `git ls-files`
alone, so outside a git checkout -- for example from the distributed zip --
`tracked` was empty, the loop ran zero times, and it printed "ok" and exited
0 while 27 real CSVs sat unread. A guard that cannot see anything must fail,
never pass.
"""
import csv
import glob
import os
import subprocess
import sys

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))


def fail(msg):
    print(f"synthetic-data guardrail FAILED: {msg}", file=sys.stderr)
    sys.exit(1)


def tracked_files():
    """Files git knows about, plus whether git could be consulted at all.

    Returns (files, reason_unavailable). reason_unavailable is None when git
    worked. This does NOT abort when git is missing: the day-of workspace
    image is built by infra/generate.py, which copies the repo WITHOUT .git on
    purpose, and the kickoff deck tells attendees to run tools/check.sh there.
    Aborting would break the event; passing silently would be the original
    bug. So the CSV scan below runs at full strength either way, and only the
    answer-key half -- which is inherently about what is committed -- is
    reported as not checked.
    """
    try:
        proc = subprocess.run(
            ["git", "ls-files"], capture_output=True, text=True, check=False
        )
    except FileNotFoundError:
        return [], "git is not installed"
    if proc.returncode != 0:
        return [], "not a git repository (unzipped, or a copy without .git)"
    files = proc.stdout.split()
    if not files:
        return [], "git reported zero tracked files"
    return files, None


# Directories that only ever hold generated output. Scanning the working tree
# means generated files show up too: infra/generate.py writes infra/out/teams.csv,
# the per-team handout sheet, which has no synthetic column by design and is
# not data. These are skipped even when git cannot tell us they are ignored.
GENERATED_PREFIXES = ("infra/out/", "data/public/")


def ignored_by_git():
    """Paths git is configured to ignore. Empty when git cannot be consulted."""
    proc = subprocess.run(
        ["git", "ls-files", "--others", "--ignored", "--exclude-standard"],
        capture_output=True, text=True, check=False,
    )
    return set(proc.stdout.split()) if proc.returncode == 0 else set()


def in_scope(path, ignored):
    """Skip vendored code, generated output and anything git ignores."""
    norm = path[2:] if path.startswith("./") else path
    if "node_modules" in norm or "/vendor/" in norm:
        return False
    if norm.startswith(GENERATED_PREFIXES):
        return False
    return norm not in ignored


def main():
    tracked, no_git = tracked_files()

    # Answer keys are about what is COMMITTED, so this half stays tracked-only.
    bad = [f"{f}: judges' answer key must not be committed"
           for f in tracked if f.endswith("_answer_key.md")]

    ignored = set() if no_git else ignored_by_git()
    on_disk = glob.glob("**/*.csv", recursive=True)
    csvs = sorted({f for f in list(tracked) + on_disk
                   if f.endswith(".csv") and in_scope(f, ignored)})
    if not csvs:
        fail("found no CSVs to check. Expected the synthetic datasets under "
             "data/ -- refusing to pass without having inspected anything.")

    for f in csvs:
        where = "committed" if f in tracked else "not committed yet"
        try:
            with open(f, encoding="utf-8") as fh:
                rows = list(csv.DictReader(fh))
        except OSError as exc:
            bad.append(f"{f}: could not be read ({exc})")
            continue
        if not rows:
            continue
        if "synthetic" in rows[0]:
            offenders = sum(1 for r in rows if (r.get("synthetic") or "").strip().upper() != "TRUE")
            if offenders:
                bad.append(f"{f} [{where}]: {offenders} row(s) not marked synthetic=TRUE")
        elif "fee_schedule" not in f and "ledger" not in f:
            bad.append(f"{f} [{where}]: no synthetic column")

    if bad:
        print("\n".join(bad))
        sys.exit(1)

    if no_git:
        # Say exactly what was and was not proven. "ok" with an unstated gap
        # is how the original version passed while reading nothing.
        print(f"synthetic-data guardrail ok ({len(csvs)} CSVs checked from disk)")
        print(f"  NOTE: {no_git}, so the committed-answer-key check did not run.")
        print("  The CSV scan above is unaffected and ran in full.")
    else:
        print(f"synthetic-data guardrail ok ({len(csvs)} CSVs checked, "
              f"{len(tracked)} files tracked)")


if __name__ == "__main__":
    main()
