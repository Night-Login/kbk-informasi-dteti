#!/bin/sh
# Generate a timestamp for the backup filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/archives"

echo "Starting backup at $TIMESTAMP..."

# 1. Back up the PostgreSQL database
# Note: We use the internal Docker DNS 'database' to connect
pg_dump -h database -U "$POSTGRES_USER" -d "$POSTGRES_DB" -F c -f "$BACKUP_DIR/db_$TIMESTAMP.dump"

# 2. Back up the user uploads
tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" /app/uploads

# 3. Cleanup: Delete backups older than 30 days to save disk space
find "$BACKUP_DIR" -type f -mtime +30 -delete

echo "Backup completed successfully!"
