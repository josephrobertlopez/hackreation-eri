#!/usr/bin/env python3
"""Fail if a document quotes ERI's problem statements and stops mid-sentence.

Why this exists. On 2026-10-26 four quotations of ERI's words were found
truncated in one document, each cut at a comma, and each truncation removed the
qualifying clause so that ERI's rule read STRICTER than they wrote it:

  quoted as                                 ERI actually wrote
  "Do not automatically rank candidates"    ...based on disability.
  "Task progress should remain private"     ...unless the employee understands
                                               and agrees to share it.
  "monitor or measure workers"              ...without their knowledge.
  "Minimum viable product"                  Minimum Viable Product (MVP)

Three of those were load-bearing: a whole section concluded that ERI had posed
an irreconcilable demand, or had forbidden an approach, when the clause that
dissolved the problem was the clause that had been dropped. A wrong cost
estimate gets re-derived by whoever reads it. A fabricated prohibition gets
OBEYED. That asymmetry is why this is a gate and not a style note.

Substring matching cannot catch this: every truncation above IS a verbatim
substring of ERI's sentence. So the rule here is about where a quote is allowed
to END:

  a quoted span attributed to ERI must either
    (a) end where ERI's own sentence or list item ends, or
    (b) say out loud that it was cut, with an ellipsis.

Scope is an explicit allowlist (FILES) rather than every markdown file, because
the check only makes sense for documents that speak for ERI. Add a file here
when it starts quoting them.

Conservative by design. A false red in this gate fires during an event, so a
span is only judged when the line it sits on attributes it to ERI -- it names
ERI or cites a section marker. Spans that already carry an ellipsis are
skipped, as are spans under four words, which are terms rather than quotations.
"""
import os
import re
import sys

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

SOURCE = "docs/eri-problem-statements.md"
FILES = [
    "docs/eri-stack-review.md",
    "wiki/prds/p1-show-your-skills.md",
    "wiki/prds/p2-my-workday-assistant.md",
    "wiki/prds/p3-job-coach-connection.md",
    "wiki/prds/p4-employer-hub.md",
    "wiki/company/tech-stack.md",
]

# A line is only checked when it claims to speak for ERI.
ATTRIBUTION = re.compile(r"ERI|§\s*\d|\bsection\s+\d", re.I)
# "..." and '...' spans, straight or curly, at least a few words long.
QUOTED = re.compile(r"[\"“]([^\"“”\n]{12,}?)[\"”]")
ELIDED = ("…", "...")


def norm(s):
    """Collapse whitespace and normalise the punctuation a PDF mangles."""
    s = s.replace("’", "'").replace("‘", "'")
    s = s.replace("“", '"').replace("”", '"')
    s = s.replace("—", "-").replace("–", "-")
    return re.sub(r"\s+", " ", s).strip()


def main():
    try:
        source_raw = open(SOURCE, encoding="utf-8").read()
    except OSError as exc:
        print(f"::error::cannot read the source of truth {SOURCE}: {exc}")
        return 2
    source = norm(source_raw)
    if len(source) < 2000:
        # Fail closed. An empty or stub source would let every quote validate
        # against nothing, which is the failure this gate exists to prevent.
        print(f"::error::{SOURCE} is too short to be the real document")
        return 2

    problems = []
    checked = 0
    for path in FILES:
        if not os.path.exists(path):
            print(f"::error::{path} is in the allowlist but does not exist")
            problems.append(f"{path}: missing")
            continue
        for lineno, line in enumerate(open(path, encoding="utf-8"), 1):
            if not ATTRIBUTION.search(line):
                continue
            for match in QUOTED.finditer(line):
                span = norm(match.group(1))
                if any(e in span for e in ELIDED):
                    continue                      # the cut is declared
                if len(span.split()) < 4:
                    continue                      # a term, not a quotation
                at = source.find(span)
                if at < 0:
                    continue                      # our words, not ERI's
                checked += 1
                if span[-1] in ".?!":
                    continue                      # ends on its own full stop
                after = source[at + len(span):]
                nxt = after[:1]
                if nxt in ("", ".", "?", "!"):
                    continue                      # ERI's sentence ends here too
                tail = norm(after)[:60]
                problems.append(
                    f"{path}:{lineno}: quote stops mid-sentence\n"
                    f'    quoted: "{span}"\n'
                    f'    ERI continues: "{tail}..."\n'
                    f"    fix: finish the sentence, or write an ellipsis to show the cut"
                )

    if problems:
        print("\n".join(problems))
        print(f"\n::error::{len(problems)} truncated quotation(s) of {SOURCE}")
        return 1
    print(f"quotes ok ({checked} ERI quotation(s) checked across {len(FILES)} files)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
