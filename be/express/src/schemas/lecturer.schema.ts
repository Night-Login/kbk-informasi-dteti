import { z } from 'zod';

export const lecturerSchemaBase = z.object({
  full_name: z.string().trim().min(1, "Full name is required").max(255),
  academic_title: z.string().optional().nullable(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be kebab-case (e.g., my-lecturer)").optional(),
  nip_or_staff_id: z.string().trim().min(5, "NIP or Staff ID must be at least 5 characters").max(50),
  email: z.string().email("Invalid email format").optional().nullable().or(z.literal('')),
  photo_url: z.string().url("Must be a valid URL").optional().nullable().or(z.literal('')),
  short_bio: z.string().max(500).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  sinta_id: z.string().trim().min(1, "Sinta ID is required"),
  scopus_author_id: z.string().optional().nullable(),
  google_scholar_url: z.string().url().optional().nullable().or(z.literal('')),
  google_scholar_id: z.string().optional().nullable(),
  orcid_id: z.string().optional().nullable(),
  openalex_author_id: z.string().optional().nullable(),
  semantic_scholar_id: z.string().optional().nullable(),
  supervision_status: z.string().optional().nullable(),
  is_active: z.boolean().optional().default(true),
  education: z.array(z.object({
    id: z.string().optional(),
    degree: z.string().min(1, "Degree is required"),
    institution: z.string().min(1, "Institution is required"),
    field: z.string().optional().nullable(),
    year: z.string().optional().nullable()
  })).optional(),
  awards: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Award name is required"),
    institution: z.string().optional().nullable(),
    year: z.string().optional().nullable(),
    description: z.string().optional().nullable()
  })).optional(),
  supervised_students: z.array(z.object({
    id: z.string().optional(),
    student_name: z.string().min(1, "Student name is required"),
    student_id_number: z.string().optional().nullable(),
    program_level: z.string().optional().nullable(),
    thesis_title: z.string().optional().nullable(),
    start_date: z.string().optional().nullable(),
    end_date: z.string().optional().nullable(),
    supervision_role: z.string().optional().nullable(),
    status: z.string().optional().nullable()
  })).optional(),
  teaching_assistants: z.array(z.object({
    id: z.string().optional(),
    student_name: z.string().min(1, "Student name is required"),
    student_id_number: z.string().optional().nullable(),
    course_name: z.string().optional().nullable(),
    academic_period: z.string().optional().nullable(),
    status: z.string().optional().nullable()
  })).optional(),
});

export const lecturerSchema = z.object({
  body: lecturerSchemaBase
});

export type LecturerInput = z.infer<typeof lecturerSchemaBase>;
