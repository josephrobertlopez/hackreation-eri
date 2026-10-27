#!/usr/bin/env python3
"""Validate what a pull request DECLARES against the backlog and the diff.

With an unknown number of teams and several attempts at the same project, the
reviewer's first question is always the same: which project is this, and which
of ERI's requirements does it claim? This makes that answer machine-checkable,
so a human never has to reconstruct it from the diff.

TWO FAMILIES OF ID, both legitimate to cite, validated against both sources:

  * the BACKLOG -- `P2-F4`, `P2-US2` -- generated from ERI's core-features
    tables and user-story lists. These are things somebody BUILDS, so these
    are what an attempt claims, and what two attempts at the same problem are
    compared on.
  * the FROZEN SPEC -- `P2-M3`, `P2-A4`, `P2-S1`, `P2-X6`, and whatever other
    families a project's `spec/acceptance.md` defines -- MVP steps,
    accessibility requirements, success criteria, out-of-scope prohibitions.
    A pull request is CHECKED against these rather than claiming them, but
    citing one is a normal and useful thing to do: "this PR is the fix for
    P2-A4" is exactly what a reviewer wants in the body.

An earlier version of this file knew only the backlog, and would have rejected
a body citing `P2-M3` -- a real ID, in the frozen spec, that a team had every
reason to name. Found by the P2 build agent before any of this ran against a
real pull request.

What this FAILS on (mechanical facts, no judgement involved):

 1. a cited ID that is in NEITHER the backlog nor any project's frozen spec --
    a typo'd ID is a claim about nothing, and reads as coverage it does not
    have;
 2. IDs spanning more than one project, or a diff touching more than one
    project folder -- one attempt per pull request, so two attempts are never
    scored as one;
 3. a declared project that is not the project the diff touches;
 4. an attempt citing no IDs at all;
 5. any of ERI's three prohibitions missing from the declaration or left
    unticked. Those are ERI's own constraints, and ticking them is an
    author's statement of fact, not an opinion a reviewer can supply later.

What this deliberately only REPORTS, never fails on: the accessibility
self-check and the human protocol results. Both are judgements a person makes
by using the thing with a keyboard and a screen reader. A green tick from CI
on either would be a lie about what was measured, and the lie would then be
the artefact a reviewer trusts.

    PR_BODY="$(cat body.md)" tools/check_claims.py --changed changed.txt

Exits 2 when the backlog itself is missing, which means the repo cannot
validate any claim at all.
"""
from __future__ import annotations

import argparse
import glob
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKLOG = os.path.join("docs", "eri-backlog.json")
ACCEPTANCE_GLOB = os.path.join("challenges", "p[0-9]*-*", "spec", "acceptance.md")
PROJECT_DIR = re.compile(r"^challenges/(p(\d+)-[a-z0-9-]+)/")

# Any family, not just F and US: a project's frozen spec mints its own (M, A,
# S, X, and others -- P4 uses V, P1 uses D and N). Validation is against what
# those files actually contain, so the families do not need listing here, and
# a project inventing a sixth family needs no change to this script.
ID = re.compile(r"\bP(\d+)-([A-Z]{1,3})(\d+)\b")
# Families the backlog mints. Everything else comes from a frozen spec.
BACKLOG_FAMILIES = ("F", "US")
HTML_COMMENT = re.compile(r"<!--.*?-->", re.S)
TICKED = re.compile(r"^\s*[-*]\s*\[[xX]\]\s*(.+)$")
UNTICKED = re.compile(r"^\s*[-*]\s*\[\s*\]\s*(.+)$")

# ERI's prohibitions, keyed by a phrase the author must leave in the line. The
# key is what the error message names, so a reviewer can find the exact line.
PROHIBITIONS = [
    ("disability or diagnosis",
     "no field, question or required step asks for a disability or diagnosis"),
    ("scores or ranks",
     "nothing in this attempt scores or ranks candidates"),
    ("automated hiring or accommodation",
     "nothing makes an automated hiring or accommodation decision"),
]

# Reported, not gated. ERI's own accessibility requirements, as a self-check.
# Each phrase must appear in exactly ONE checkbox line of the pull request
# template: checkbox_state() returns the first line that contains it, so two
# lines sharing a phrase would make one of them unreportable.
SELF_CHECK = [
    "keyboard", "screen reader", "label", "contrast", "320", "time limit",
]
PROTOCOL = ["protocol", "persona", "plain language", "unassisted"]


def strip_comments(body: str) -> str:
    return HTML_COMMENT.sub("", body)


def field(body: str, label: str) -> str:
    """The text after a `**Label:**` / `Label:` line, markdown markers gone.

    Horizontal whitespace only -- `[ \\t]*`, never `\\s*`. `\\s` matches a
    newline, so an EMPTY `**Project:**` line let the pattern run on and
    capture the next line: a pull request that declared no project read as
    declaring whatever the following line happened to mention. Found by
    tools/t/claims_cases.sh, which is why that file exists.
    """
    pat = re.compile(r"^[ \t>*_#-]*" + re.escape(label)
                     + r"[ \t]*:?\**[ \t]*:?[ \t]*(.*)$", re.I | re.M)
    m = pat.search(body)
    if not m:
        return ""
    return re.sub(r"[*_`]", "", m.group(1)).strip()


def declared_ids(body: str) -> list[str]:
    """IDs on the claim line, in the order written, duplicates collapsed."""
    raw = field(body, "Backlog IDs claimed")
    out = [f"P{a}-{k}{n}" for a, k, n in ID.findall(raw)]
    return list(dict.fromkeys(out))


def acceptance_ids() -> tuple[dict[str, str], dict[str, str]]:
    """IDs each project's frozen spec defines.

    Returns (id -> the file that defines it, project -> that file). The spec
    files are authored by the project builds, not generated here, so this
    scrapes rather than parses: a family is whatever a file actually contains,
    and a project inventing a new one needs no change to this script.
    """
    ids: dict[str, str] = {}
    files: dict[str, str] = {}
    for path in sorted(glob.glob(ACCEPTANCE_GLOB)):
        path = path.replace(os.sep, "/")
        m = re.match(r"^challenges/p(\d+)-", path)
        if m:
            files[f"P{m.group(1)}"] = path
        try:
            body = open(path, encoding="utf-8").read()
        except OSError:
            continue
        for a, k, n in ID.findall(body):
            ids.setdefault(f"P{a}-{k}{n}", path)
    return ids, files


def declared_project(body: str) -> str:
    raw = field(body, "Project")
    m = re.search(r"\bP([1-9]\d*)\b", raw)
    return f"P{m.group(1)}" if m else ""


def touched_projects(changed: list[str]) -> dict[str, str]:
    out: dict[str, str] = {}
    for c in changed:
        m = PROJECT_DIR.match(c.replace(os.sep, "/"))
        if m:
            out[f"P{m.group(2)}"] = f"challenges/{m.group(1)}"
    return dict(sorted(out.items()))


def checkbox_state(body: str, phrase: str) -> str:
    """'ticked', 'unticked', or 'missing' for the box whose text has `phrase`.

    Markdown emphasis is stripped before matching, so a phrase still matches a
    line that bolded part of it (`**scores or ranks**`) or bolded across it.
    """
    want = phrase.lower()
    for line in body.splitlines():
        for pat, state in ((TICKED, "ticked"), (UNTICKED, "unticked")):
            m = pat.match(line)
            if not m:
                continue
            text = re.sub(r"[*_`]", "", m.group(1)).lower()
            if want in text:
                return state
    return "missing"


def summarise(lines: list[str]) -> None:
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    text = "\n".join(lines) + "\n"
    print(text)
    if path:
        with open(path, "a", encoding="utf-8") as fh:
            fh.write(text)


def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--changed", help="file holding one changed path per line")
    ap.add_argument("--body-file", help="read the PR body from this file")
    ap.add_argument("--body-env", default="PR_BODY",
                    help="environment variable holding the PR body "
                         "(default PR_BODY; never interpolate a PR body into a "
                         "shell command)")
    args = ap.parse_args(argv)

    os.chdir(REPO)
    if not os.path.exists(BACKLOG):
        print(f"ERROR: {BACKLOG} is missing, so no backlog ID can be validated.",
              file=sys.stderr)
        print("Run: python3 tools/gen_backlog.py", file=sys.stderr)
        return 2
    backlog = json.load(open(BACKLOG, encoding="utf-8"))
    known = {e["id"]: e for e in backlog["entries"]}
    titles = {p["id"]: p["title"] for p in backlog["projects"]}
    spec_ids, spec_files = acceptance_ids()

    if args.body_file:
        body = open(args.body_file, encoding="utf-8").read()
    else:
        body = os.environ.get(args.body_env, "")
    body = strip_comments(body)

    changed: list[str] = []
    if args.changed and os.path.exists(args.changed):
        changed = [ln.strip() for ln in
                   open(args.changed, encoding="utf-8").read().splitlines()
                   if ln.strip()]
    touched = touched_projects(changed)

    claimed = declared_ids(body)
    project = declared_project(body)
    errors: list[str] = []
    report: list[str] = ["## Attempt declaration", ""]

    # A pull request is an ATTEMPT when it declares a project, or when its diff
    # sits inside exactly one project folder. Everything else is some other
    # kind of change and is not held to the attempt rules.
    #
    # The second case matters and an earlier version got it wrong: it failed
    # ANY diff touching two project folders, which means the same accessibility
    # bug fixed in two projects, or one shared fixture corrected, was a red
    # pull request. That pushes useful work into two PRs for no reason, or into
    # nobody doing it. Two folders is only a problem when someone is claiming
    # an attempt, because two attempts scored as one is what the comparison
    # cannot survive.
    where = ", ".join(f"{k} ({v})" for k, v in touched.items())
    if not project and len(touched) != 1:
        if not touched:
            report += ["Not an attempt: no project declared and no "
                       "`challenges/p<n>-*` folder touched. Repo-wide gates "
                       "only."]
        else:
            report += [f"**Cross-project change, not an attempt:** {where}.",
                       "",
                       "No project is declared, so nothing is being claimed. A "
                       "reviewer reads this as a shared fix; every touched "
                       "project's suite runs. Declare a project only if this "
                       "is an attempt, and then make it one project."]
        summarise(report)
        return 0

    if project and len(touched) > 1:
        errors.append(
            f"declared as an attempt at {project}, but the diff touches more "
            f"than one project folder ({where}). One attempt per pull request: "
            "open one PR per project so each is reviewed and compared on its "
            "own. If this is a shared fix rather than an attempt, remove the "
            "`**Project:**` line.")

    claimed_projects = sorted({f"P{ID.match(c).group(1)}" for c in claimed})
    if len(claimed_projects) > 1:
        errors.append("the claimed IDs span %s. One attempt per pull request."
                      % ", ".join(claimed_projects))

    if not project:
        errors.append("no `**Project:**` line in the pull request body. Write "
                      "`**Project:** P2` (one of %s)."
                      % ", ".join(sorted(titles)))
    elif project not in titles:
        errors.append(f"declared project {project} is not one of ERI's "
                      f"projects ({', '.join(sorted(titles))}).")
    elif touched and project not in touched:
        errors.append("declared project %s, but the diff touches %s. Declare "
                      "the project the code is in." % (project, ", ".join(touched)))

    if not claimed:
        errors.append(
            "no IDs cited. Write `**Backlog IDs claimed:** P2-F4, P2-US2` "
            "using IDs from docs/eri-backlog.md, plus any frozen-spec IDs "
            "(P2-M3, P2-A4) this change answers. An attempt that cites nothing "
            "cannot be compared with another attempt at the same problem.")
    unknown = [c for c in claimed if c not in known and c not in spec_ids]
    if unknown:
        where = "docs/eri-backlog.md"
        if project and project in spec_files:
            where += f" and {spec_files[project]}"
        elif spec_files:
            where += " and challenges/p<n>-*/spec/acceptance.md"
        errors.append("these IDs are in neither the backlog nor any project's "
                      "frozen spec: %s. Valid IDs live in %s (regenerate the "
                      "backlog with `python3 tools/gen_backlog.py`)."
                      % (", ".join(unknown), where))
    if project and claimed_projects and claimed_projects != [project]:
        errors.append("declared project %s but the cited IDs belong to %s."
                      % (project, ", ".join(claimed_projects)))

    for phrase, meaning in PROHIBITIONS:
        state = checkbox_state(body, phrase)
        if state == "missing":
            errors.append("ERI's prohibition declaration is missing the line "
                          f"containing \"{phrase}\" ({meaning}). Restore the "
                          "pull request template's declaration block.")
        elif state == "unticked":
            errors.append(f"ERI's prohibition \"{phrase}\" is not ticked "
                          f"({meaning}). ERI wrote this constraint; the author "
                          "declares it, nobody else can.")

    # ---- report ---------------------------------------------------------
    if project:
        report.append(f"**Project:** {project} — {titles.get(project, '?')}")
    if touched:
        report.append("**Folder(s) touched:** " + ", ".join(touched.values()))

    built = [c for c in claimed if c in known]
    cited = [c for c in claimed if c not in known]
    if built:
        report += ["", "**Backlog claimed** — things ERI asked to be built, and "
                       "what this attempt is compared on:", "",
                   "| ID | Kind | ERI's text |", "| --- | --- | --- |"]
        for c in built:
            e = known[c]
            text = (e["feature"] + " — " if e["feature"] else "") + e["text"]
            report.append(f"| `{c}` | {e['kind']} | {text[:160]} |")
    if cited:
        report += ["", "**Frozen-spec IDs cited** — acceptance criteria, "
                       "accessibility requirements, success criteria and "
                       "prohibitions. Checked against, not claimed as built:",
                   "", "| ID | Family | Defined in |", "| --- | --- | --- |"]
        for c in cited:
            m = ID.match(c)
            fam = m.group(2) if m else "?"
            src = spec_ids.get(c)
            note = ""
            if fam == "X":
                note = " (ERI ruled this out — cited as a constraint respected)"
            report.append(f"| `{c}` | {fam}{note} | "
                          f"{src or '**UNKNOWN**'} |")
    if claimed and not built:
        report += ["", "No backlog feature or story is claimed: this change "
                       "cites only acceptance or constraint IDs. That is a "
                       "legitimate pull request (a fix, a test, an "
                       "accessibility repair) — it is just not an attempt that "
                       "gets compared against other attempts on coverage."]

    # The frozen spec is where M / A / S / X IDs come from. If the declared
    # project has no acceptance file, say so: a reviewer reading "P2-A4 is
    # satisfied" needs to know whether anything defines P2-A4 at all. Not an
    # error -- the project folders are authored during the event.
    if project and project not in spec_files:
        report += ["", f"**No frozen spec found for {project}** — expected "
                       f"`challenges/{project.lower()}-*/spec/acceptance.md`. "
                       "Only backlog IDs can be validated for this project; "
                       "acceptance and constraint IDs have nothing to check "
                       "against yet."]

    report += ["", "### Author's accessibility self-check (reported, not gated)", ""]
    for phrase in SELF_CHECK:
        report.append(f"- `{phrase}`: **{checkbox_state(body, phrase)}**")
    report += ["", "### Human protocol results (reported, not gated)", ""]
    for phrase in PROTOCOL:
        report.append(f"- `{phrase}`: **{checkbox_state(body, phrase)}**")
    report += ["",
               "A keyboard pass, a screen reader pass and a person using the "
               "thing are judgements. CI cannot produce them, so it does not "
               "claim to: a reviewer reads the lines above and decides."]

    if errors:
        report += ["", "### Blocking", ""] + [f"- {e}" for e in errors]
        summarise(report)
        print("\nFAILED: %d problem(s) with this pull request's declaration."
              % len(errors), file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        return 1

    report += ["", "Declaration is consistent with the backlog and the diff."]
    summarise(report)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
