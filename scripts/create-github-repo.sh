#!/usr/bin/env bash
set -euo pipefail
OWNER="${1:-AttractAcq}"
REPO="${2:-cockpit-programme-orchestrator}"
VISIBILITY="${3:---private}"

gh auth status
gh repo create "$OWNER/$REPO" "$VISIBILITY" --source=. --remote=origin --push
