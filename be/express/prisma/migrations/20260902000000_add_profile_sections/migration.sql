-- CreateTable
CREATE TABLE "lecturer_education" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lecturer_id" UUID NOT NULL,
    "degree" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "field" TEXT,
    "year" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lecturer_education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecturer_awards" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lecturer_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "institution" TEXT,
    "year" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lecturer_awards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lecturer_education_lecturer_id_idx" ON "lecturer_education"("lecturer_id");

-- CreateIndex
CREATE INDEX "lecturer_awards_lecturer_id_idx" ON "lecturer_awards"("lecturer_id");

-- AddForeignKey
ALTER TABLE "lecturer_education" ADD CONSTRAINT "lecturer_education_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturer_awards" ADD CONSTRAINT "lecturer_awards_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
