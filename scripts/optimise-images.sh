#!/usr/bin/env bash
# Resizes images over 120KB in public/images/cuisine and public/images/recipes to max 800px wide
# at 75% JPEG quality, replacing originals in place.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$SCRIPT_DIR/.."
LIMIT_KB=150
MAX_PX=800
QUALITY=75
MIN_SAVING_PCT=10
DIRS=("$ROOT/public/images/cuisine" "$ROOT/public/images/recipes")

found=0
processed=0

for dir in "${DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "Skipping $dir (not found)"
    continue
  fi

  while IFS= read -r -d '' file; do
    size_kb=$(( $(wc -c < "$file") / 1024 ))
    found=$(( found + 1 ))

    echo "  [$size_kb KB] $file"
    sips -Z $MAX_PX --setProperty formatOptions $QUALITY "$file" --out "$file.tmp" > /dev/null
    new_kb=$(( $(wc -c < "$file.tmp") / 1024 ))
    saving_pct=$(( (size_kb - new_kb) * 100 / size_kb ))
    if [ "$saving_pct" -lt "$MIN_SAVING_PCT" ]; then
      rm "$file.tmp"
      echo "    → skipped (${saving_pct}% saving < ${MIN_SAVING_PCT}% threshold)"
    else
      mv "$file.tmp" "$file"
      echo "    → ${new_kb} KB after optimise (${saving_pct}% saving)"
      processed=$(( processed + 1 ))
    fi
  done < <(find "$dir" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) -size "+${LIMIT_KB}k" -print0 2>/dev/null)
done

echo ""
echo "Done. Found $found over ${LIMIT_KB}KB, optimised $processed."
