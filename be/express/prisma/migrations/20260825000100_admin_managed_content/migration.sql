CREATE TABLE "media_assets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "alt_text" TEXT,
    "file_url" TEXT,
    "file_name" TEXT,
    "mime_type" TEXT,
    "file_size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "site_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT,
    "description" TEXT,
    "field_type" TEXT NOT NULL DEFAULT 'TEXT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "media_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "academic_programs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "information" TEXT,
    "link_url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "academic_programs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "scholarships" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "information" TEXT,
    "link_url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "scholarships_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "news_articles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT,
    "link_url" TEXT,
    "image_url" TEXT,
    "media_id" UUID,
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "news_articles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3),
    "location" TEXT NOT NULL,
    "link_url" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "site_settings_key_key" ON "site_settings"("key");
CREATE UNIQUE INDEX "news_articles_slug_key" ON "news_articles"("slug");
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");
CREATE INDEX "news_articles_is_published_published_at_idx" ON "news_articles"("is_published", "published_at");
CREATE INDEX "events_is_published_starts_at_idx" ON "events"("is_published", "starts_at");

ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_media_id_fkey"
    FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "news_articles" ADD CONSTRAINT "news_articles_media_id_fkey"
    FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "media_assets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "site_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "academic_programs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "scholarships" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "news_articles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;

INSERT INTO "site_settings" ("key", "label", "value", "description", "field_type", "sort_order", "updated_at")
VALUES
    ('home_hero_title', 'Homepage hero title', 'Profil Kelompok Keahlian DTETI', 'Main heading displayed on the homepage hero.', 'TEXT', 10, CURRENT_TIMESTAMP),
    ('home_hero_description', 'Homepage hero description', 'Website ini merupakan platform profil resmi Kelompok Keahlian DTETI yang berfungsi sebagai pusat informasi dosen, bidang riset, publikasi, proyek, kegiatan akademik, dan peluang kolaborasi. Website dirancang agar pihak eksternal dapat memahami kapasitas kelompok riset secara cepat melalui pendekatan berbasis topik penelitian.', 'Supporting description displayed on the homepage hero.', 'MULTILINE', 20, CURRENT_TIMESTAMP),
    ('home_hero_image', 'Homepage hero image', '/images/pakdn.jpeg', 'Upload a new image or choose one from the media library.', 'IMAGE', 30, CURRENT_TIMESTAMP),
    ('graduate_website_url', 'DTETI graduate program website', 'https://pasca.jteti.ugm.ac.id/', 'Official website linked from the academic information section.', 'URL', 40, CURRENT_TIMESTAMP),
    ('news_archive_url', 'News archive link', 'https://jteti.ugm.ac.id/category/berita/', 'Destination for the More News button.', 'URL', 50, CURRENT_TIMESTAMP),
    ('events_archive_url', 'Events archive link', 'https://pasca.jteti.ugm.ac.id/', 'Destination for the More Events button.', 'URL', 60, CURRENT_TIMESTAMP),
    ('footer_about', 'Footer about description', 'Kelompok Keahlian Teknik Informasi DTETI UGM mengembangkan penelitian, pendidikan, dan kolaborasi di bidang sistem cerdas, data, jaringan, serta teknologi informasi.', 'Institutional description shown in the public website footer.', 'MULTILINE', 70, CURRENT_TIMESTAMP),
    ('contact_email', 'Institutional contact email', 'teti@ugm.ac.id', 'Contact email displayed in the public website footer.', 'TEXT', 80, CURRENT_TIMESTAMP),
    ('contact_address', 'Institutional contact address', 'Jl. Grafika No. 2, Kampus UGM, Yogyakarta 55281', 'Postal address displayed in the public website footer.', 'MULTILINE', 90, CURRENT_TIMESTAMP),
    ('social_instagram_url', 'Instagram profile URL', 'https://www.instagram.com/dtetiugm/', 'Official Instagram profile shown in the footer.', 'URL', 100, CURRENT_TIMESTAMP),
    ('social_youtube_url', 'YouTube profile URL', 'https://youtube.com', 'Official YouTube profile shown in the footer.', 'URL', 110, CURRENT_TIMESTAMP),
    ('social_facebook_url', 'Facebook profile URL', 'https://web.facebook.com/DTETIFTUGM', 'Official Facebook profile shown in the footer.', 'URL', 120, CURRENT_TIMESTAMP);

INSERT INTO "academic_programs" ("title", "overview", "information", "link_url", "sort_order", "updated_at")
VALUES
    ('Master’s Program (S2)', 'Advance your expertise through the DTETI Information Technology master’s program.', 'Explore the curriculum, research concentrations, admission requirements, and graduate opportunities.', 'https://pasca.jteti.ugm.ac.id/2022/10/12/program-studi-magister-teknologi-informasi/', 10, CURRENT_TIMESTAMP),
    ('Doctoral Program (S3)', 'Develop original research in electrical engineering and information technology.', 'Learn about doctoral research, academic supervision, admission, and graduate outcomes.', 'https://pasca.jteti.ugm.ac.id/2022/05/21/program-doktor-departemen-teknik-elektro-dan-teknologi-informasi/', 20, CURRENT_TIMESTAMP);

INSERT INTO "scholarships" ("title", "overview", "information", "link_url", "sort_order", "updated_at")
VALUES
    ('Master’s Scholarships', 'Funding opportunities for prospective DTETI master’s students.', 'Review current scholarship announcements, eligibility requirements, and application schedules.', 'https://pasca.jteti.ugm.ac.id/beasiswa-dalam-negeri/', 10, CURRENT_TIMESTAMP),
    ('Doctoral Scholarships', 'Funding opportunities for prospective DTETI doctoral researchers.', 'Find the latest doctoral scholarships and graduate funding information from DTETI UGM.', 'https://pasca.jteti.ugm.ac.id/beasiswa-dalam-negeri/', 20, CURRENT_TIMESTAMP);
