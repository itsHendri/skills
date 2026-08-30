#!/usr/bin/env bash
# Marketplace listing shots. Copy into <project>/listing/ and edit the state
# list at the bottom — everything above is generic.
#
# Shoots the component ALONE (harness ?bare=1 strips the demo page chrome) —
# Framer's listing guidance wants one instance and nothing around it.
#
# Requires the project's preview server (PORT env var, default 5220). Notes carried over from
# hard experience:
#   · --no-sandbox is required; do NOT pass --user-data-dir (it hangs).
#   · --virtual-time-budget fast-forwards timers but NOT the network, so the
#     imagery must already be warm — hence the warm-up shot below.
#   · --force-device-scale-factor=2 gives retina output at half the CSS size.
#   · ?still=1 zeroes transitions AND delays so a state is captured settled,
#     never mid-flight.
set -e
cd "$(dirname "$0")"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT="${PORT:-5220}"
BASE="http://localhost:$PORT/?bare=1&still=1"
OUT="shots"
mkdir -p "$OUT"

shot() { # name, w, h, extra-params, budget
  local name=$1 w=$2 h=$3 extra=$4 budget=${5:-9000}
  "$CHROME" --headless=new --disable-gpu --no-sandbox \
    --force-device-scale-factor=2 --hide-scrollbars \
    --window-size="$w,$h" --virtual-time-budget="$budget" \
    --screenshot="$OUT/$name.png" "$BASE&$extra" 2>/dev/null
  echo "  $name.png  (${w}x${h} @2x)"
}

echo "Warming the image cache…"
shot _warmup 1200 675 "theme=light" 12000
rm -f "$OUT/_warmup.png"

echo "16:9 listing images (2400x1350):"
shot 01-lockup-light   1200 675 "theme=light"
shot 02-lockup-dark    1200 675 "theme=dark"
shot 03-open-light     1200 675 "theme=light&open=4" 14000
shot 04-open-dark      1200 675 "theme=dark&open=4"  14000
shot 05-marker-light   1200 675 "theme=light&hl=100"
# No repulsion/tilt shot: with the debug cursor suppressed (as it must be) the
# frame is near-identical to the resting lockup, so it earns nothing in a
# listing. That interaction only reads in motion — it belongs in the preview.

echo "Square thumbnail (1600x1600):"
shot 06-thumb-light     800 800 "theme=light"
shot 07-thumb-dark      800 800 "theme=dark"

echo
echo "Done → $(pwd)/$OUT"
