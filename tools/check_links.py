#!/usr/bin/env python3
"""Fail if any relative markdown link points to a missing file. Used by CI and tools/check.sh."""
import glob, os, re, sys
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
# infra/generate.py writes a full copy of the repo into infra/out/ with infra/
# excluded, so that copy's README link to infra/README.md is broken by design.
# Scanning generated output turned the documented T-2 dry run into a red gate.
SKIP = ("infra/out/", "data/public/")
files = [f for f in glob.glob("**/*.md", recursive=True)
         if "node_modules" not in f and "/vendor/" not in f
         and not f.replace(os.sep, "/").startswith(SKIP)] + ["llms.txt"]
broken = []
for p in files:
    for m in re.findall(r"\]\(([^)#\s]+)(?:#[^)]*)?\)", open(p, encoding="utf-8").read()):
        if m.startswith(("http", "mailto:", "tel:")):
            continue
        if not os.path.exists(os.path.normpath(os.path.join(os.path.dirname(p), m))):
            broken.append(f"{p}: {m}")
print("\n".join(broken) or f"links ok ({len(files)} files)")
sys.exit(1 if broken else 0)
