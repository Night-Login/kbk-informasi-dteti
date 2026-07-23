-- Supabase exposes the public schema through its Data API unless that exposure
-- is disabled. This app intentionally talks to Postgres only through Express,
-- so no anon/authenticated policies are created.
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "research_clusters" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "research_tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_research_tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lecturer_projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lecturer_research_tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lecturers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lecturer_metrics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "publications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lecturer_publications" ENABLE ROW LEVEL SECURITY;
