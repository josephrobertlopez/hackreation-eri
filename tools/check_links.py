#!/usr/bin/env python3
"""Fail if a relative markdown link points to a missing file, or to a heading
that does not exist. Used by CI and tools/check.sh.

The file half of this check is old. The ANCHOR half was added 2026-10-26 after
a gate review: the previous regex captured the path and threw the fragment
away, so every `](page.md#section)` in the repo was unverified, and a link
written to a heading that never existed passed green. One was already broken
when this was written (`tech-stack.md#eris-limits-on-ai`), which is the
positive control this checker was tested against -- if you change the slug
logic, re-break an anchor on purpose and confirm this still goes red.

Slugs follow GitHub's rule: take the heading text, drop inline markdown
markers, lowercase, delete everything that is not alphanumeric / space /
hyphen / underscore, then spaces to hyphens. Em dashes and apostrophes
therefore VANISH rather than becoming hyphens, which is the part people get
wrong by hand: "ERI's limits on AI -- read this" becomes
"eris-limits-on-ai--read-this", with the double hyphen the dash left behind.

Deliberately conservative, because a false red here fires during an event:
 * a fragment is only checked when its target is a markdown file we scanned,
   so links into HTML, PDFs or generated output are left alone;
 * explicit <a id=> / <a name=> and {#custom-id} anchors count as headings;
 * a duplicate heading also registers its -1, -2 ... forms, as GitHub does.
"""
import glob, os, re, sys

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
# infra/generate.py writes a full copy of the repo into infra/out/ with infra/
# excluded, so that copy's README link to infra/README.md is broken by design.
# Scanning generated output turned the documented T-2 dry run into a red gate.
SKIP = ("infra/out/", "data/public/")
files = [f for f in glob.glob("**/*.md", recursive=True)
         if "node_modules" not in f and "/vendor/" not in f
         and not f.replace(os.sep, "/").startswith(SKIP)] + ["llms.txt"]

LINK = re.compile(r"\]\(([^)#\s]*)(?:#([^)\s]*))?\)")
HEADING = re.compile(r"^(#{1,6})\s+(.+?)\s*$", re.M)
EXPLICIT = re.compile(r"""<a\s[^>]*\b(?:id|name)\s*=\s*["']([^"']+)["']""", re.I)
CUSTOM_ID = re.compile(r"\{#([A-Za-z0-9_-]+)\}\s*$")
INLINE_MD = re.compile(r"[`*_~]|\[([^\]]*)\]\([^)]*\)")


def slug(text):
    text = CUSTOM_ID.sub("", text)
    text = INLINE_MD.sub(lambda m: m.group(1) or "", text)
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    return re.sub(r"\s", "-", text.strip())


def anchors_of(path):
    """Every fragment that resolves inside this markdown file."""
    try:
        body = open(path, encoding="utf-8").read()
    except OSError:
        return None
    found, seen = set(), {}
    for _, text in HEADING.findall(body):
        custom = CUSTOM_ID.search(text)
        if custom:
            found.add(custom.group(1).lower())
        s = slug(text)
        if not s:
            continue
        n = seen.get(s, 0)
        found.add(s if n == 0 else f"{s}-{n}")
        seen[s] = n + 1
    found.update(a.lower() for a in EXPLICIT.findall(body))
    return found


scanned = {os.path.normpath(f) for f in files}
cache, broken = {}, []
for p in files:
    for target, frag in LINK.findall(open(p, encoding="utf-8").read()):
        if target.startswith(("http", "mailto:", "tel:")):
            continue
        dest = os.path.normpath(os.path.join(os.path.dirname(p), target)) if target else os.path.normpath(p)
        if target and not os.path.exists(dest):
            broken.append(f"{p}: {target} (no such file)")
            continue
        if not frag or dest not in scanned:
            continue
        if dest not in cache:
            cache[dest] = anchors_of(dest)
        have = cache[dest]
        if have is not None and frag.lower() not in have:
            where = "this file" if dest == os.path.normpath(p) else target
            broken.append(f"{p}: #{frag} -> no such heading in {where}")

print("\n".join(broken) or f"links ok ({len(files)} files, anchors checked)")
sys.exit(1 if broken else 0)
