-- AlterTable
ALTER TABLE "lecturers" ADD COLUMN "media_id" UUID;

-- AddForeignKey
ALTER TABLE "lecturers" ADD CONSTRAINT "lecturers_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
