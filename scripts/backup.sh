#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
COMPOSE_FILE=${COMPOSE_FILE:-"$ROOT_DIR/docker-compose.yml"}
DB_SERVICE=${DB_SERVICE:-db}
BACKUP_ROOT=${BACKUP_DIR:-"$ROOT_DIR/backups"}
TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
DESTINATION="$BACKUP_ROOT/$TIMESTAMP"
POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_DB=${POSTGRES_DB:-postgres}

mkdir -p "$DESTINATION"
docker compose -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" \
  pg_dump --format=custom --no-owner -U "$POSTGRES_USER" "$POSTGRES_DB" \
  > "$DESTINATION/database.dump"

if [[ -d "$ROOT_DIR/media" ]]; then
  tar -czf "$DESTINATION/media.tar.gz" -C "$ROOT_DIR/media" .
else
  tar -czf "$DESTINATION/media.tar.gz" --files-from /dev/null
fi

(
  cd "$DESTINATION"
  shasum -a 256 database.dump media.tar.gz > SHA256SUMS
)

printf 'Backup criado em %s\n' "$DESTINATION"
