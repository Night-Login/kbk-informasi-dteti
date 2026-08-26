ALTER TABLE "research_clusters"
    ADD COLUMN "image_url" TEXT,
    ADD COLUMN "media_id" UUID;

ALTER TABLE "research_clusters"
    ADD CONSTRAINT "research_clusters_media_id_fkey"
        FOREIGN KEY ("media_id") REFERENCES "media_assets"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;

-- Preserve the five images previously selected in frontend code, but move the
-- choice into database rows so each one can be replaced from the admin panel.
WITH ranked_clusters AS (
    SELECT
        "id",
        row_number() OVER (
            ORDER BY "sort_order" ASC NULLS LAST, "name" ASC, "id" ASC
        ) AS position
    FROM "research_clusters"
    WHERE "deleted_at" IS NULL
)
UPDATE "research_clusters" AS cluster
SET "image_url" = CASE ranked.position
    WHEN 1 THEN '/images/news-chip.jpg'
    WHEN 2 THEN '/images/news-network.jpg'
    WHEN 3 THEN '/images/news-students.jpg'
    WHEN 4 THEN '/images/hero-campus.jpg'
    WHEN 5 THEN '/images/news-chip.jpg'
END
FROM ranked_clusters AS ranked
WHERE cluster."id" = ranked."id"
  AND ranked.position <= 5
  AND cluster."image_url" IS NULL;
