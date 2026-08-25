BEGIN;

LOCK TABLE "publications", "lecturer_publications" IN ACCESS EXCLUSIVE MODE;

DO $$
DECLARE
    missing_doi_count INTEGER;
    duplicate_doi_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO missing_doi_count
    FROM "publications"
    WHERE "doi" IS NULL OR btrim("doi") = '';

    IF missing_doi_count > 0 THEN
        RAISE EXCEPTION
            'Cannot make DOI the publication primary key: % existing publication(s) have no DOI. Populate their real DOI values before running this migration.',
            missing_doi_count;
    END IF;

    SELECT COUNT(*)
    INTO duplicate_doi_count
    FROM (
        SELECT btrim("doi")
        FROM "publications"
        GROUP BY btrim("doi")
        HAVING COUNT(*) > 1
    ) AS duplicates;

    IF duplicate_doi_count > 0 THEN
        RAISE EXCEPTION
            'Cannot make DOI the publication primary key: % duplicate DOI value(s) exist after trimming whitespace. Resolve those duplicates before running this migration.',
            duplicate_doi_count;
    END IF;
END $$;

UPDATE "publications"
SET "doi" = btrim("doi")
WHERE "doi" IS DISTINCT FROM btrim("doi");

ALTER TABLE "lecturer_publications"
    DROP CONSTRAINT "lecturer_publications_publication_id_fkey";

ALTER TABLE "lecturer_publications"
    ADD COLUMN "publication_doi" TEXT;

UPDATE "lecturer_publications" AS relation
SET "publication_doi" = publication."doi"
FROM "publications" AS publication
WHERE relation."publication_id" = publication."id";

ALTER TABLE "lecturer_publications"
    ALTER COLUMN "publication_doi" SET NOT NULL,
    DROP CONSTRAINT "lecturer_publications_pkey";

ALTER TABLE "publications"
    DROP CONSTRAINT "publications_pkey",
    ALTER COLUMN "doi" SET NOT NULL;

DROP INDEX "publications_doi_key";

ALTER TABLE "publications"
    ADD CONSTRAINT "publications_pkey" PRIMARY KEY ("doi"),
    DROP COLUMN "id";

ALTER TABLE "lecturer_publications"
    DROP COLUMN "publication_id",
    ADD CONSTRAINT "lecturer_publications_pkey" PRIMARY KEY ("lecturer_id", "publication_doi"),
    ADD CONSTRAINT "lecturer_publications_publication_doi_fkey"
        FOREIGN KEY ("publication_doi") REFERENCES "publications"("doi")
        ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
