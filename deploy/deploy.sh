#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/opt/apps/personal-learning-site}"
COMPOSE="docker compose --env-file .env -f docker-compose.prod.yml"
cd "$APP_DIR"
DOMAIN="$(sed -n 's/^DOMAIN=//p' .env | tail -n 1 | tr -d '\r')"

if [[ -z "$DOMAIN" ]]; then
  echo "DOMAIN is missing from .env"
  exit 1
fi

previous_commit="$(git rev-parse HEAD)"
target_commit="$(git rev-parse origin/main)"

if [[ "$previous_commit" == "$target_commit" ]]; then
  echo "Already deployed: $target_commit"
  exit 0
fi

rollback() {
  trap - ERR
  echo "Deployment failed. Rolling back to $previous_commit"
  git reset --hard "$previous_commit"
  $COMPOSE build api web
  $COMPOSE up -d --remove-orphans
}
trap rollback ERR

git reset --hard "$target_commit"

# Images install dependencies during Docker build. Existing containers keep
# serving traffic if a build fails before the recreate step.
$COMPOSE build api web
$COMPOSE up -d --remove-orphans

for attempt in {1..24}; do
  if curl --fail --silent --show-error --max-time 8 \
    "https://${DOMAIN}/api/health" >/dev/null &&
     curl --fail --silent --show-error --max-time 8 \
    "https://${DOMAIN}/" >/dev/null; then
    trap - ERR
    echo "Deployment successful: $target_commit"
    exit 0
  fi
  sleep 5
done

echo "Health checks did not pass in time."
exit 1
