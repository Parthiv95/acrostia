#!/usr/bin/env python3
"""Stamp every hashed asset reference with its current content hash.

Browsers hold a stale copy of a script for the whole cache lifetime, which makes a
shipped fix look like it never happened. Run this after touching any asset listed
below, before committing.

    python3 stamp_assets.py
"""
import hashlib
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent
WATCHED = ["assets/floral/engine.js", "assets/studio/app.js"]


def digest(p: pathlib.Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()[:10]


def main() -> int:
    hashes = {}
    for rel in WATCHED:
        p = ROOT / rel
        if not p.exists():
            print(f"missing {rel}")
            return 1
        hashes[rel] = digest(p)

    changed = 0
    for page in ROOT.rglob("*.html"):
        if ".git" in page.parts or "node_modules" in page.parts:
            continue
        html = page.read_text(encoding="utf-8")
        before = html

        def fix(m):
            src = m.group(1)
            base = src.split("?")[0]
            for rel, h in hashes.items():
                if base.endswith(pathlib.PurePosixPath(rel).name):
                    resolved = (page.parent / base).resolve()
                    try:
                        resolved.relative_to(ROOT)
                    except ValueError:
                        return m.group(0)
                    if resolved == (ROOT / rel).resolve():
                        return f'src="{base}?v={h}"'
            return m.group(0)

        html = re.sub(r'src="([^"]*(?:engine\.js|app\.js)[^"]*)"', fix, html)
        if html != before:
            page.write_text(html, encoding="utf-8")
            changed += 1

    for rel, h in hashes.items():
        print(f"{rel} -> {h}")
    print(f"pages updated: {changed}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
