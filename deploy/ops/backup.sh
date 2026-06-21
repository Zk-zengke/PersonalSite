#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/opt/apps/personal-learning-site}"
BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/personal-learning-site}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
COMPOSE="docker compose --env-file .env -f docker-compose.prod.yml"
stamp="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
destination="$BACKUP_ROOT/$stamp"

mkdir -p "$destination"
cd "$APP_DIR"

case "$BACKUP_ROOT" in
  /var/backups/personal-learning-site|/var/backups/personal-learning-site/*) ;;
  *) echo "Unsafe BACKUP_ROOT: $BACKUP_ROOT"; exit 1 ;;
esac

$COMPOSE exec -T postgres sh -c \
  'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip -9 > "$destination/database.sql.gz"

$COMPOSE exec -T api \
  tar -czf - -C /app/apps/api/uploads . > "$destination/uploads.tar.gz"

sha256sum "$destination"/* > "$destination/SHA256SUMS"

find "$BACKUP_ROOT" -mindepth 1 -maxdepth 1 -type d \
  -mtime "+$RETENTION_DAYS" -exec rm -rf -- {} +

echo "Backup completed: $destination"
