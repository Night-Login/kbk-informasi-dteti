import "dotenv/config";
import { Client, type QueryResultRow } from "pg";

const sourceConnectionString = process.env.LEGACY_DATABASE_URL;
const targetConnectionString =
    process.env.TARGET_DATABASE_URL ||
    process.env.DB_URL ||
    process.env.DIRECT_URL ||
    process.env.DATABASE_URL;

if (!sourceConnectionString) {
    throw new Error("LEGACY_DATABASE_URL must point to the restored legacy database.");
}

if (!targetConnectionString) {
    throw new Error(
        "TARGET_DATABASE_URL, DB_URL, DIRECT_URL, or DATABASE_URL must point to the migrated database.",
    );
}

if (sourceConnectionString === targetConnectionString) {
    throw new Error("The legacy source and migration target must be different databases.");
}

const source = new Client({ connectionString: sourceConnectionString });
const target = new Client({ connectionString: targetConnectionString });

function quoteIdentifier(value: string) {
    return `"${value.replaceAll('"', '""')}"`;
}

function slugify(value: string) {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function lecturerSlug(row: QueryResultRow) {
    const name = slugify(String(row.full_name)) || "dosen";
    return `${name}-${slugify(String(row.sinta_id))}`;
}

function publicationSlug(row: QueryResultRow) {
    const title = (slugify(String(row.title)) || "publikasi").slice(0, 120);
    const idSuffix = String(row.id).replaceAll("-", "").slice(0, 8);
    return `${title}-${row.year}-${idSuffix}`;
}

function chunk<T>(rows: T[], size = 250) {
    const result: T[][] = [];
    for (let index = 0; index < rows.length; index += size) {
        result.push(rows.slice(index, index + size));
    }
    return result;
}

async function upsertRows(
    table: string,
    columns: string[],
    rows: QueryResultRow[],
    conflictColumns: string[],
    updateColumns: string[],
) {
    if (rows.length === 0) return;

    for (const batch of chunk(rows)) {
        const values: unknown[] = [];
        const tuples = batch.map((row) => {
            const placeholders = columns.map((column) => {
                values.push(row[column]);
                return `$${values.length}`;
            });
            return `(${placeholders.join(", ")})`;
        });

        const conflict = conflictColumns.map(quoteIdentifier).join(", ");
        const onConflict =
            updateColumns.length === 0
                ? "DO NOTHING"
                : `DO UPDATE SET ${updateColumns
                      .map(
                          (column) =>
                              `${quoteIdentifier(column)} = EXCLUDED.${quoteIdentifier(column)}`,
                      )
                      .join(", ")}`;

        await target.query(
            `INSERT INTO ${quoteIdentifier(table)}
                (${columns.map(quoteIdentifier).join(", ")})
             VALUES ${tuples.join(", ")}
             ON CONFLICT (${conflict}) ${onConflict}`,
            values,
        );
    }
}

async function assertExpectedDatabases() {
    const sourceCheck = await source.query<{
        lecturers: string | null;
        publications: string | null;
    }>(
        "SELECT to_regclass('public.lecturers')::text AS lecturers, to_regclass('public.publications')::text AS publications",
    );
    if (!sourceCheck.rows[0]?.lecturers || !sourceCheck.rows[0]?.publications) {
        throw new Error("The legacy source does not contain the expected tables.");
    }

    const targetCheck = await target.query<{
        migrations: string | null;
        lecturers: string | null;
        publications: string | null;
    }>(
        `SELECT
            to_regclass('public._prisma_migrations')::text AS migrations,
            to_regclass('public.lecturers')::text AS lecturers,
            to_regclass('public.publications')::text AS publications`,
    );
    if (
        !targetCheck.rows[0]?.migrations ||
        !targetCheck.rows[0]?.lecturers ||
        !targetCheck.rows[0]?.publications
    ) {
        throw new Error("Run Prisma migrations on the target before importing legacy data.");
    }
}

async function loadLegacyData() {
    const clusters = await source.query(
        "SELECT * FROM research_clusters ORDER BY sort_order NULLS LAST, id",
    );
    const tags = await source.query("SELECT * FROM research_tags ORDER BY id");
    const lecturers = await source.query("SELECT * FROM lecturers ORDER BY id");
    const publications = await source.query(
        "SELECT id, title, slug, year, publication_date::text, authors_text, venue, publication_type, doi, url, abstract, citation_count, source, external_ids, verified_status, fetch_batch_id, created_at, updated_at FROM publications ORDER BY id",
    );
    const lecturerPublications = await source.query(
        "SELECT * FROM lecturer_publications ORDER BY lecturer_id, publication_id",
    );
    const metrics = await source.query("SELECT * FROM lecturer_metrics ORDER BY lecturer_id");
    const lecturerTags = await source.query(
        "SELECT * FROM lecturer_research_tags ORDER BY lecturer_id, tag_id",
    );

    return {
        clusters: clusters.rows,
        tags: tags.rows,
        lecturers: lecturers.rows.map((row) => ({
            ...row,
            slug: lecturerSlug(row),
            photo_url: null,
            short_bio: null,
            bio: null,
            deleted_at: null,
        })),
        publications: publications.rows.map((row) => ({
            ...row,
            slug: publicationSlug(row),
            deleted_at: null,
        })),
        lecturerPublications: lecturerPublications.rows,
        metrics: metrics.rows,
        lecturerTags: lecturerTags.rows,
    };
}

async function importLegacyData() {
    await source.connect();
    await target.connect();

    try {
        await source.query("SET timezone = 'UTC'");
        await target.query("SET timezone = 'UTC'");
        await assertExpectedDatabases();

        const data = await loadLegacyData();

        await target.query("BEGIN");
        await target.query("SELECT pg_advisory_xact_lock(hashtext('kbk-legacy-import-v1'))");

        await upsertRows(
            "research_clusters",
            ["id", "name", "slug", "description", "sort_order", "deleted_at"],
            data.clusters,
            ["id"],
            ["name", "slug", "description", "sort_order", "deleted_at"],
        );
        await upsertRows(
            "research_tags",
            ["id", "name", "slug", "cluster_id", "description", "is_active", "deleted_at"],
            data.tags,
            ["id"],
            ["name", "slug", "cluster_id", "description", "is_active", "deleted_at"],
        );
        await upsertRows(
            "lecturers",
            [
                "id",
                "full_name",
                "academic_title",
                "slug",
                "nip_or_staff_id",
                "email",
                "photo_url",
                "short_bio",
                "bio",
                "sinta_id",
                "scopus_author_id",
                "google_scholar_url",
                "google_scholar_id",
                "orcid_id",
                "openalex_author_id",
                "semantic_scholar_id",
                "supervision_status",
                "is_active",
                "source_csv_row_ref",
                "created_at",
                "updated_at",
                "deleted_at",
            ],
            data.lecturers,
            ["id"],
            [
                "full_name",
                "academic_title",
                "slug",
                "nip_or_staff_id",
                "email",
                "sinta_id",
                "scopus_author_id",
                "google_scholar_url",
                "google_scholar_id",
                "orcid_id",
                "openalex_author_id",
                "semantic_scholar_id",
                "supervision_status",
                "is_active",
                "source_csv_row_ref",
                "created_at",
                "updated_at",
            ],
        );
        await upsertRows(
            "publications",
            [
                "id",
                "title",
                "slug",
                "year",
                "publication_date",
                "authors_text",
                "venue",
                "publication_type",
                "doi",
                "url",
                "abstract",
                "citation_count",
                "source",
                "external_ids",
                "verified_status",
                "fetch_batch_id",
                "created_at",
                "updated_at",
                "deleted_at",
            ],
            data.publications,
            ["id"],
            [
                "title",
                "slug",
                "year",
                "publication_date",
                "authors_text",
                "venue",
                "publication_type",
                "doi",
                "url",
                "abstract",
                "citation_count",
                "source",
                "external_ids",
                "verified_status",
                "fetch_batch_id",
                "created_at",
                "updated_at",
            ],
        );
        await upsertRows(
            "lecturer_publications",
            ["lecturer_id", "publication_id", "author_order"],
            data.lecturerPublications,
            ["lecturer_id", "publication_id"],
            ["author_order"],
        );
        await upsertRows(
            "lecturer_metrics",
            [
                "lecturer_id",
                "h_index",
                "total_citations",
                "sinta_score",
                "source",
                "fetched_at",
            ],
            data.metrics,
            ["lecturer_id"],
            ["h_index", "total_citations", "sinta_score", "source", "fetched_at"],
        );
        await upsertRows(
            "lecturer_research_tags",
            ["lecturer_id", "tag_id", "is_primary"],
            data.lecturerTags,
            ["lecturer_id", "tag_id"],
            ["is_primary"],
        );

        await target.query("COMMIT");

        console.log("Legacy database import completed.");
        console.table({
            research_clusters: data.clusters.length,
            research_tags: data.tags.length,
            lecturers: data.lecturers.length,
            publications: data.publications.length,
            lecturer_publications: data.lecturerPublications.length,
            lecturer_metrics: data.metrics.length,
            lecturer_research_tags: data.lecturerTags.length,
        });
    } catch (error) {
        await target.query("ROLLBACK").catch(() => undefined);
        throw error;
    } finally {
        await Promise.all([source.end(), target.end()]);
    }
}

importLegacyData().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
