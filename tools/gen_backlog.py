#!/usr/bin/env python3
"""Turn ERI's problem statements into a backlog with stable IDs.

ERI's document is prose. A hackathon with an unknown number of teams, several
attempts at the same project, and a reviewer who has to compare them needs
every requirement to have a NAME that a PR can claim and a test can tag. This
script is the only place those names are minted, so they cannot drift.

Two kinds of entry, both taken verbatim from ERI:

  P<n>-F<i>   one row of a project's "Core features" / "Core product features"
              table, in document order
  P<n>-US<i>  one bullet of a project's "User stories" list, in document order

Re-runnable and deterministic: same input bytes in, same output bytes out. No
clock, no environment, no network, no dict-ordering dependence.

    python3 tools/gen_backlog.py            # write docs/eri-backlog.{md,json}
    python3 tools/gen_backlog.py --check    # fail if what's on disk is stale
    python3 tools/gen_backlog.py --quiet    # write, print only the counts

It FAILS LOUDLY and exits 2 when the source document is absent, rather than
emitting an empty backlog. An empty backlog that looks generated is worse than
no backlog: every ID claim would then validate against nothing.

Deliberately NOT inferred from this script: how many features or stories there
ought to be. The counts are reported, never asserted against a hardcoded
number -- if ERI edits the PDF and a table grows a row, the right outcome is a
different count and a visible diff, not a red gate defending yesterday's total.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join("docs", "eri-problem-statements.md")
OUT_MD = os.path.join("docs", "eri-backlog.md")
OUT_JSON = os.path.join("docs", "eri-backlog.json")

PROJECT = re.compile(r"^##\s+Project\s+(\d+):\s+(.+?)\s*$")
SUBSECTION = re.compile(r"^###\s+(\d+)\.\s+(.+?)\s*$")
# "Core features" in projects 1-3, "Core product features" in project 4.
FEATURES_TITLE = re.compile(r"^core\s+(product\s+)?features$", re.I)
STORIES_TITLE = re.compile(r"^user\s+stories$", re.I)
TABLE_SEP = re.compile(r"^\|[\s:|-]+\|$")


def _slug(text: str) -> str:
    """GitHub's heading-anchor rule, matched to tools/check_links.py."""
    text = re.sub(r"[`*_~]", "", text).lower()
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    return re.sub(r"\s", "-", text.strip())


def _cells(line: str) -> list[str]:
    return [c.strip() for c in line.strip().strip("|").split("|")]


def _parse_table(lines: list[str]) -> list[tuple[str, str]]:
    """Two-column rows of the first markdown table in `lines`, header dropped."""
    rows: list[tuple[str, str]] = []
    seen_sep = False
    for line in lines:
        s = line.strip()
        if not s.startswith("|"):
            if rows:
                break  # table ended
            continue
        if TABLE_SEP.match(s):
            seen_sep = True
            rows = []  # anything before the separator was the header
            continue
        cells = _cells(s)
        if len(cells) < 2:
            continue
        if seen_sep:
            rows.append((cells[0], cells[1]))
    return rows


def _parse_bullets(lines: list[str]) -> list[str]:
    """Top-level `- ` bullets, wrapped continuation lines rejoined."""
    bullets: list[str] = []
    for line in lines:
        if re.match(r"^-\s+\S", line):
            bullets.append(line[1:].strip())
        elif bullets and re.match(r"^\s{2,}\S", line):
            bullets[-1] += " " + line.strip()
        elif not line.strip():
            continue
        elif bullets:
            break  # non-bullet, non-continuation prose: list is over
    return [re.sub(r"\s+", " ", b) for b in bullets]


def parse(body: str) -> list[dict]:
    """Every backlog entry, in document order."""
    lines = body.splitlines()
    # Index the project headings first so each project's slice is explicit.
    starts: list[tuple[int, str, str]] = []
    for i, line in enumerate(lines):
        m = PROJECT.match(line)
        if m:
            starts.append((i, m.group(1), m.group(2)))

    entries: list[dict] = []
    for n, (begin, number, title) in enumerate(starts):
        end = starts[n + 1][0] if n + 1 < len(starts) else len(lines)
        anchor = _slug(f"Project {number}: {title}")

        # Split this project into its "### N. Title" subsections.
        subs: list[tuple[int, str, str]] = []
        for i in range(begin, end):
            m = SUBSECTION.match(lines[i])
            if m:
                subs.append((i, m.group(1), m.group(2)))

        features: list[tuple[str, str]] = []
        stories: list[str] = []
        feature_section = story_section = ""
        for k, (sub_begin, sub_number, sub_title) in enumerate(subs):
            sub_end = subs[k + 1][0] if k + 1 < len(subs) else end
            block = lines[sub_begin + 1:sub_end]
            if FEATURES_TITLE.match(sub_title):
                features += _parse_table(block)
                feature_section = f"{sub_number}. {sub_title}"
            elif STORIES_TITLE.match(sub_title):
                stories += _parse_bullets(block)
                story_section = f"{sub_number}. {sub_title}"

        for i, (feature, requirement) in enumerate(features, 1):
            entries.append({
                "id": f"P{number}-F{i}",
                "kind": "feature",
                "project": f"P{number}",
                "project_title": title,
                "section": feature_section,
                "feature": feature,
                "text": requirement,
                "source": f"{SOURCE}#{anchor}",
            })
        for i, story in enumerate(stories, 1):
            entries.append({
                "id": f"P{number}-US{i}",
                "kind": "story",
                "project": f"P{number}",
                "project_title": title,
                "section": story_section,
                "feature": "",
                "text": story,
                "source": f"{SOURCE}#{anchor}",
            })
    return entries


def render_md(entries: list[dict], projects: list[tuple[str, str]]) -> str:
    feats = sum(1 for e in entries if e["kind"] == "feature")
    stories = sum(1 for e in entries if e["kind"] == "story")
    out = [
        "# ERI's backlog, with IDs",
        "",
        "**Generated. Do not edit.** `python3 tools/gen_backlog.py` rebuilds it",
        f"from [{SOURCE}](eri-problem-statements.md), which is the source of",
        "truth. If a line here looks wrong, the source wins and this file is a",
        "bug in the generator.",
        "",
        "Every row has an ID. That ID is what a pull request claims, what a test",
        "is tagged with, and what a reviewer ticks off. IDs are positional within",
        "a project and a kind, so they are stable as long as ERI does not reorder",
        "a table or a list.",
        "",
        f"**{len(entries)} entries: {feats} core features, {stories} user stories,"
        f" across {len(projects)} projects.**",
        "",
        "| Project | Features | User stories |",
        "| --- | --- | --- |",
    ]
    for number, title in projects:
        pid = f"P{number}"
        f = sum(1 for e in entries if e["project"] == pid and e["kind"] == "feature")
        s = sum(1 for e in entries if e["project"] == pid and e["kind"] == "story")
        out.append(f"| {pid} {title} | {f} | {s} |")
    out.append("")

    for number, title in projects:
        pid = f"P{number}"
        mine = [e for e in entries if e["project"] == pid]
        if not mine:
            continue
        anchor = mine[0]["source"].split("#", 1)[1]
        out += [
            f"## {pid}: {title}",
            "",
            f"ERI's own words: [{SOURCE}](eri-problem-statements.md#{anchor})",
            "",
            "| ID | Kind | ERI's text |",
            "| --- | --- | --- |",
        ]
        for e in mine:
            text = e["text"].replace("|", "\\|")
            if e["kind"] == "feature":
                label = e["feature"].replace("|", "\\|")
                cell = f"**{label}** — {text}"
            else:
                cell = text
            out.append(f"| `{e['id']}` | {e['kind']} | {cell} |")
        out.append("")
    return "\n".join(out) + "\n"


def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--check", action="store_true",
                    help="exit 1 if the files on disk differ from a fresh run")
    ap.add_argument("--quiet", action="store_true", help="print counts only")
    args = ap.parse_args(argv)

    os.chdir(REPO)
    if not os.path.exists(SOURCE):
        print(f"ERROR: {SOURCE} is missing. It is ERI's problem statements and "
              "the only source of backlog IDs.", file=sys.stderr)
        print("Refusing to write an empty backlog: every ID claim in every pull "
              "request would then validate against nothing.", file=sys.stderr)
        return 2

    body = open(SOURCE, encoding="utf-8").read()
    entries = parse(body)
    projects = [(m.group(1), m.group(2))
                for m in (PROJECT.match(line) for line in body.splitlines()) if m]

    if not entries:
        print(f"ERROR: parsed 0 backlog entries out of {SOURCE}. Either the "
              "document changed shape (project headings, 'Core features' table, "
              "'User stories' list) or the generator is broken.", file=sys.stderr)
        return 2

    md = render_md(entries, projects)
    payload = {
        "source": SOURCE,
        "generator": "tools/gen_backlog.py",
        "counts": {
            "projects": len(projects),
            "features": sum(1 for e in entries if e["kind"] == "feature"),
            "stories": sum(1 for e in entries if e["kind"] == "story"),
            "entries": len(entries),
        },
        "projects": [{"id": f"P{n}", "title": t} for n, t in projects],
        "entries": entries,
    }
    js = json.dumps(payload, indent=2, ensure_ascii=False, sort_keys=False) + "\n"

    if args.check:
        stale = [p for p, want in ((OUT_MD, md), (OUT_JSON, js))
                 if not os.path.exists(p)
                 or open(p, encoding="utf-8").read() != want]
        if stale:
            for p in stale:
                print(f"STALE: {p} is not what tools/gen_backlog.py produces "
                      f"from {SOURCE}", file=sys.stderr)
            print("Run: python3 tools/gen_backlog.py", file=sys.stderr)
            return 1
        print(f"backlog ok ({len(entries)} entries, {OUT_MD} and {OUT_JSON} "
              "are current)")
        return 0

    open(OUT_MD, "w", encoding="utf-8").write(md)
    open(OUT_JSON, "w", encoding="utf-8").write(js)

    c = payload["counts"]
    if not args.quiet:
        for n, t in projects:
            pid = f"P{n}"
            f = sum(1 for e in entries if e["project"] == pid and e["kind"] == "feature")
            s = sum(1 for e in entries if e["project"] == pid and e["kind"] == "story")
            print(f"  {pid} {t}: {f} features, {s} user stories")
    print(f"wrote {OUT_MD} and {OUT_JSON}: {c['entries']} entries "
          f"({c['features']} features, {c['stories']} stories, "
          f"{c['projects']} projects)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
