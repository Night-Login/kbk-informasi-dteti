BEGIN;

LOCK TABLE "publications", "lecturer_publications" IN ACCESS EXCLUSIVE MODE;

ALTER TABLE "publications"
    ADD COLUMN "id" UUID NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE "lecturer_publications"
    DROP CONSTRAINT "lecturer_publications_publication_doi_fkey",
    ADD COLUMN "publication_id" UUID;

UPDATE "lecturer_publications" AS relation
SET "publication_id" = publication."id"
FROM "publications" AS publication
WHERE relation."publication_doi" = publication."doi";

ALTER TABLE "lecturer_publications"
    ALTER COLUMN "publication_id" SET NOT NULL,
    DROP CONSTRAINT "lecturer_publications_pkey";

ALTER TABLE "publications"
    DROP CONSTRAINT "publications_pkey",
    ALTER COLUMN "doi" DROP NOT NULL,
    ADD CONSTRAINT "publications_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "publications_doi_key" ON "publications"("doi");

ALTER TABLE "lecturer_publications"
    DROP COLUMN "publication_doi",
    ADD CONSTRAINT "lecturer_publications_pkey" PRIMARY KEY ("lecturer_id", "publication_id"),
    ADD CONSTRAINT "lecturer_publications_publication_id_fkey"
        FOREIGN KEY ("publication_id") REFERENCES "publications"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
