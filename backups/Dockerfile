FROM alpine:latest

# Install PostgreSQL 17 client (for pg_dump) and tar
RUN apk add --no-cache postgresql17-client tar tzdata

# Copy our backup script
COPY backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/backup.sh

# Set up a cron job to run at 2:00 AM every 2 days
RUN echo "0 2 */2 * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1" >> /etc/crontabs/root

# Start the cron daemon in the foreground
CMD ["crond", "-f", "-d", "8"]
