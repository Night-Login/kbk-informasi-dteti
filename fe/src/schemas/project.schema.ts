import { z } from 'zod';

export const projectSchemaBase = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be kebab-case (e.g., my-project)").optional(),
  description: z.string().max(2000).optional().nullable(),
  status: z.enum(["PLANNED", "ONGOING", "COMPLETED"]).optional().default("PLANNED"),
  start_year: z.number().int().min(1900).max(2100).optional().nullable(),
  end_year: z.number().int().min(1900).max(2100).optional().nullable(),
  partner_names: z.string().optional().nullable(),
  funding_source: z.string().optional().nullable(),
  visibility: z.enum(["PUBLIC", "INTERNAL", "HIDDEN"]).optional().default("PUBLIC"),
  lead_lecturer_id: z.string().uuid("Invalid ID format").optional().nullable(),
}).refine(data => {
  if (data.start_year && data.end_year) {
    return data.end_year >= data.start_year;
  }
  return true;
}, {
  message: "End year must be greater than or equal to start year",
  path: ["end_year"]
});

export const projectFormSchema = projectSchemaBase;
export type ProjectInput = z.infer<typeof projectSchemaBase>;
