#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  printf 'Uso: CONFIRM_RESTORE=yes scripts/restore.sh backups/AAAAMMDDTHHMMSSZ\n' >&2
  exit 2
fi

if [[ ${CONFIRM_RESTORE:-} != yes ]]; then
  printf 'A restauração substitui dados. Confirme com CONFIRM_RESTORE=yes.\n' >&2
  exit 2
fi

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
BACKUP_PATH=$1
COMPOSE_FILE=${COMPOSE_FILE:-"$ROOT_DIR/docker-compose.yml"}
DB_SERVICE=${DB_SERVICE:-db}
POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_DB=${POSTGRES_DB:-postgres}

if [[ ! -f "$BACKUP_PATH/database.dump" || ! -f "$BACKUP_PATH/media.tar.gz" ]]; then
  printf 'Backup incompleto: %s\n' "$BACKUP_PATH" >&2
  exit 1
fi

(
  cd "$BACKUP_PATH"
  shasum -a 256 -c SHA256SUMS
)

docker compose -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" \
  pg_restore --clean --if-exists --no-owner -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  < "$BACKUP_PATH/database.dump"

mkdir -p "$ROOT_DIR/media"
tar -xzf "$BACKUP_PATH/media.tar.gz" -C "$ROOT_DIR/media"
printf 'Restauração concluída de %s\n' "$BACKUP_PATH"
