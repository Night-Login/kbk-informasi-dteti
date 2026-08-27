-- Point the original seed defaults at the website's dedicated archive pages.
-- Custom values entered by an administrator are preserved.
UPDATE "site_settings"
SET "value" = '/news', "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'news_archive_url'
  AND "value" IN (
    'https://jteti.ugm.ac.id/category/berita/',
    'https://jteti.ugm.ac.id/category/berita'
  );

UPDATE "site_settings"
SET "value" = '/events', "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'events_archive_url'
  AND "value" IN (
    'https://pasca.jteti.ugm.ac.id/',
    'https://pasca.jteti.ugm.ac.id'
  );
