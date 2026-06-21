#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/opt/apps/personal-learning-site}"
cd "$APP_DIR"

git fetch --quiet origin main
exec /bin/bash "$APP_DIR/deploy/deploy.sh"
