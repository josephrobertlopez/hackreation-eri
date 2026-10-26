#!/usr/bin/env python3
"""Guardrail for CI: every committed CSV row must be marked synthetic, and the judges' answer key must never be committed."""
import csv, glob, os, subprocess, sys
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
tracked = subprocess.run(["git", "ls-files"], capture_output=True, text=True).stdout.split()
bad = [f for f in tracked if f.endswith("_answer_key.md")]
for f in [t for t in tracked if t.endswith(".csv")]:
    if "node_modules" in f or f.startswith("data/public/"):
        continue
    rows = list(csv.DictReader(open(f, encoding="utf-8")))
    if rows and "synthetic" in rows[0] and any(r["synthetic"] != "TRUE" for r in rows):
        bad.append(f"{f}: row not marked synthetic")
    if rows and "synthetic" not in rows[0] and "fee_schedule" not in f and "ledger" not in f:
        bad.append(f"{f}: no synthetic column")
print("\n".join(bad) or "synthetic-data guardrail ok")
sys.exit(1 if bad else 0)
