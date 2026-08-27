import fs from "node:fs/promises";
import path from "node:path";
import prisma from "../prisma/client.js";

export type ContentResource =
    | "settings"
    | "programs"
    | "scholarships"
    | "news"
    | "events"
    | "media";

type ContentRecord = Record<string, unknown> & { id: string };
type QueryArguments = Record<string, unknown>;
type ContentDelegate = {
    findMany: (arguments_: QueryArguments) => Promise<ContentRecord[]>;
    findUnique: (arguments_: QueryArguments) => Promise<ContentRecord | null>;
    count: (arguments_: QueryArguments) => Promise<number>;
    create: (arguments_: QueryArguments) => Promise<ContentRecord>;
    update: (arguments_: QueryArguments) => Promise<ContentRecord>;
    delete: (arguments_: QueryArguments) => Promise<ContentRecord>;
};

const resourceConfiguration: Record<
    ContentResource,
    {
        searchableFields: string[];
        sortableFields: string[];
        defaultSort: string;
        defaultDirection: "asc" | "desc";
        publishable: boolean;
        includesMedia: boolean;
    }
> = {
    settings: {
        searchableFields: ["label", "key", "description"],
        sortableFields: ["label", "key", "sort_order", "created_at", "updated_at"],
        defaultSort: "sort_order",
        defaultDirection: "asc",
        publishable: false,
        includesMedia: true,
    },
    programs: {
        searchableFields: ["title", "overview", "information"],
        sortableFields: ["title", "sort_order", "is_published", "created_at", "updated_at"],
        defaultSort: "sort_order",
        defaultDirection: "asc",
        publishable: true,
        includesMedia: false,
    },
    scholarships: {
        searchableFields: ["title", "overview", "information"],
        sortableFields: ["title", "sort_order", "is_published", "created_at", "updated_at"],
        defaultSort: "sort_order",
        defaultDirection: "asc",
        publishable: true,
        includesMedia: false,
    },
    news: {
        searchableFields: ["title", "slug", "excerpt", "body"],
        sortableFields: ["title", "slug", "published_at", "is_published", "created_at", "updated_at"],
        defaultSort: "published_at",
        defaultDirection: "desc",
        publishable: true,
        includesMedia: true,
    },
    events: {
        searchableFields: ["title", "slug", "description", "location"],
        sortableFields: ["title", "slug", "starts_at", "location", "is_published", "created_at", "updated_at"],
        defaultSort: "starts_at",
        defaultDirection: "asc",
        publishable: true,
        includesMedia: true,
    },
    media: {
        searchableFields: ["title", "alt_text", "file_name"],
        sortableFields: ["title", "file_name", "file_size", "created_at", "updated_at"],
        defaultSort: "created_at",
        defaultDirection: "desc",
        publishable: false,
        includesMedia: false,
    },
};

function getDelegate(resource: ContentResource): ContentDelegate {
    const delegate = {
        settings: prisma.siteSetting,
        programs: prisma.academicProgram,
        scholarships: prisma.scholarship,
        news: prisma.newsArticle,
        events: prisma.event,
        media: prisma.mediaAsset,
    }[resource];

    return delegate as unknown as ContentDelegate;
}

function getInclude(resource: ContentResource): QueryArguments {
    return resourceConfiguration[resource].includesMedia
        ? { include: { media: true } }
        : {};
}

function buildWhere(
    resource: ContentResource,
    query: Record<string, unknown>,
    publicOnly: boolean,
): QueryArguments {
    const configuration = resourceConfiguration[resource];
    const conditions: QueryArguments[] = [];
    const search = typeof query.search === "string" ? query.search.trim() : "";

    if (search) {
        conditions.push({
            OR: configuration.searchableFields.map((field) => ({
                [field]: { contains: search, mode: "insensitive" },
            })),
        });
    }

    if (configuration.publishable) {
        if (publicOnly) {
            conditions.push({ is_published: true });
        } else if (query.is_published === "true" || query.is_published === "false") {
            conditions.push({ is_published: query.is_published === "true" });
        }
    }

    if (resource === "settings" && typeof query.field_type === "string") {
        conditions.push({ field_type: query.field_type });
    }

    return conditions.length > 0 ? { AND: conditions } : {};
}

export async function listContent(
    resource: ContentResource,
    query: Record<string, unknown> = {},
    publicOnly = false,
): Promise<ContentRecord[]> {
    const configuration = resourceConfiguration[resource];
    const requestedSort = typeof query.sort_by === "string" ? query.sort_by : "";
    const sortField = configuration.sortableFields.includes(requestedSort)
        ? requestedSort
        : configuration.defaultSort;
    const direction = query.sort_order === "asc" || query.sort_order === "desc"
        ? query.sort_order
        : configuration.defaultDirection;
    const requestedLimit = typeof query.limit === "string" ? Number(query.limit) : undefined;
    const take = requestedLimit && Number.isFinite(requestedLimit)
        ? Math.min(Math.max(requestedLimit, 1), 1000)
        : undefined;

    return getDelegate(resource).findMany({
        where: buildWhere(resource, query, publicOnly),
        orderBy: { [sortField]: direction },
        ...(take ? { take } : {}),
        ...getInclude(resource),
    });
}

export async function listPaginatedContent(
    resource: ContentResource,
    query: Record<string, unknown>,
) {
    const configuration = resourceConfiguration[resource];
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(1000, Math.max(1, Number(query.limit) || 25));
    const requestedSort = typeof query.sort_by === "string" ? query.sort_by : "";
    const sortField = configuration.sortableFields.includes(requestedSort)
        ? requestedSort
        : configuration.defaultSort;
    const direction = query.sort_order === "asc" || query.sort_order === "desc"
        ? query.sort_order
        : configuration.defaultDirection;
    const where = buildWhere(resource, query, false);
    const delegate = getDelegate(resource);
    const [data, total] = await Promise.all([
        delegate.findMany({
            where,
            orderBy: { [sortField]: direction },
            skip: (page - 1) * limit,
            take: limit,
            ...getInclude(resource),
        }),
        delegate.count({ where }),
    ]);

    return {
        data,
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
    };
}

export async function getContentRecord(resource: ContentResource, id: string) {
    return getDelegate(resource).findUnique({ where: { id }, ...getInclude(resource) });
}

export async function createContentRecord(resource: ContentResource, data: QueryArguments) {
    return getDelegate(resource).create({ data, ...getInclude(resource) });
}

export async function updateContentRecord(
    resource: ContentResource,
    id: string,
    data: QueryArguments,
) {
    return getDelegate(resource).update({ where: { id }, data, ...getInclude(resource) });
}

export async function removeUploadedFile(fileUrl: unknown) {
    if (typeof fileUrl !== "string" || !fileUrl.startsWith("/uploads/media/")) {
        return;
    }

    const filename = path.basename(fileUrl);
    const absolutePath = path.join(process.cwd(), "uploads", "media", filename);
    await fs.unlink(absolutePath).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== "ENOENT") throw error;
    });
}

export async function deleteContentRecord(resource: ContentResource, id: string) {
    if (resource === "media") {
        const [settingsUsingImage, newsUsingImage, eventsUsingImage, clustersUsingImage] = await Promise.all([
            prisma.siteSetting.count({ where: { media_id: id } }),
            prisma.newsArticle.count({ where: { media_id: id } }),
            prisma.event.count({ where: { media_id: id } }),
            prisma.researchCluster.count({ where: { media_id: id } }),
        ]);

        if (settingsUsingImage > 0 || newsUsingImage > 0 || eventsUsingImage > 0 || clustersUsingImage > 0) {
            throw Object.assign(
                new Error("This image is still used by website settings, news articles, events, or research clusters. Remove it from those records before deleting it."),
                { status: 409 },
            );
        }
    }

    const record = await getDelegate(resource).delete({ where: { id } });
    if (resource === "media") {
        await removeUploadedFile(record.file_url);
    }
    return record;
}

export async function attachUploadedImage(
    resource: "settings" | "news" | "events" | "media",
    id: string,
    file: Express.Multer.File,
) {
    const fileUrl = `/uploads/media/${file.filename}`;
    const metadata = {
        file_url: fileUrl,
        file_name: file.originalname,
        mime_type: file.mimetype,
        file_size: file.size,
    };

    const existing = await getContentRecord(resource, id);
    if (!existing) {
        await removeUploadedFile(fileUrl);
        throw Object.assign(new Error("Content record not found"), { status: 404 });
    }

    if (resource === "media") {
        let updated: ContentRecord;

        try {
            updated = await updateContentRecord(resource, id, metadata);
        } catch (error) {
            await removeUploadedFile(fileUrl);
            throw error;
        }

        if (existing.file_url) await removeUploadedFile(existing.file_url);
        return updated;
    }

    let createdMediaId: string | undefined;

    try {
        const media = await prisma.mediaAsset.create({
            data: {
                title: typeof existing.label === "string"
                    ? existing.label
                    : typeof existing.title === "string"
                        ? existing.title
                        : file.originalname,
                alt_text: typeof existing.title === "string" ? existing.title : file.originalname,
                ...metadata,
            },
        });
        createdMediaId = media.id;

        return await updateContentRecord(resource, id, {
            media_id: media.id,
            ...(resource === "settings" ? { value: fileUrl } : { image_url: fileUrl }),
        });
    } catch (error) {
        if (createdMediaId) {
            await prisma.mediaAsset.delete({ where: { id: createdMediaId } }).catch(() => undefined);
        }
        await removeUploadedFile(fileUrl);
        throw error;
    }
}

export async function getPublicSettings() {
    const settings = await listContent("settings", {}, true);

    return Object.fromEntries(
        settings.map((setting) => {
            const media = setting.media as { file_url?: string | null } | null | undefined;
            return [setting.key, media?.file_url || setting.value || ""];
        }),
    ) as Record<string, string>;
}

export async function getHomepageContent() {
    const [settings, news, events] = await Promise.all([
        getPublicSettings(),
        listContent("news", { limit: "6" }, true),
        listContent("events", { limit: "6" }, true),
    ]);

    return { settings, news, events };
}

export async function getAcademicContent() {
    const [settings, programs, scholarships] = await Promise.all([
        getPublicSettings(),
        listContent("programs", {}, true),
        listContent("scholarships", {}, true),
    ]);

    return { settings, programs, scholarships };
}
