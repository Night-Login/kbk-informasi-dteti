#!/bin/sh
set -eu

: "${POSTGRES_HOST:?POSTGRES_HOST is required}"
: "${POSTGRES_PORT:?POSTGRES_PORT is required}"
: "${POSTGRES_DB:?POSTGRES_DB is required}"
: "${POSTGRES_USER:?POSTGRES_USER is required}"
: "${PGPASSWORD:?PGPASSWORD is required}"

backup_dir="${BACKUP_DIR:-/backups}"
retention_days="${BACKUP_RETENTION_DAYS:-14}"

case "$retention_days" in
    "" | *[!0-9]*)
        echo "BACKUP_RETENTION_DAYS must be a positive integer." >&2
        exit 1
        ;;
esac

if [ "$retention_days" -lt 1 ]; then
    echo "BACKUP_RETENTION_DAYS must be at least 1." >&2
    exit 1
fi

umask 077
mkdir -p "$backup_dir"

timestamp="$(date -u '+%Y%m%dT%H%M%SZ')"
archive="$backup_dir/kbk-db-$timestamp.dump"
partial_archive="$archive.partial.$$"

cleanup() {
    rm -f "$partial_archive"
}
trap cleanup EXIT HUP INT TERM

echo "Starting compressed PostgreSQL backup for database \"$POSTGRES_DB\"."
pg_dump \
    --host="$POSTGRES_HOST" \
    --port="$POSTGRES_PORT" \
    --username="$POSTGRES_USER" \
    --dbname="$POSTGRES_DB" \
    --format=custom \
    --compress=9 \
    --no-owner \
    --no-privileges \
    --file="$partial_archive"

if [ ! -s "$partial_archive" ]; then
    echo "PostgreSQL backup failed: the generated archive is empty." >&2
    exit 1
fi

mv "$partial_archive" "$archive"
trap - EXIT HUP INT TERM

find "$backup_dir" \
    -type f \
    -name 'kbk-db-*.dump' \
    -mtime "+$retention_days" \
    -delete

echo "PostgreSQL backup completed: $archive"
