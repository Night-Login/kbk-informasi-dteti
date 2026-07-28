#!/bin/sh
set -eu

if [ "$#" -gt 0 ]; then
    exec "$@"
fi

backup_dir="${BACKUP_DIR:-/backups}"
schedule="${BACKUP_CRON_SCHEDULE:-0 2 * * *}"

# A cron schedule must be a single line containing exactly five fields. This
# also prevents a malformed value from appending an unintended command to the
# crontab. Disable pathname expansion while splitting so cron wildcards remain
# literal fields instead of expanding to files in the container.
schedule_line_count="$(printf '%s\n' "$schedule" | wc -l | tr -d '[:space:]')"
if [ "$schedule_line_count" -ne 1 ]; then
    echo "BACKUP_CRON_SCHEDULE must be a single line." >&2
    exit 1
fi

set -f
set -- $schedule
set +f
if [ "$#" -ne 5 ]; then
    echo "BACKUP_CRON_SCHEDULE must contain exactly five cron fields." >&2
    exit 1
fi

umask 077
mkdir -p "$backup_dir"
printf '%s /usr/local/bin/backup-db.sh\n' "$schedule" > /etc/crontabs/root

echo "Database backup scheduler started with schedule: $schedule"
exec crond -f -d 8
