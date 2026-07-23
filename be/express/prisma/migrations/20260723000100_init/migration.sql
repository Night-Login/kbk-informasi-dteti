-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PLANNED', 'ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'INTERNAL', 'HIDDEN');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_clusters" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "research_clusters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "cluster_id" UUID NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "research_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'PLANNED',
    "start_year" INTEGER,
    "end_year" INTEGER,
    "partner_names" TEXT,
    "funding_source" TEXT,
    "visibility" "Visibility" DEFAULT 'PUBLIC',
    "lead_lecturer_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_research_tags" (
    "project_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "project_research_tags_pkey" PRIMARY KEY ("project_id","tag_id")
);

-- CreateTable
CREATE TABLE "lecturer_projects" (
    "project_id" UUID NOT NULL,
    "lecturer_id" UUID NOT NULL,
    "role" TEXT,

    CONSTRAINT "lecturer_projects_pkey" PRIMARY KEY ("project_id","lecturer_id")
);

-- CreateTable
CREATE TABLE "lecturer_research_tags" (
    "lecturer_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "lecturer_research_tags_pkey" PRIMARY KEY ("lecturer_id","tag_id")
);

-- CreateTable
CREATE TABLE "lecturers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" TEXT NOT NULL,
    "academic_title" TEXT,
    "slug" TEXT NOT NULL,
    "nip_or_staff_id" TEXT NOT NULL,
    "email" TEXT,
    "photo_url" TEXT,
    "short_bio" TEXT,
    "bio" TEXT,
    "sinta_id" TEXT NOT NULL,
    "scopus_author_id" TEXT,
    "google_scholar_url" TEXT,
    "google_scholar_id" TEXT,
    "orcid_id" TEXT,
    "openalex_author_id" TEXT,
    "semantic_scholar_id" TEXT,
    "supervision_status" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "source_csv_row_ref" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "lecturers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecturer_metrics" (
    "lecturer_id" UUID NOT NULL,
    "h_index" INTEGER NOT NULL DEFAULT 0,
    "total_citations" INTEGER NOT NULL DEFAULT 0,
    "sinta_score" DOUBLE PRECISION,
    "source" TEXT,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lecturer_metrics_pkey" PRIMARY KEY ("lecturer_id")
);

-- CreateTable
CREATE TABLE "publications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "publication_date" TEXT,
    "authors_text" TEXT,
    "venue" TEXT,
    "publication_type" TEXT,
    "doi" TEXT,
    "url" TEXT,
    "abstract" TEXT,
    "citation_count" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'OPENALEX',
    "external_ids" JSONB,
    "verified_status" TEXT NOT NULL DEFAULT 'NEEDS_REVIEW',
    "fetch_batch_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecturer_publications" (
    "lecturer_id" UUID NOT NULL,
    "publication_id" UUID NOT NULL,
    "author_order" INTEGER,

    CONSTRAINT "lecturer_publications_pkey" PRIMARY KEY ("lecturer_id","publication_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "research_clusters_slug_key" ON "research_clusters"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "research_tags_slug_key" ON "research_tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "lecturers_slug_key" ON "lecturers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "lecturers_sinta_id_key" ON "lecturers"("sinta_id");

-- CreateIndex
CREATE UNIQUE INDEX "publications_doi_key" ON "publications"("doi");

-- AddForeignKey
ALTER TABLE "research_tags" ADD CONSTRAINT "research_tags_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "research_clusters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_lead_lecturer_id_fkey" FOREIGN KEY ("lead_lecturer_id") REFERENCES "lecturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_research_tags" ADD CONSTRAINT "project_research_tags_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_research_tags" ADD CONSTRAINT "project_research_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "research_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturer_projects" ADD CONSTRAINT "lecturer_projects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturer_projects" ADD CONSTRAINT "lecturer_projects_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturer_research_tags" ADD CONSTRAINT "lecturer_research_tags_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturer_research_tags" ADD CONSTRAINT "lecturer_research_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "research_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturer_metrics" ADD CONSTRAINT "lecturer_metrics_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturer_publications" ADD CONSTRAINT "lecturer_publications_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturer_publications" ADD CONSTRAINT "lecturer_publications_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
