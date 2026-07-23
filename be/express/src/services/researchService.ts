import prisma from "../prisma/client.js";
import {
    ResearchCluster,
    ResearchTag,
    CreateResearchClusterDTO,
    UpdateResearchClusterDTO,
    CreateResearchTagDTO,
    UpdateResearchTagDTO,
    ResearchClusterFilters,
    ResearchTagFilters,
    PaginatedResult
} from "../types/index.js";
import { Prisma, Visibility } from "@prisma/client";

/**
 * Common include clause for ResearchCluster queries
 */
const clusterIncludeClause = {
    tags: {
        where: { deleted_at: null },
        include: {
            _count: {
                select: {
                    lecturers: {
                        where: { lecturer: { deleted_at: null, is_active: true } }
                    },
                    projects: {
                        where: { project: { deleted_at: null, visibility: Visibility.PUBLIC } }
                    }
                }
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
        where: { lecturer: { deleted_at: null } },
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
    const clusterConditions: Prisma.ResearchClusterWhereInput[] = [{ deleted_at: null }];
    if (filters?.search) {
        clusterConditions.push({
            OR: [
                { name: { contains: filters.search, mode: "insensitive" } },
                { description: { contains: filters.search, mode: "insensitive" } },
                { slug: { contains: filters.search, mode: "insensitive" } }
            ]
        });
    }
    if (filters?.cluster_id) clusterConditions.push({ id: filters.cluster_id });
    if (filters?.cluster_slug) clusterConditions.push({ slug: filters.cluster_slug });

    const tagWhere: Prisma.ResearchTagWhereInput = { is_active: true, deleted_at: null };
    if (filters?.search) {
        tagWhere.OR = [
            { name: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
            { slug: { contains: filters.search, mode: "insensitive" } }
        ];
    }

    const [clusters, totalTags, activeTags, totalLecturers, totalProjects, totalPublications] = await Promise.all([
        prisma.researchCluster.findMany({
            where: { AND: clusterConditions },
            orderBy: { sort_order: "asc" },
            include: {
                tags: {
                    where: tagWhere,
                    include: {
                        _count: {
                            select: {
                                lecturers: {
                                    where: { lecturer: { deleted_at: null, is_active: true } }
                                },
                                projects: {
                                    where: { project: { deleted_at: null, visibility: Visibility.PUBLIC } }
                                }
                            }
                        }
                    }
                }
            }
        }),
        prisma.researchTag.count({ where: { deleted_at: null } }),
        prisma.researchTag.count({ where: { is_active: true, deleted_at: null } }),
        prisma.lecturer.count({ where: { deleted_at: null, is_active: true } }),
        prisma.project.count({ where: { deleted_at: null, visibility: Visibility.PUBLIC } }),
        prisma.publication.count({ where: { deleted_at: null } })
    ]);

    const enrichedClusters = await Promise.all(
        clusters.map(async (cluster) => {
            const [lecturerCount, projectCount, publicationCount] = await Promise.all([
                prisma.lecturer.count({
                    where: {
                        deleted_at: null,
                        is_active: true,
                        research_tags: {
                            some: {
                                tag: {
                                    cluster_id: cluster.id,
                                    deleted_at: null,
                                    is_active: true
                                }
                            }
                        }
                    }
                }),
                prisma.project.count({
                    where: {
                        deleted_at: null,
                        visibility: Visibility.PUBLIC,
                        research_tags: {
                            some: {
                                tag: {
                                    cluster_id: cluster.id,
                                    deleted_at: null,
                                    is_active: true
                                }
                            }
                        }
                    }
                }),
                prisma.publication.count({
                    where: {
                        deleted_at: null,
                        lecturers: {
                            some: {
                                lecturer: {
                                    deleted_at: null,
                                    research_tags: {
                                        some: {
                                            tag: {
                                                cluster_id: cluster.id,
                                                deleted_at: null,
                                                is_active: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
            ]);

            return {
                id: cluster.id,
                name: cluster.name,
                slug: cluster.slug,
                description: cluster.description,
                sort_order: cluster.sort_order,
                lecturer_count: lecturerCount,
                project_count: projectCount,
                publication_count: publicationCount,
                tags: cluster.tags.map((tag) => ({
                    id: tag.id,
                    name: tag.name,
                    slug: tag.slug,
                    description: tag.description,
                    lecturer_count: tag._count.lecturers,
                    project_count: tag._count.projects
                }))
            };
        })
    );

    return {
        summary: {
            total_clusters: clusters.length,
            total_tags: totalTags,
            active_tags: activeTags,
            total_lecturers: totalLecturers,
            total_projects: totalProjects,
            total_publications: totalPublications
        },
        clusters: enrichedClusters
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
 * Get paginated list of research clusters
 */
export const getPaginatedResearchClusters = async (filters?: ResearchClusterFilters): Promise<PaginatedResult<ResearchCluster>> => {
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
    const page = filters?.page ? Number(filters.page) : 1;
    const limit = filters?.limit ? Number(filters.limit) : 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        prisma.researchCluster.findMany({
            where,
            skip,
            take: limit,
            orderBy: { sort_order: "asc" },
            include: {
                tags: filters?.include_tags !== false ? clusterIncludeClause.tags : false
            }
        }),
        prisma.researchCluster.count({ where })
    ]);

    const total_pages = Math.ceil(total / limit);

    return {
        data: data as unknown as ResearchCluster[],
        total,
        page,
        limit,
        total_pages
    };
};

/**
 * Get soft-deleted research clusters for the protected admin trash view.
 */
export const getDeletedResearchClusters = async (): Promise<ResearchCluster[]> => {
    const clusters = await prisma.researchCluster.findMany({
        where: { deleted_at: { not: null } },
        orderBy: { deleted_at: "desc" },
        include: clusterIncludeClause
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
 * Get paginated list of research tags
 */
export const getPaginatedResearchTags = async (filters?: ResearchTagFilters): Promise<PaginatedResult<ResearchTag>> => {
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
    const page = filters?.page ? Number(filters.page) : 1;
    const limit = filters?.limit ? Number(filters.limit) : 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        prisma.researchTag.findMany({
            where,
            skip,
            take: limit,
            orderBy: { name: "asc" },
            include: tagIncludeClause
        }),
        prisma.researchTag.count({ where })
    ]);

    const total_pages = Math.ceil(total / limit);

    return {
        data: data as unknown as ResearchTag[],
        total,
        page,
        limit,
        total_pages
    };
};

/**
 * Get soft-deleted research tags for the protected admin trash view.
 */
export const getDeletedResearchTags = async (): Promise<ResearchTag[]> => {
    const tags = await prisma.researchTag.findMany({
        where: { deleted_at: { not: null } },
        orderBy: { deleted_at: "desc" },
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

/**
 * Import or batch upsert research clusters (supports CSV parsed items or JSON arrays)
 */
export const importResearchClustersCSV = async (
    items?: any[] | any
): Promise<{ imported: number; updated: number; errors: number } | boolean> => {
    if (!items || !Array.isArray(items)) {
        return true;
    }

    let imported = 0;
    let updated = 0;
    let errors = 0;

    for (const item of items) {
        try {
            if (!item.name) {
                errors++;
                continue;
            }

            const slug = item.slug || item.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

            const existing = await prisma.researchCluster.findFirst({
                where: {
                    OR: [
                        { slug },
                        { name: { equals: item.name, mode: "insensitive" } }
                    ]
                }
            });

            if (existing) {
                await prisma.researchCluster.update({
                    where: { id: existing.id },
                    data: {
                        name: item.name || existing.name,
                        slug: slug || existing.slug,
                        description: item.description !== undefined ? item.description : existing.description,
                        sort_order: item.sort_order !== undefined ? Number(item.sort_order) : existing.sort_order,
                        deleted_at: null
                    }
                });
                updated++;
            } else {
                await prisma.researchCluster.create({
                    data: {
                        name: item.name,
                        slug,
                        description: item.description || null,
                        sort_order: item.sort_order ? Number(item.sort_order) : null
                    }
                });
                imported++;
            }
        } catch (err) {
            console.error("Error importing research cluster item:", err);
            errors++;
        }
    }

    return { imported, updated, errors };
};

/**
 * Import or batch upsert research tags (supports CSV parsed items or JSON arrays)
 */
export const importResearchTagsCSV = async (
    items?: any[] | any
): Promise<{ imported: number; updated: number; errors: number } | boolean> => {
    if (!items || !Array.isArray(items)) {
        return true;
    }

    let imported = 0;
    let updated = 0;
    let errors = 0;

    for (const item of items) {
        try {
            if (!item.name || (!item.cluster_id && !item.cluster_slug)) {
                errors++;
                continue;
            }

            const slug = item.slug || item.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

            let clusterId = item.cluster_id;
            if (!clusterId && item.cluster_slug) {
                const cluster = await prisma.researchCluster.findFirst({
                    where: { slug: item.cluster_slug, deleted_at: null }
                });
                if (cluster) {
                    clusterId = cluster.id;
                }
            }

            if (!clusterId) {
                errors++;
                continue;
            }

            const existing = await prisma.researchTag.findFirst({
                where: {
                    OR: [
                        { slug },
                        {
                            AND: [
                                { name: { equals: item.name, mode: "insensitive" } },
                                { cluster_id: clusterId }
                            ]
                        }
                    ]
                }
            });

            if (existing) {
                await prisma.researchTag.update({
                    where: { id: existing.id },
                    data: {
                        name: item.name || existing.name,
                        slug: slug || existing.slug,
                        cluster_id: clusterId,
                        description: item.description !== undefined ? item.description : existing.description,
                        is_active: item.is_active !== undefined ? (item.is_active === "true" || item.is_active === true) : existing.is_active,
                        deleted_at: null
                    }
                });
                updated++;
            } else {
                await prisma.researchTag.create({
                    data: {
                        name: item.name,
                        slug,
                        cluster_id: clusterId,
                        description: item.description || null,
                        is_active: item.is_active !== undefined ? (item.is_active === "true" || item.is_active === true) : true
                    }
                });
                imported++;
            }
        } catch (err) {
            console.error("Error importing research tag item:", err);
            errors++;
        }
    }

    return { imported, updated, errors };
};
