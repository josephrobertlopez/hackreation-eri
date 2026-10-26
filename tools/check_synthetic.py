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
    """Files git knows about. Fails loudly rather than returning nothing."""
    try:
        proc = subprocess.run(
            ["git", "ls-files"], capture_output=True, text=True, check=False
        )
    except FileNotFoundError:
        fail("git is not installed, so committed files cannot be checked. "
             "Install git, or run this from a git clone rather than a zip.")
    if proc.returncode != 0:
        fail("not a git repository, so committed files cannot be checked. "
             "Clone the repo instead of unzipping it, or run `git init`.\n"
             f"  git said: {proc.stderr.strip().splitlines()[0] if proc.stderr.strip() else 'unknown error'}")
    files = proc.stdout.split()
    if not files:
        fail("git reported zero tracked files. Refusing to pass without "
             "having inspected anything.")
    return files


def in_scope(path):
    """Skip vendored code and the fetched public datasets."""
    return "node_modules" not in path and not path.startswith("data/public/")


def main():
    tracked = tracked_files()

    # Answer keys are about what is COMMITTED, so this half stays tracked-only.
    bad = [f"{f}: judges' answer key must not be committed"
           for f in tracked if f.endswith("_answer_key.md")]

    on_disk = glob.glob("**/*.csv", recursive=True)
    csvs = sorted({f for f in list(tracked) + on_disk
                   if f.endswith(".csv") and in_scope(f)})
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
    print(f"synthetic-data guardrail ok ({len(csvs)} CSVs checked, "
          f"{len(tracked)} files tracked)")


if __name__ == "__main__":
    main()
