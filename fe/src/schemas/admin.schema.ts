import { z } from 'zod';

export const adminSchema = z.object({
  body: z.object({
    username: z.string().trim().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, "Only alphanumeric and underscores"),
    password: z.string().min(8).regex(/[A-Z]/, "Must contain uppercase").regex(/[0-9]/, "Must contain number").optional(),
    role: z.enum(["SUPERADMIN", "ADMIN"]).optional(),
  })
});

export const createAdminSchema = adminSchema.extend({
  body: adminSchema.shape.body.extend({
    password: z.string().min(8).regex(/[A-Z]/, "Must contain uppercase").regex(/[0-9]/, "Must contain number"),
    role: z.enum(["SUPERADMIN", "ADMIN"]).default("ADMIN"),
  })
});

export const adminFormSchema = adminSchema.shape.body;
export const createAdminFormSchema = createAdminSchema.shape.body;

export type AdminInput = z.infer<typeof adminFormSchema>;
export type CreateAdminInput = z.infer<typeof createAdminFormSchema>;
