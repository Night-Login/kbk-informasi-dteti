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
});

export const lecturerSchema = z.object({
  body: lecturerSchemaBase
});

export type LecturerInput = z.infer<typeof lecturerSchemaBase>;
