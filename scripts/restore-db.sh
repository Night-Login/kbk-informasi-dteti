#!/bin/sh
set -eu

: "${POSTGRES_HOST:?POSTGRES_HOST is required}"
: "${POSTGRES_PORT:?POSTGRES_PORT is required}"
: "${POSTGRES_DB:?POSTGRES_DB is required}"
: "${POSTGRES_USER:?POSTGRES_USER is required}"
: "${PGPASSWORD:?PGPASSWORD is required}"

backup_dir="${BACKUP_DIR:-/backups}"
dump_file="${1:-}"

if [ -z "$dump_file" ]; then
    echo "Usage: restore-db.sh /backups/kbk-db-TIMESTAMP.dump" >&2
    exit 1
fi

case "$dump_file" in
    "$backup_dir"/kbk-db-*.dump)
        ;;
    *)
        echo "The dump must be a kbk-db-*.dump file inside $backup_dir." >&2
        exit 1
        ;;
esac

if [ ! -f "$dump_file" ] || [ ! -s "$dump_file" ]; then
    echo "The selected dump does not exist or is empty: $dump_file" >&2
    exit 1
fi

# Validate the custom-format archive before asking for destructive approval.
pg_restore --list "$dump_file" > /dev/null

expected_confirmation="RESTORE $POSTGRES_DB"
confirmation="${RESTORE_CONFIRM:-}"

if [ "$confirmation" != "$expected_confirmation" ]; then
    if [ ! -t 0 ]; then
        echo "Restore refused. Set RESTORE_CONFIRM=\"$expected_confirmation\" or run interactively." >&2
        exit 1
    fi

    echo "WARNING: this will replace objects in database \"$POSTGRES_DB\"." >&2
    printf 'Type "%s" to continue: ' "$expected_confirmation" >&2
    IFS= read -r confirmation
fi

if [ "$confirmation" != "$expected_confirmation" ]; then
    echo "Restore cancelled." >&2
    exit 1
fi

echo "Restoring $(basename "$dump_file") into database \"$POSTGRES_DB\"."
pg_restore \
    --host="$POSTGRES_HOST" \
    --port="$POSTGRES_PORT" \
    --username="$POSTGRES_USER" \
    --dbname="$POSTGRES_DB" \
    --clean \
    --if-exists \
    --no-owner \
    --no-privileges \
    --single-transaction \
    --exit-on-error \
    "$dump_file"

echo "PostgreSQL restore completed successfully."
