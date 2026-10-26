#!/usr/bin/env bash
# Smoke-test every starter that can run without Docker or network.
set -e
cd "$(dirname "$0")/.."
echo "== data";        python3 -c "import csv,glob;[print(f'  {f}: {sum(1 for _ in csv.DictReader(open(f)))} rows') for f in sorted([g for g in glob.glob('data/**/*.csv',recursive=True) if not g.startswith('data/public')])]"
echo "== php-mysql";   (cd starters/php-mysql && php seed.php && php -r 'require "src/db.php"; echo "  rows in db: ".db()->query("select count(*) from job_postings")->fetchColumn()."\n";' && rm -f eri.sqlite)
echo "== wordpress";   php -l starters/wordpress-plugin/eri-hello/eri-hello.php >/dev/null && php starters/wordpress-plugin/tests/smoke.php
echo "== block";       php -l starters/eri-job-card/eri-job-card.php >/dev/null && test -f starters/eri-job-card/build/eri-job-card/index.js && echo "  PASS block build present"
echo "== ai-helpers";  php starters/ai-helpers/php/hello_llm.php | head -1
if [ -d starters/expo-supabase/node_modules ]; then echo "== expo"; (cd starters/expo-supabase && npx expo export --platform web --output-dir /tmp/eri-expo-check >/dev/null && echo "  PASS expo web export"); fi
echo "== challenge 01"; (cd challenges/01-funding-gap-finder && php tests/smoke.php && rm -f ledger.csv)
echo "== challenge 02"; (cd challenges/02-job-fit-checker && node --test test/*.test.js >/dev/null && echo "  PASS node:test" && { [ -d node_modules ] && npx cucumber-js --format summary >/dev/null && echo "  PASS cucumber" || true; } && php -l wp-plugin/eri-job-fit/eri-job-fit.php >/dev/null)
echo "== challenge 03"; (cd challenges/03-job-post-checker && node --test test/*.test.js >/dev/null && echo "  PASS node:test" && { [ -d node_modules ] && npx cucumber-js --format summary >/dev/null && echo "  PASS cucumber" || true; } && php -l wp-plugin/eri-job-post-checker/eri-job-post-checker.php >/dev/null)
echo "== static-web"; (cd starters/static-web && node --test test/*.test.js >/dev/null && echo "  PASS node:test")
echo "== guardrails"; python3 tools/check_synthetic.py && python3 tools/check_links.py
echo "All smoke tests passed."
