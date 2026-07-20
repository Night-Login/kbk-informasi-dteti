import prisma from "../prisma/client.js";
import {
    ResearchCluster,
    ResearchTag,
    CreateResearchClusterDTO,
    UpdateResearchClusterDTO,
    CreateResearchTagDTO,
    UpdateResearchTagDTO,
    ResearchClusterFilters,
    ResearchTagFilters
} from "../types/index.js";
import { Prisma } from "@prisma/client";

/**
 * Common include clause for ResearchCluster queries
 */
const clusterIncludeClause = {
    tags: {
        where: { deleted_at: null },
        include: {
            _count: {
                select: { lecturers: true }
            }
        }
    }
};

/**
 * Common include clause for ResearchTag queries
 */
const tagIncludeClause = {
    cluster: true,
    lecturers: {
        include: {
            lecturer: true
        }
    }
};

/**
 * Get overall research summary and data (clusters, tags, statistics)
 * Keeps backward compatibility with getResearch() while providing complete research tree
 */
export const getResearch = async (filters?: any): Promise<any> => {
    const [clusters, totalTags, activeTags] = await Promise.all([
        prisma.researchCluster.findMany({
            where: { deleted_at: null },
            orderBy: { sort_order: "asc" },
            include: {
                tags: {
                    where: { is_active: true, deleted_at: null },
                    include: {
                        _count: {
                            select: { lecturers: true }
                        }
                    }
                }
            }
        }),
        prisma.researchTag.count({ where: { deleted_at: null } }),
        prisma.researchTag.count({ where: { is_active: true, deleted_at: null } })
    ]);

    return {
        summary: {
            total_clusters: clusters.length,
            total_tags: totalTags,
            active_tags: activeTags
        },
        clusters: clusters.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            sort_order: c.sort_order,
            tags: c.tags.map((t) => ({
                id: t.id,
                name: t.name,
                slug: t.slug,
                description: t.description,
                lecturer_count: t._count.lecturers
            }))
        }))
    };
};

/**
 * Get research clusters matching filters
 */
export const getResearchClusters = async (filters?: ResearchClusterFilters): Promise<ResearchCluster[]> => {
    const conditions: Prisma.ResearchClusterWhereInput[] = [
        { deleted_at: null }
    ];

    if (filters?.search) {
        conditions.push({
            OR: [
                { name: { contains: filters.search, mode: "insensitive" } },
                { description: { contains: filters.search, mode: "insensitive" } },
                { slug: { contains: filters.search, mode: "insensitive" } }
            ]
        });
    }

    const where: Prisma.ResearchClusterWhereInput = { AND: conditions };

    const take = filters?.limit ? Number(filters.limit) : undefined;
    const skip = filters?.page && filters?.limit ? (Number(filters.page) - 1) * Number(filters.limit) : undefined;

    const clusters = await prisma.researchCluster.findMany({
        where,
        take,
        skip,
        orderBy: { sort_order: "asc" },
        include: {
            tags: filters?.include_tags !== false ? clusterIncludeClause.tags : false
        }
    });

    return clusters as unknown as ResearchCluster[];
};

/**
 * Get single research cluster by ID
 */
export const getResearchClusterById = async (id: string): Promise<ResearchCluster | null> => {
    const cluster = await prisma.researchCluster.findFirst({
        where: { id, deleted_at: null },
        include: clusterIncludeClause
    });

    return (cluster as unknown as ResearchCluster) || null;
};

/**
 * Get single research cluster by slug
 */
export const getResearchClusterBySlug = async (slug: string): Promise<ResearchCluster | null> => {
    const cluster = await prisma.researchCluster.findFirst({
        where: { slug, deleted_at: null },
        include: clusterIncludeClause
    });

    return (cluster as unknown as ResearchCluster) || null;
};

/**
 * Create a new research cluster
 */
export const createResearchCluster = async (data: CreateResearchClusterDTO): Promise<ResearchCluster> => {
    const cluster = await prisma.researchCluster.create({
        data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            sort_order: data.sort_order
        },
        include: clusterIncludeClause
    });

    return cluster as unknown as ResearchCluster;
};

/**
 * Update an existing research cluster
 */
export const updateResearchCluster = async (id: string, data: UpdateResearchClusterDTO): Promise<ResearchCluster> => {
    const existing = await prisma.researchCluster.findFirst({
        where: { id, deleted_at: null }
    });
    if (!existing) {
        throw new Error(`Research cluster with id ${id} not found or deleted.`);
    }

    const cluster = await prisma.researchCluster.update({
        where: { id },
        data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            sort_order: data.sort_order
        },
        include: clusterIncludeClause
    });

    return cluster as unknown as ResearchCluster;
};

/**
 * Delete a research cluster by ID (soft delete)
 */
export const deleteResearchCluster = async (id: string): Promise<boolean> => {
    try {
        await prisma.researchCluster.update({
            where: { id },
            data: { deleted_at: new Date() }
        });
        return true;
    } catch (error) {
        console.error(`Error deleting research cluster ${id}:`, error);
        return false;
    }
};

/**
 * Restore a soft-deleted research cluster by ID
 */
export const restoreResearchCluster = async (id: string): Promise<boolean> => {
    try {
        await prisma.researchCluster.update({
            where: { id },
            data: { deleted_at: null }
        });
        return true;
    } catch (error) {
        console.error(`Error restoring research cluster ${id}:`, error);
        return false;
    }
};

/**
 * Get all research tags matching filters
 */
export const getResearchTags = async (filters?: ResearchTagFilters): Promise<ResearchTag[]> => {
    const conditions: Prisma.ResearchTagWhereInput[] = [
        { deleted_at: null },
        { cluster: { deleted_at: null } }
    ];

    if (filters?.is_active !== undefined) {
        conditions.push({ is_active: filters.is_active });
    }

    if (filters?.cluster_id) {
        conditions.push({ cluster_id: filters.cluster_id });
    } else if (filters?.cluster_slug) {
        conditions.push({
            cluster: {
                slug: filters.cluster_slug
            }
        });
    }

    if (filters?.search) {
        conditions.push({
            OR: [
                { name: { contains: filters.search, mode: "insensitive" } },
                { description: { contains: filters.search, mode: "insensitive" } },
                { slug: { contains: filters.search, mode: "insensitive" } }
            ]
        });
    }

    const where: Prisma.ResearchTagWhereInput = { AND: conditions };

    const take = filters?.limit ? Number(filters.limit) : undefined;
    const skip = filters?.page && filters?.limit ? (Number(filters.page) - 1) * Number(filters.limit) : undefined;

    const tags = await prisma.researchTag.findMany({
        where,
        take,
        skip,
        orderBy: { name: "asc" },
        include: tagIncludeClause
    });

    return tags as unknown as ResearchTag[];
};

/**
 * Get single research tag by ID
 */
export const getResearchTagById = async (id: string): Promise<ResearchTag | null> => {
    const tag = await prisma.researchTag.findFirst({
        where: { id, deleted_at: null, cluster: { deleted_at: null } },
        include: tagIncludeClause
    });

    return (tag as unknown as ResearchTag) || null;
};

/**
 * Get single research tag by slug
 */
export const getResearchTagBySlug = async (slug: string): Promise<ResearchTag | null> => {
    const tag = await prisma.researchTag.findFirst({
        where: { slug, deleted_at: null, cluster: { deleted_at: null } },
        include: tagIncludeClause
    });

    return (tag as unknown as ResearchTag) || null;
};

/**
 * Create a new research tag
 */
export const createResearchTag = async (data: CreateResearchTagDTO): Promise<ResearchTag> => {
    const tag = await prisma.researchTag.create({
        data: {
            name: data.name,
            slug: data.slug,
            cluster_id: data.cluster_id,
            description: data.description,
            is_active: data.is_active !== undefined ? data.is_active : true
        },
        include: tagIncludeClause
    });

    return tag as unknown as ResearchTag;
};

/**
 * Update an existing research tag
 */
export const updateResearchTag = async (id: string, data: UpdateResearchTagDTO): Promise<ResearchTag> => {
    const existing = await prisma.researchTag.findFirst({
        where: { id, deleted_at: null }
    });
    if (!existing) {
        throw new Error(`Research tag with id ${id} not found or deleted.`);
    }

    const tag = await prisma.researchTag.update({
        where: { id },
        data: {
            name: data.name,
            slug: data.slug,
            cluster_id: data.cluster_id,
            description: data.description,
            is_active: data.is_active
        },
        include: tagIncludeClause
    });

    return tag as unknown as ResearchTag;
};

/**
 * Delete a research tag by ID (soft delete)
 */
export const deleteResearchTag = async (id: string): Promise<boolean> => {
    try {
        await prisma.researchTag.update({
            where: { id },
            data: { deleted_at: new Date() }
        });
        return true;
    } catch (error) {
        console.error(`Error deleting research tag ${id}:`, error);
        return false;
    }
};

/**
 * Restore a soft-deleted research tag by ID
 */
export const restoreResearchTag = async (id: string): Promise<boolean> => {
    try {
        await prisma.researchTag.update({
            where: { id },
            data: { deleted_at: null }
        });
        return true;
    } catch (error) {
        console.error(`Error restoring research tag ${id}:`, error);
        return false;
    }
};
