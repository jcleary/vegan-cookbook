#!/usr/bin/env bash
# Resizes images over 120KB in images/cuisine and images/recipes to max 800px wide
# at 75% JPEG quality, replacing originals in place.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$SCRIPT_DIR/.."
LIMIT_KB=150
MAX_PX=800
QUALITY=75
DIRS=("$ROOT/images/cuisine" "$ROOT/images/recipes")

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
    sips -Z $MAX_PX --setProperty formatOptions $QUALITY "$file" --out "$file" > /dev/null
    new_kb=$(( $(wc -c < "$file") / 1024 ))
    echo "    → ${new_kb} KB after optimise"
    processed=$(( processed + 1 ))
  done < <(find "$dir" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) -size "+${LIMIT_KB}k" -print0 2>/dev/null)
done

echo ""
echo "Done. Found $found over ${LIMIT_KB}KB, optimised $processed."
