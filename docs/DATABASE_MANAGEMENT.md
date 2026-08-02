# Database Management Guide

This guide covers the procedures for seeding data (upserting), as well as triggering and restoring database backups.

## 1. Data Upserting (Seeding)

The database is seeded using a set of TypeScript scripts inside the `database_init` Docker container. This process is highly **idempotent**, meaning you can run it multiple times safely without creating duplicate data. 

When executed, the script will:
- Insert static vocabulary (Research Clusters and Tags).
- Parse the CSVs and JSON files located in the `seed_data` directory.
- **Upsert** (Update or Insert) Lecturers and Publications based on matching IDs or generated hashes. 
- Link Lecturers to Publications and Tags, skipping any relationships that already exist.

### How to Trigger the Upsert:
To run the seeding process (or refresh the database with updated CSV files), run:

```bash
docker compose up database_init --build
```
> **Note:** The `--build` flag is recommended if you have recently modified the `insert.ts` script to ensure Docker doesn't use a cached version of the initialization container.

---

## 2. Automated Backups

The system includes a dedicated `backup` container that handles taking automated snapshots of your PostgreSQL database and user uploads.

### How it works:
- The container uses a `cron` daemon defined in `backups/Dockerfile`.
- By default, it is scheduled to run at 02:00 AM every 2 days (or whatever is defined in your `.env` config if passed down).
- It executes `backups/backup.sh` which:
  1. Creates a compressed custom format Postgres dump (`.dump`).
  2. Creates a `.tar.gz` archive of the `/app/uploads` folder.
  3. Deletes backups older than 30 days to conserve disk space.
- The backups are exported directly to your host machine via a volume mount and can be found in the `backups/archives/` directory.

---

## 3. Manual Backups

If you need to take an immediate snapshot of the database before making a risky change, you can manually trigger the backup script inside the running container.

### How to trigger manually:
Run the following command from your project root:

```bash
docker compose exec backup /usr/local/bin/backup.sh
```
Once the script completes, you will instantly see the new `.dump` and `.tar.gz` files appear in your local `backups/archives/` folder.

---

## 4. Database Restoration

If you ever need to rollback to a previous state, you can restore one of the `.dump` files using the `pg_restore` utility natively available inside the `backup` container.

### How to restore:
1. Locate the exact filename of the backup you want to restore inside the `backups/archives/` directory (e.g., `db_20260802_120000.dump`).
2. Run the following command, replacing the filename at the end:

```bash
docker compose exec backup pg_restore -h database -U kbk-informasi -d kbk-informasi --clean --if-exists --single-transaction /archives/db_YOUR_TIMESTAMP.dump
```

**Understanding the flags:**
- `--clean --if-exists`: Safely drops the existing tables before recreating them from the backup.
- `--single-transaction`: Wraps the entire restoration in a single transaction. If the restore fails midway, it automatically rolls back everything, preventing a corrupted database state.
