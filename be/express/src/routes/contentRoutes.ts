import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { z } from "zod";
import {
    attachUploadedImage,
    createContentRecord,
    deleteContentRecord,
    getAcademicContent,
    getContentRecord,
    getHomepageContent,
    getPublicSettings,
    listContent,
    listPaginatedContent,
    updateContentRecord,
    type ContentResource,
} from "../services/contentService.js";
import { authenticateJWT, requireRole, uploadContentImage } from "../middleware/index.js";

const router = Router();
const requireAdmin = [authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"])] as const;
const optionalText = z.string().trim().nullable().optional();
const optionalMediaId = z.preprocess(
    (value) => value === "" ? null : value,
    z.uuid().nullable().optional(),
);
const safeLink = z.string().trim().refine(
    (value) => /^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value) || value.startsWith("#"),
    "Use an https:// URL, a local path, or a page anchor.",
);

const settingSchema = z.object({
    key: z.string().trim().min(1).regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers, and underscores."),
    label: z.string().trim().min(1),
    value: optionalText,
    description: optionalText,
    field_type: z.enum(["TEXT", "MULTILINE", "URL", "IMAGE"]).default("TEXT"),
    sort_order: z.coerce.number().int().default(0),
    media_id: optionalMediaId,
});

const academicItemSchema = z.object({
    title: z.string().trim().min(1),
    overview: z.string().trim().min(1),
    information: optionalText,
    link_url: safeLink,
    sort_order: z.coerce.number().int().default(0),
    is_published: z.boolean().default(true),
});

const newsSchema = z.object({
    title: z.string().trim().min(1),
    slug: z.string().trim().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    excerpt: z.string().trim().min(1),
    body: optionalText,
    link_url: z.union([safeLink, z.literal(""), z.null()]).optional(),
    image_url: z.union([safeLink, z.literal(""), z.null()]).optional(),
    media_id: optionalMediaId,
    published_at: z.coerce.date().optional(),
    is_published: z.boolean().default(true),
});

const eventSchema = z.object({
    title: z.string().trim().min(1),
    slug: z.string().trim().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: optionalText,
    starts_at: z.coerce.date(),
    ends_at: z.preprocess(
        (value) => value === "" ? null : value,
        z.coerce.date().nullable().optional(),
    ),
    location: z.string().trim().min(1),
    link_url: z.union([safeLink, z.literal(""), z.null()]).optional(),
    image_url: z.union([safeLink, z.literal(""), z.null()]).optional(),
    media_id: optionalMediaId,
    is_published: z.boolean().default(true),
});

const mediaSchema = z.object({
    title: z.string().trim().min(1),
    alt_text: optionalText,
});

const schemas = {
    settings: settingSchema,
    programs: academicItemSchema,
    scholarships: academicItemSchema,
    news: newsSchema,
    events: eventSchema,
    media: mediaSchema,
} satisfies Record<ContentResource, z.ZodObject<z.ZodRawShape>>;

type RouteHandler = (request: Request, response: Response) => Promise<void>;

function handle(handler: RouteHandler) {
    return (request: Request, response: Response, next: NextFunction) => {
        handler(request, response).catch((error: unknown) => {
            if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
                next(Object.assign(new Error("A record with the same unique value already exists."), { status: 409 }));
                return;
            }
            next(error);
        });
    };
}

function parseBody(resource: ContentResource, body: unknown, partial = false) {
    const schema = partial ? schemas[resource].partial() : schemas[resource];
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
        const details = parsed.error.issues
            .map((issue) => `${issue.path.join(".") || "value"}: ${issue.message}`)
            .join("; ");
        throw Object.assign(new Error(details), { status: 400 });
    }

    return parsed.data as Record<string, unknown>;
}

router.get("/home", handle(async (_request, response) => {
    response.json({ success: true, data: await getHomepageContent() });
}));

router.get("/academic", handle(async (_request, response) => {
    response.json({ success: true, data: await getAcademicContent() });
}));

router.get("/settings/public", handle(async (_request, response) => {
    response.json({ success: true, data: await getPublicSettings() });
}));

for (const resource of Object.keys(schemas) as ContentResource[]) {
    const publicListMiddleware = resource === "media" ? requireAdmin : [];

    router.get(`/${resource}`, ...publicListMiddleware, handle(async (request, response) => {
        response.json({
            success: true,
            data: await listContent(resource, request.query as Record<string, unknown>, true),
        });
    }));

    router.get(`/${resource}/paginated`, ...requireAdmin, handle(async (request, response) => {
        response.json({
            success: true,
            data: await listPaginatedContent(resource, request.query as Record<string, unknown>),
        });
    }));

    router.get(`/${resource}/:id`, ...requireAdmin, handle(async (request, response) => {
        const record = await getContentRecord(resource, String(request.params.id));
        if (!record) {
            response.status(404).json({ success: false, message: "Content record not found." });
            return;
        }
        response.json({ success: true, data: record });
    }));

    router.post(`/${resource}`, ...requireAdmin, handle(async (request, response) => {
        const record = await createContentRecord(resource, parseBody(resource, request.body));
        response.status(201).json({ success: true, data: record });
    }));

    router.put(`/${resource}/:id`, ...requireAdmin, handle(async (request, response) => {
        const id = String(request.params.id);
        const existing = await getContentRecord(resource, id);
        if (!existing) {
            response.status(404).json({ success: false, message: "Content record not found." });
            return;
        }
        const record = await updateContentRecord(resource, id, parseBody(resource, request.body, true));
        response.json({ success: true, data: record });
    }));

    router.delete(`/${resource}/:id`, ...requireAdmin, handle(async (request, response) => {
        const id = String(request.params.id);
        const existing = await getContentRecord(resource, id);
        if (!existing) {
            response.status(404).json({ success: false, message: "Content record not found." });
            return;
        }
        const record = await deleteContentRecord(resource, id);
        response.json({ success: true, data: record });
    }));

    if (resource === "settings" || resource === "news" || resource === "events" || resource === "media") {
        router.put(
            `/${resource}/:id/image`,
            ...requireAdmin,
            uploadContentImage,
            handle(async (request, response) => {
                if (!request.file) {
                    response.status(400).json({ success: false, message: "Select an image to upload." });
                    return;
                }
                const record = await attachUploadedImage(resource, String(request.params.id), request.file);
                response.json({ success: true, data: record });
            }),
        );
    }
}

export default router;
