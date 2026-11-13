#!/usr/bin/env python3
"""Regenerate /words/ from the engine, so the page cannot drift from the real pool.

The page used to be hand written and still advertised 103 words while the engine
held 571. Run this after changing any trait bank:

    python3 build_words.py
"""
import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent
LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

NODE = r"""
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync('assets/floral/engine.js', 'utf8');
const c = { window: {}, document: {}, console }; c.window = c;
vm.createContext(c); vm.runInContext(src, c);
const A = c.window.Acrostia;
const occs = A.occasions();
const out = {};
for (const L of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  const seen = {}, list = [];
  for (const o of occs) {
    for (const w of A.words(L, o)) {
      if (!seen[w.word]) { seen[w.word] = 1; list.push(w); }
    }
  }
  list.sort((a, b) => a.word.localeCompare(b.word));
  out[L] = list;
}
process.stdout.write(JSON.stringify(out));
"""


def main() -> int:
    raw = subprocess.run(["node", "-e", NODE], cwd=ROOT, capture_output=True, text=True, check=True)
    banks = json.loads(raw.stdout)
    total = sum(len(v) for v in banks.values())

    sections = []
    for L in LETTERS:
        items = "\n".join(
            f'      <li><strong>{w["word"]}</strong> <span>{w["desc"]}</span></li>' for w in banks[L]
        )
        sections.append(
            f'    <section class="letter-block" id="{L}"><h2>{L}</h2><ul>\n{items}\n    </ul></section>'
        )

    page = ROOT / "words/index.html"
    html = page.read_text(encoding="utf-8")

    start = html.index('    <section class="letter-block" id="A">')
    end = html.index('</section>', html.index('id="Z"')) + len('</section>')
    html = html[:start] + "\n".join(sections) + html[end:]

    for old in ["103 positive trait words", "103 positive words", "103 warm, positive words"]:
        html = html.replace(old, old.replace("103", str(total)))

    page.write_text(html, encoding="utf-8")
    print(f"{total} words across {len(LETTERS)} letters")
    print("  " + "  ".join(f"{L}:{len(banks[L])}" for L in LETTERS))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
