ALTER TABLE "events"
    ADD COLUMN "image_url" TEXT,
    ADD COLUMN "media_id" UUID;

ALTER TABLE "events"
    ADD CONSTRAINT "events_media_id_fkey"
        FOREIGN KEY ("media_id") REFERENCES "media_assets"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
