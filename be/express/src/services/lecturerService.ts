import prisma from "../prisma/client.js";
import {
    Lecturer,
    CreateLecturerDTO,
    UpdateLecturerDTO,
    LecturerFilters,
    PaginatedResult
} from "../types/index.js";
import { Prisma } from "@prisma/client";

/**
 * Build Prisma where clause from filters
 */
const buildWhereClause = (filters?: LecturerFilters): Prisma.LecturerWhereInput => {
    if (!filters) return {};

    const conditions: Prisma.LecturerWhereInput[] = [];

    if (filters.is_active !== undefined) {
        conditions.push({ is_active: filters.is_active });
    }

    if (filters.supervision_status) {
        conditions.push({ supervision_status: filters.supervision_status });
    }

    if (filters.sinta_id) {
        conditions.push({ sinta_id: filters.sinta_id });
    }

    if (filters.tag_id) {
        conditions.push({
            research_tags: {
                some: {
                    tag_id: filters.tag_id
                }
            }
        });
    } else if (filters.tag_slug) {
        conditions.push({
            research_tags: {
                some: {
                    tag: {
                        slug: filters.tag_slug
                    }
                }
            }
        });
    }

    if (filters.cluster_id) {
        conditions.push({
            research_tags: {
                some: {
                    tag: {
                        cluster_id: filters.cluster_id
                    }
                }
            }
        });
    } else if (filters.cluster_slug) {
        conditions.push({
            research_tags: {
                some: {
                    tag: {
                        cluster: {
                            slug: filters.cluster_slug
                        }
                    }
                }
            }
        });
    }

    if (filters.search) {
        conditions.push({
            OR: [
                { full_name: { contains: filters.search, mode: "insensitive" } },
                { academic_title: { contains: filters.search, mode: "insensitive" } },
                { nip_or_staff_id: { contains: filters.search, mode: "insensitive" } },
                { email: { contains: filters.search, mode: "insensitive" } },
                { slug: { contains: filters.search, mode: "insensitive" } },
                { sinta_id: { contains: filters.search, mode: "insensitive" } }
            ]
        });
    }

    return conditions.length > 0 ? { AND: conditions } : {};
};

/**
 * Get all lecturers matching filters (returns array)
 */
export const getLecturers = async (filters?: LecturerFilters): Promise<Lecturer[]> => {
    const where = buildWhereClause(filters);

    const take = filters?.limit ? Number(filters.limit) : undefined;
    const skip = filters?.page && filters?.limit ? (Number(filters.page) - 1) * Number(filters.limit) : undefined;

    const sortBy = filters?.sort_by || "full_name";
    const sortOrder = filters?.sort_order === "desc" ? "desc" : "asc";

    const lecturers = await prisma.lecturer.findMany({
        where,
        take,
        skip,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            metrics: true,
            research_tags: {
                include: {
                    tag: true
                }
            },
            publications: {
                include: {
                    publication: true
                }
            }
        }
    });

    return lecturers as unknown as Lecturer[];
};

/**
 * Get paginated list of lecturers
 */
export const getPaginatedLecturers = async (filters?: LecturerFilters): Promise<PaginatedResult<Lecturer>> => {
    const where = buildWhereClause(filters);
    const page = filters?.page ? Number(filters.page) : 1;
    const limit = filters?.limit ? Number(filters.limit) : 10;
    const skip = (page - 1) * limit;

    const sortBy = filters?.sort_by || "full_name";
    const sortOrder = filters?.sort_order === "desc" ? "desc" : "asc";

    const [data, total] = await Promise.all([
        prisma.lecturer.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder
            },
            include: {
                metrics: true,
                research_tags: {
                    include: {
                        tag: true
                    }
                },
                publications: {
                    include: {
                        publication: true
                    }
                }
            }
        }),
        prisma.lecturer.count({ where })
    ]);

    const total_pages = Math.ceil(total / limit);

    return {
        data: data as unknown as Lecturer[],
        total,
        page,
        limit,
        total_pages
    };
};

/**
 * Get a single lecturer by slug
 */
export const getLecturerBySlug = async (slug: string): Promise<Lecturer | null> => {
    const lecturer = await prisma.lecturer.findUnique({
        where: { slug },
        include: {
            metrics: true,
            research_tags: {
                include: {
                    tag: {
                        include: {
                            cluster: true
                        }
                    }
                }
            },
            publications: {
                include: {
                    publication: true
                },
                orderBy: {
                    publication: {
                        year: "desc"
                    }
                }
            }
        }
    });

    return (lecturer as unknown as Lecturer) || null;
};

/**
 * Alias for backward compatibility
 */
export const getLecturersBySlug = async (slug: string): Promise<Lecturer | null> => {
    return getLecturerBySlug(slug);
};

/**
 * Get a single lecturer by ID
 */
export const getLecturerById = async (id: string): Promise<Lecturer | null> => {
    const lecturer = await prisma.lecturer.findUnique({
        where: { id },
        include: {
            metrics: true,
            research_tags: {
                include: {
                    tag: true
                }
            },
            publications: {
                include: {
                    publication: true
                }
            }
        }
    });

    return (lecturer as unknown as Lecturer) || null;
};

/**
 * Get a single lecturer by SINTA ID
 */
export const getLecturerBySintaId = async (sintaId: string): Promise<Lecturer | null> => {
    const lecturer = await prisma.lecturer.findUnique({
        where: { sinta_id: sintaId },
        include: {
            metrics: true,
            research_tags: {
                include: {
                    tag: true
                }
            }
        }
    });

    return (lecturer as unknown as Lecturer) || null;
};

/**
 * Create a new lecturer along with optional metrics and tags
 */
export const createLecturer = async (data: CreateLecturerDTO): Promise<Lecturer> => {
    const { metrics, tag_ids, ...lecturerData } = data;

    const lecturer = await prisma.$transaction(async (tx) => {
        const created = await tx.lecturer.create({
            data: {
                full_name: lecturerData.full_name,
                academic_title: lecturerData.academic_title,
                slug: lecturerData.slug,
                nip_or_staff_id: lecturerData.nip_or_staff_id,
                email: lecturerData.email,
                sinta_id: lecturerData.sinta_id,
                scopus_author_id: lecturerData.scopus_author_id,
                google_scholar_url: lecturerData.google_scholar_url,
                google_scholar_id: lecturerData.google_scholar_id,
                orcid_id: lecturerData.orcid_id,
                openalex_author_id: lecturerData.openalex_author_id,
                semantic_scholar_id: lecturerData.semantic_scholar_id,
                supervision_status: lecturerData.supervision_status,
                is_active: lecturerData.is_active !== undefined ? lecturerData.is_active : true,
                source_csv_row_ref: lecturerData.source_csv_row_ref
            }
        });

        if (metrics) {
            await tx.lecturerMetric.create({
                data: {
                    lecturer_id: created.id,
                    h_index: metrics.h_index || 0,
                    total_citations: metrics.total_citations || 0,
                    sinta_score: metrics.sinta_score,
                    source: metrics.source || "MANUAL"
                }
            });
        }

        if (tag_ids && tag_ids.length > 0) {
            await Promise.all(
                tag_ids.map((tagId, index) =>
                    tx.lecturerResearchTag.create({
                        data: {
                            lecturer_id: created.id,
                            tag_id: tagId,
                            is_primary: index === 0
                        }
                    })
                )
            );
        }

        return tx.lecturer.findUnique({
            where: { id: created.id },
            include: {
                metrics: true,
                research_tags: {
                    include: {
                        tag: true
                    }
                }
            }
        });
    });

    return lecturer as unknown as Lecturer;
};

/**
 * Update an existing lecturer
 */
export const updateLecturer = async (id: string, data: UpdateLecturerDTO): Promise<Lecturer> => {
    const { metrics, tag_ids, ...lecturerData } = data;

    const lecturer = await prisma.$transaction(async (tx) => {
        await tx.lecturer.update({
            where: { id },
            data: lecturerData
        });

        if (metrics) {
            await tx.lecturerMetric.upsert({
                where: { lecturer_id: id },
                create: {
                    lecturer_id: id,
                    h_index: metrics.h_index || 0,
                    total_citations: metrics.total_citations || 0,
                    sinta_score: metrics.sinta_score,
                    source: metrics.source || "MANUAL"
                },
                update: {
                    h_index: metrics.h_index,
                    total_citations: metrics.total_citations,
                    sinta_score: metrics.sinta_score,
                    source: metrics.source,
                    fetched_at: new Date()
                }
            });
        }

        if (tag_ids !== undefined) {
            await tx.lecturerResearchTag.deleteMany({
                where: { lecturer_id: id }
            });

            if (tag_ids.length > 0) {
                await Promise.all(
                    tag_ids.map((tagId, index) =>
                        tx.lecturerResearchTag.create({
                            data: {
                                lecturer_id: id,
                                tag_id: tagId,
                                is_primary: index === 0
                            }
                        })
                    )
                );
            }
        }

        return tx.lecturer.findUnique({
            where: { id },
            include: {
                metrics: true,
                research_tags: {
                    include: {
                        tag: true
                    }
                }
            }
        });
    });

    return lecturer as unknown as Lecturer;
};

/**
 * Delete a lecturer by ID
 */
export const deleteLecturer = async (id: string): Promise<boolean> => {
    try {
        await prisma.lecturer.delete({
            where: { id }
        });
        return true;
    } catch (error) {
        console.error(`Error deleting lecturer ${id}:`, error);
        return false;
    }
};

/**
 * Assign research tags to a lecturer
 */
export const assignResearchTagsToLecturer = async (
    lecturerId: string,
    tags: Array<{ tag_id: string; is_primary?: boolean }>
): Promise<boolean> => {
    try {
        await prisma.$transaction(async (tx) => {
            await tx.lecturerResearchTag.deleteMany({
                where: { lecturer_id: lecturerId }
            });

            if (tags.length > 0) {
                await Promise.all(
                    tags.map((tag) =>
                        tx.lecturerResearchTag.create({
                            data: {
                                lecturer_id: lecturerId,
                                tag_id: tag.tag_id,
                                is_primary: tag.is_primary || false
                            }
                        })
                    )
                );
            }
        });
        return true;
    } catch (error) {
        console.error(`Error assigning tags to lecturer ${lecturerId}:`, error);
        return false;
    }
};

/**
 * Upsert metrics for a lecturer
 */
export const upsertLecturerMetric = async (
    lecturerId: string,
    metricData: {
        h_index?: number;
        total_citations?: number;
        sinta_score?: number;
        source?: string;
    }
): Promise<any> => {
    return prisma.lecturerMetric.upsert({
        where: { lecturer_id: lecturerId },
        create: {
            lecturer_id: lecturerId,
            h_index: metricData.h_index || 0,
            total_citations: metricData.total_citations || 0,
            sinta_score: metricData.sinta_score,
            source: metricData.source || "MANUAL"
        },
        update: {
            h_index: metricData.h_index,
            total_citations: metricData.total_citations,
            sinta_score: metricData.sinta_score,
            source: metricData.source,
            fetched_at: new Date()
        }
    });
};
