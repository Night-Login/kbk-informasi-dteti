-- AlterTable
ALTER TABLE "lecturers" ADD COLUMN     "primary_research_cluster_id" UUID;

-- CreateTable
CREATE TABLE "supervised_students" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lecturer_id" UUID NOT NULL,
    "student_name" TEXT NOT NULL,
    "student_id_number" TEXT,
    "program_level" TEXT,
    "thesis_title" TEXT,
    "supervision_role" TEXT,
    "status" TEXT,
    "start_date" DATE,
    "end_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "supervised_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teaching_assistants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lecturer_id" UUID NOT NULL,
    "student_name" TEXT NOT NULL,
    "student_id_number" TEXT,
    "course_name" TEXT,
    "academic_period" TEXT,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "teaching_assistants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecturer_supervision_quota" (
    "lecturer_id" UUID NOT NULL,
    "max_quota" INTEGER,
    "current_students_count" INTEGER NOT NULL DEFAULT 0,
    "academic_period" TEXT,
    "source" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "lecturer_supervision_quota_pkey" PRIMARY KEY ("lecturer_id")
);

-- CreateIndex
CREATE INDEX "supervised_students_lecturer_id_idx" ON "supervised_students"("lecturer_id");

-- CreateIndex
CREATE INDEX "teaching_assistants_lecturer_id_idx" ON "teaching_assistants"("lecturer_id");

-- CreateIndex
CREATE INDEX "publications_source_idx" ON "publications"("source");

-- AddForeignKey
ALTER TABLE "lecturers" ADD CONSTRAINT "lecturers_primary_research_cluster_id_fkey" FOREIGN KEY ("primary_research_cluster_id") REFERENCES "research_clusters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supervised_students" ADD CONSTRAINT "supervised_students_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teaching_assistants" ADD CONSTRAINT "teaching_assistants_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturer_supervision_quota" ADD CONSTRAINT "lecturer_supervision_quota_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
