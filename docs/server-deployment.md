# Ubuntu server deployment

This deployment keeps the Next.js frontend on Vercel. The Ubuntu server runs
only PostgreSQL, explicitly approved database maintenance tasks, the Express
backend, Cloudflare Tunnel, and local database backup automation.

The production path is `compose.server.yml`. The existing root
`docker-compose.yml` and `be/docker-compose.yml` remain development workflows
and must not be used for the server deployment.

## Architecture

```text
Vercel frontend
      |
      | HTTPS
      v
Cloudflare edge
      |
      | outbound-only Tunnel connection
      v
cloudflared -> http://backend:5000 -> PostgreSQL:5432
                   |
                   +-> /app/uploads (persistent named volume)

database_backup -> PostgreSQL:5432 -> ./backups/archives
```

Neither PostgreSQL nor Express publishes a host port. nginx is not involved,
and no router port forwarding is required.

## Safety rules

- Never commit `.env`, database dumps, or tunnel credentials.
- Do not start any service until every required value in `.env` is real.
- Obtain explicit approval before starting services, running migrations,
  running the seed, restoring data, deleting data or volumes, changing the
  firewall, using sudo, or rebooting.
- Never run `docker compose down --volumes` for this project.
- Never enable the `maintenance` profile during a normal deployment.
- Treat a local backup as protection against application mistakes, not against
  loss of the entire server disk. Copy verified backups off-host separately if
  disaster recovery requires it.

## 1. Prepare the environment file

From the repository root:

```sh
install -m 600 .env.example .env
```

Edit `.env` without displaying its contents in terminal output. Replace every
placeholder and keep the file mode at `600`:

```sh
chmod 600 .env
test "$(stat -c '%a' .env)" = "600"
```

Required secret or deployment-specific values:

- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `SUPERADMIN_USERNAME`
- `SUPERADMIN_PASSWORD`
- `FRONTEND_URLS`
- `CLOUDFLARE_TUNNEL_TOKEN`

Use a long base64url PostgreSQL password. The same value is supplied to
PostgreSQL and embedded as the password component of the private backend
connection URL; characters requiring URL encoding would otherwise make those
two interpretations differ.

`FRONTEND_URLS` is an exact comma-separated origin allowlist. Include the
scheme, omit paths and trailing slashes, and list every approved production or
preview domain explicitly. The shared `.env.example` retains localhost origins
for local development; replace the entire value on the server and remove those
localhost entries:

```dotenv
FRONTEND_URLS=https://project.vercel.app,https://www.example.org
```

Do not use a broad `*.vercel.app` credentialed CORS allowlist.

## 2. Configure Vercel and Cloudflare

Set the frontend's Vercel environment variable to the public API hostname:

```dotenv
NEXT_PUBLIC_API_URL=https://api.example.org/api/v1
```

Redeploy the frontend after changing this build-time variable.

Create a remotely-managed Cloudflare Tunnel and configure its public hostname
to use this origin service:

```text
http://backend:5000
```

Store the Tunnel token only in `.env`. The container passes it through the
supported `TUNNEL_TOKEN` environment variable, not as a command-line argument.
The Tunnel initiates outbound connections; do not open inbound ports or add
router forwarding. If the host's outbound firewall blocks Tunnel traffic, stop
and obtain approval before changing firewall rules.

## 3. Validate without starting containers

Refuse to continue while shared-template placeholders or local frontend origins
remain. These checks report only the problem, not the secret values:

```sh
if grep -Eq 'replace-with|your-project|www\.example\.org' .env; then
  echo "Replace every placeholder in .env before deployment." >&2
  exit 1
fi

if grep -Eq '^FRONTEND_URLS=.*localhost' .env; then
  echo "Remove localhost origins from the server FRONTEND_URLS value." >&2
  exit 1
fi
```

The following command parses the server Compose configuration without printing
the rendered environment:

```sh
docker compose --env-file .env -f compose.server.yml config --quiet
```

Building or pulling images does not start containers, but it changes local
Docker state and may use network bandwidth:

```sh
docker compose --env-file .env -f compose.server.yml build backend database_init database_backup
docker compose --env-file .env -f compose.server.yml pull database cloudflared
```

## 4. Initial deployment

Create the local backup directory before starting the scheduler:

```sh
mkdir -p backups/archives
chmod 700 backups/archives
```

After receiving approval to start PostgreSQL:

```sh
docker compose --env-file .env -f compose.server.yml up -d database
```

After receiving separate approval to run migrations:

```sh
docker compose --env-file .env -f compose.server.yml \
  --profile maintenance run --rm database_init
```

`database_init` runs only `prisma migrate deploy`. It never runs the seed.

For a new database only, and only after receiving separate seed approval:

```sh
docker compose --env-file .env -f compose.server.yml \
  --profile maintenance run --rm database_init \
  npx tsx prisma/seed.ts
```

The seed creates the first superadmin only when no active superadmin exists.
Running it again with the same username makes no changes and does not reset the
password. Conflicting existing accounts cause it to fail safely.

After migrations and any explicitly approved initial seed have succeeded:

```sh
docker compose --env-file .env -f compose.server.yml \
  up -d backend database_backup cloudflared
```

Do not add `--profile maintenance` to that command.

## 5. Verify the deployment

Inspect container status and size-limited Docker logs:

```sh
docker compose --env-file .env -f compose.server.yml ps
docker compose --env-file .env -f compose.server.yml logs --tail=100 backend cloudflared database_backup
```

The backend health check performs a database query:

```sh
curl --fail --show-error https://api.example.org/health
```

Also verify:

- public API reads through `/api/v1`;
- admin login from each allowed Vercel domain;
- one authorized upload remains available under `/uploads` after a backend
  restart;
- disallowed browser origins do not receive CORS access.

## 6. Backups

The `database_backup` service runs a compressed custom-format `pg_dump` every
day at 02:00 in `TZ` (Asia/Jakarta by default). It writes with restrictive
permissions, uses an atomic temporary file, and removes matching archives older
than `BACKUP_RETENTION_DAYS` (14 by default).

Archives are stored in the ignored local directory `backups/archives`.

After approval, a manual backup can be used to test the pipeline:

```sh
docker compose --env-file .env -f compose.server.yml \
  run --rm database_backup /usr/local/bin/backup-db.sh
```

Verify that the archive is non-empty and periodically rehearse a restore
against a separate test database. A persistent upload volume prevents uploads
from disappearing on container replacement, but it is not an off-host backup.

## 7. Restore procedure

A restore is destructive. Obtain explicit approval and schedule a maintenance
window before continuing.

1. Stop public traffic, the backend, and the scheduled backup process:

   ```sh
   docker compose --env-file .env -f compose.server.yml \
     stop cloudflared backend database_backup
   ```

2. Create and verify a fresh safety backup of the current database:

   ```sh
   docker compose --env-file .env -f compose.server.yml \
     run --rm database_backup /usr/local/bin/backup-db.sh
   ```

3. Select the intended archive without printing any environment values:

   ```sh
   ls -lh backups/archives/kbk-db-*.dump
   ```

4. Run the restore interactively. Replace the example filename:

   ```sh
   docker compose --env-file .env -f compose.server.yml \
     run --rm database_backup \
     /usr/local/bin/restore-db.sh /backups/kbk-db-YYYYMMDDTHHMMSSZ.dump
   ```

   The script validates the archive, then requires typing
   `RESTORE <database-name>`. It restores in one transaction with
   `--clean --if-exists`; a failure rolls the transaction back.

5. Check migration status without applying anything:

   ```sh
   docker compose --env-file .env -f compose.server.yml \
     --profile maintenance run --rm database_init \
     npx prisma migrate status
   ```

6. If migrations are pending, obtain approval before running
   `database_init`. Once the schema and application have been verified, restart
   the long-running services:

   ```sh
   docker compose --env-file .env -f compose.server.yml \
     up -d backend database_backup cloudflared
   ```

The restore procedure does not delete Docker volumes. Upload restoration, if
ever required, must be planned and approved separately.

## 8. Updates and rollback

Before an application update, create a verified database backup. Build the new
backend image, inspect the migration status, obtain migration approval when
needed, and only then replace the backend container.

Keep the previous Git revision and its compatible database backup until the
new deployment passes health, API, authentication, and upload checks. Rolling
back application code does not automatically roll back database migrations;
use a rehearsed database restore when the schema change is not backward
compatible.

The production volumes have fixed names:

- `kbk_server_postgres_data`
- `kbk_server_backend_uploads`

Container removal does not remove these volumes. Volume deletion is a separate,
destructive operation and always requires explicit approval.
