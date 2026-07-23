import prisma from "../prisma/client.js";
import {
    Publication,
    CreatePublicationDTO,
    UpdatePublicationDTO,
    PublicationFilters,
    PaginatedResult
} from "../types/index.js";
import { Prisma } from "@prisma/client";

/**
 * Common include clause for Publication queries
 */
const includeClause = {
    lecturers: {
        where: { lecturer: { deleted_at: null } },
        include: {
            lecturer: {
                include: {
                    research_tags: {
                        where: { tag: { deleted_at: null, is_active: true } },
                        include: {
                            tag: {
                                include: {
                                    cluster: true
                                }
                            }
                        }
                    }
                }
            }
        },
        orderBy: {
            author_order: "asc" as const
        }
    }
};

/**
 * Build Prisma where clause from publication filters
 */
const buildWhereClause = (filters?: PublicationFilters): Prisma.PublicationWhereInput => {
    const conditions: Prisma.PublicationWhereInput[] = [
        { deleted_at: null }
    ];

    if (!filters) return { AND: conditions };

    if (filters.year !== undefined) {
        conditions.push({ year: filters.year });
    } else if (filters.min_year !== undefined || filters.max_year !== undefined) {
        const yearCondition: Prisma.IntFilter = {};
        if (filters.min_year !== undefined) yearCondition.gte = filters.min_year;
        if (filters.max_year !== undefined) yearCondition.lte = filters.max_year;
        conditions.push({ year: yearCondition });
    }

    if (filters.venue) {
        conditions.push({ venue: { contains: filters.venue, mode: "insensitive" } });
    }

    if (filters.publication_type) {
        conditions.push({ publication_type: filters.publication_type });
    }

    if (filters.source) {
        conditions.push({ source: filters.source });
    }

    if (filters.verified_status) {
        conditions.push({ verified_status: filters.verified_status });
    }

    if (filters.lecturer_id) {
        conditions.push({
            lecturers: {
                some: {
                    lecturer_id: filters.lecturer_id,
                    lecturer: { deleted_at: null }
                }
            }
        });
    } else if (filters.lecturer_slug) {
        conditions.push({
            lecturers: {
                some: {
                    lecturer: {
                        slug: filters.lecturer_slug,
                        deleted_at: null
                    }
                }
            }
        });
    }

    if (filters.tag_id) {
        conditions.push({
            lecturers: {
                some: {
                    lecturer: {
                        deleted_at: null,
                        research_tags: {
                            some: {
                                tag_id: filters.tag_id,
                                tag: { deleted_at: null }
                            }
                        }
                    }
                }
            }
        });
    } else if (filters.tag_slug) {
        conditions.push({
            lecturers: {
                some: {
                    lecturer: {
                        deleted_at: null,
                        research_tags: {
                            some: {
                                tag: {
                                    slug: filters.tag_slug,
                                    deleted_at: null
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    if (filters.cluster_id) {
        conditions.push({
            lecturers: {
                some: {
                    lecturer: {
                        deleted_at: null,
                        research_tags: {
                            some: {
                                tag: {
                                    cluster_id: filters.cluster_id,
                                    deleted_at: null
                                }
                            }
                        }
                    }
                }
            }
        });
    } else if (filters.cluster_slug) {
        conditions.push({
            lecturers: {
                some: {
                    lecturer: {
                        deleted_at: null,
                        research_tags: {
                            some: {
                                tag: {
                                    cluster: {
                                        slug: filters.cluster_slug,
                                        deleted_at: null
                                    },
                                    deleted_at: null
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    if (filters.search) {
        conditions.push({
            OR: [
                { title: { contains: filters.search, mode: "insensitive" } },
                { authors_text: { contains: filters.search, mode: "insensitive" } },
                { venue: { contains: filters.search, mode: "insensitive" } },
                { doi: { contains: filters.search, mode: "insensitive" } },
                { abstract: { contains: filters.search, mode: "insensitive" } }
            ]
        });
    }

    return { AND: conditions };
};

/**
 * Get all publications matching filters (returns array)
 */
export const getPublications = async (filters?: PublicationFilters): Promise<Publication[]> => {
    const where = buildWhereClause(filters);

    const take = filters?.limit ? Number(filters.limit) : undefined;
    const skip = filters?.page && filters?.limit ? (Number(filters.page) - 1) * Number(filters.limit) : undefined;

    const sortBy = filters?.sort_by || "year";
    const sortOrder = filters?.sort_order === "asc" ? "asc" : "desc";

    const publications = await prisma.publication.findMany({
        where,
        take,
        skip,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: includeClause
    });

    return publications as unknown as Publication[];
};

/**
 * Get paginated list of publications
 */
export const getPaginatedPublications = async (filters?: PublicationFilters): Promise<PaginatedResult<Publication>> => {
    const where = buildWhereClause(filters);
    const page = filters?.page ? Number(filters.page) : 1;
    const limit = filters?.limit ? Number(filters.limit) : 10;
    const skip = (page - 1) * limit;

    const sortBy = filters?.sort_by || "year";
    const sortOrder = filters?.sort_order === "asc" ? "asc" : "desc";

    const [data, total] = await Promise.all([
        prisma.publication.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder
            },
            include: includeClause
        }),
        prisma.publication.count({ where })
    ]);

    const total_pages = Math.ceil(total / limit);

    return {
        data: data as unknown as Publication[],
        total,
        page,
        limit,
        total_pages
    };
};

/**
 * Get soft-deleted publications for the protected admin trash view.
 */
export const getDeletedPublications = async (): Promise<Publication[]> => {
    const publications = await prisma.publication.findMany({
        where: { deleted_at: { not: null } },
        orderBy: { deleted_at: "desc" },
        include: includeClause
    });

    return publications as unknown as Publication[];
};

/**
 * Get a single publication by ID
 */
export const getPublicationById = async (id: string): Promise<Publication | null> => {
    const publication = await prisma.publication.findFirst({
        where: { id, deleted_at: null },
        include: includeClause
    });

    return (publication as unknown as Publication) || null;
};

/**
 * Get a single publication by slug
 */
export const getPublicationBySlug = async (slug: string): Promise<Publication | null> => {
    const publication = await prisma.publication.findFirst({
        where: { slug, deleted_at: null },
        include: includeClause
    });

    return (publication as unknown as Publication) || null;
};

/**
 * Get a single publication by DOI
 */
export const getPublicationByDoi = async (doi: string): Promise<Publication | null> => {
    const publication = await prisma.publication.findFirst({
        where: { doi, deleted_at: null },
        include: includeClause
    });

    return (publication as unknown as Publication) || null;
};

/**
 * Create a new publication along with optional author relations
 */
export const createPublication = async (data: CreatePublicationDTO): Promise<Publication> => {
    const { lecturers, ...pubData } = data;

    const publication = await prisma.$transaction(async (tx) => {
        const created = await tx.publication.create({
            data: {
                title: pubData.title,
                slug: pubData.slug,
                year: Number(pubData.year),
                publication_date: pubData.publication_date,
                authors_text: pubData.authors_text,
                venue: pubData.venue,
                publication_type: pubData.publication_type,
                doi: pubData.doi,
                url: pubData.url,
                abstract: pubData.abstract,
                citation_count: pubData.citation_count || 0,
                source: pubData.source || "OPENALEX",
                external_ids: pubData.external_ids ? (pubData.external_ids as Prisma.InputJsonValue) : undefined,
                verified_status: pubData.verified_status || "NEEDS_REVIEW",
                fetch_batch_id: pubData.fetch_batch_id
            }
        });

        if (lecturers && lecturers.length > 0) {
            await Promise.all(
                lecturers.map((item, index) =>
                    tx.lecturerPublication.create({
                        data: {
                            publication_id: created.id,
                            lecturer_id: item.lecturer_id,
                            author_order: item.author_order !== undefined ? item.author_order : index + 1
                        }
                    })
                )
            );
        }

        return tx.publication.findUnique({
            where: { id: created.id },
            include: includeClause
        });
    });

    return publication as unknown as Publication;
};

/**
 * Update an existing publication
 */
export const updatePublication = async (id: string, data: UpdatePublicationDTO): Promise<Publication> => {
    const existing = await prisma.publication.findFirst({
        where: { id, deleted_at: null }
    });
    if (!existing) {
        throw new Error(`Publication with id ${id} not found or deleted.`);
    }

    const { lecturers, ...pubData } = data;

    const publication = await prisma.$transaction(async (tx) => {
        const updateData: Prisma.PublicationUpdateInput = {};

        if (pubData.title !== undefined) updateData.title = pubData.title;
        if (pubData.slug !== undefined) updateData.slug = pubData.slug;
        if (pubData.year !== undefined) updateData.year = Number(pubData.year);
        if (pubData.publication_date !== undefined) updateData.publication_date = pubData.publication_date;
        if (pubData.authors_text !== undefined) updateData.authors_text = pubData.authors_text;
        if (pubData.venue !== undefined) updateData.venue = pubData.venue;
        if (pubData.publication_type !== undefined) updateData.publication_type = pubData.publication_type;
        if (pubData.doi !== undefined) updateData.doi = pubData.doi;
        if (pubData.url !== undefined) updateData.url = pubData.url;
        if (pubData.abstract !== undefined) updateData.abstract = pubData.abstract;
        if (pubData.citation_count !== undefined) updateData.citation_count = pubData.citation_count;
        if (pubData.source !== undefined) updateData.source = pubData.source;
        if (pubData.external_ids !== undefined) updateData.external_ids = pubData.external_ids ? (pubData.external_ids as Prisma.InputJsonValue) : Prisma.JsonNull;
        if (pubData.verified_status !== undefined) updateData.verified_status = pubData.verified_status;
        if (pubData.fetch_batch_id !== undefined) updateData.fetch_batch_id = pubData.fetch_batch_id;

        await tx.publication.update({
            where: { id },
            data: updateData
        });

        if (lecturers !== undefined) {
            await tx.lecturerPublication.deleteMany({
                where: { publication_id: id }
            });

            if (lecturers.length > 0) {
                await Promise.all(
                    lecturers.map((item, index) =>
                        tx.lecturerPublication.create({
                            data: {
                                publication_id: id,
                                lecturer_id: item.lecturer_id,
                                author_order: item.author_order !== undefined ? item.author_order : index + 1
                            }
                        })
                    )
                );
            }
        }

        return tx.publication.findUnique({
            where: { id },
            include: includeClause
        });
    });

    return publication as unknown as Publication;
};

/**
 * Delete a publication by ID (soft delete)
 */
export const deletePublication = async (id: string): Promise<boolean> => {
    try {
        await prisma.publication.update({
            where: { id },
            data: { deleted_at: new Date() }
        });
        return true;
    } catch (error) {
        console.error(`Error deleting publication ${id}:`, error);
        return false;
    }
};

/**
 * Restore a soft-deleted publication by ID
 */
export const restorePublication = async (id: string): Promise<boolean> => {
    try {
        await prisma.publication.update({
            where: { id },
            data: { deleted_at: null }
        });
        return true;
    } catch (error) {
        console.error(`Error restoring publication ${id}:`, error);
        return false;
    }
};

/**
 * Assign or reassign lecturers to a publication
 */
export const assignLecturersToPublication = async (
    publicationId: string,
    lecturers: Array<{ lecturer_id: string; author_order?: number }>
): Promise<boolean> => {
    try {
        const existing = await prisma.publication.findFirst({
            where: { id: publicationId, deleted_at: null }
        });
        if (!existing) return false;

        await prisma.$transaction(async (tx) => {
            await tx.lecturerPublication.deleteMany({
                where: { publication_id: publicationId }
            });

            if (lecturers.length > 0) {
                await Promise.all(
                    lecturers.map((item, index) =>
                        tx.lecturerPublication.create({
                            data: {
                                publication_id: publicationId,
                                lecturer_id: item.lecturer_id,
                                author_order: item.author_order !== undefined ? item.author_order : index + 1
                            }
                        })
                    )
                );
            }
        });
        return true;
    } catch (error) {
        console.error(`Error assigning lecturers to publication ${publicationId}:`, error);
        return false;
    }
};

/**
 * Import or batch upsert publications (supports CSV parsed items or JSON arrays)
 */
export const importPublicationsCSV = async (
    items?: any[] | any
): Promise<{ imported: number; updated: number; errors: number } | boolean> => {
    if (!items || !Array.isArray(items)) {
        return true; // Backward compatibility with mock true return when no file is passed
    }

    let imported = 0;
    let updated = 0;
    let errors = 0;

    for (const item of items) {
        try {
            if (!item.title || !item.year) {
                errors++;
                continue;
            }

            const slug = item.slug || item.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

            let existing = null;
            if (item.doi) {
                existing = await prisma.publication.findUnique({ where: { doi: item.doi } });
            }
            if (!existing) {
                existing = await prisma.publication.findFirst({
                    where: {
                        OR: [
                            { slug },
                            {
                                AND: [
                                    { title: { equals: item.title, mode: "insensitive" } },
                                    { year: Number(item.year) }
                                ]
                            }
                        ]
                    }
                });
            }

            if (existing) {
                await prisma.publication.update({
                    where: { id: existing.id },
                    data: {
                        title: item.title || existing.title,
                        slug: slug || existing.slug,
                        year: Number(item.year) || existing.year,
                        publication_date: item.publication_date !== undefined ? item.publication_date : existing.publication_date,
                        authors_text: item.authors_text !== undefined ? item.authors_text : existing.authors_text,
                        venue: item.venue !== undefined ? item.venue : existing.venue,
                        publication_type: item.publication_type !== undefined ? item.publication_type : existing.publication_type,
                        url: item.url !== undefined ? item.url : existing.url,
                        abstract: item.abstract !== undefined ? item.abstract : existing.abstract,
                        citation_count: item.citation_count !== undefined ? Number(item.citation_count) : existing.citation_count,
                        source: item.source || existing.source || "CSV_IMPORT",
                        verified_status: item.verified_status || existing.verified_status,
                        deleted_at: null
                    }
                });

                if (item.lecturers && Array.isArray(item.lecturers)) {
                    await prisma.lecturerPublication.deleteMany({
                        where: { publication_id: existing.id }
                    });
                    if (item.lecturers.length > 0) {
                        await Promise.all(
                            item.lecturers.map((p: any, index: number) => {
                                const lecturerId = typeof p === "string" ? p : p.lecturer_id;
                                const authorOrder = typeof p === "string" ? index + 1 : (p.author_order !== undefined ? p.author_order : index + 1);
                                return prisma.lecturerPublication.create({
                                    data: {
                                        publication_id: existing.id,
                                        lecturer_id: lecturerId,
                                        author_order: authorOrder
                                    }
                                });
                            })
                        );
                    }
                } else if (item.lecturer_id) {
                    await prisma.lecturerPublication.deleteMany({
                        where: { publication_id: existing.id }
                    });
                    await prisma.lecturerPublication.create({
                        data: {
                            publication_id: existing.id,
                            lecturer_id: item.lecturer_id,
                            author_order: item.author_order || 1
                        }
                    });
                }

                updated++;
            } else {
                const created = await prisma.publication.create({
                    data: {
                        title: item.title,
                        slug,
                        year: Number(item.year),
                        publication_date: item.publication_date || null,
                        authors_text: item.authors_text || null,
                        venue: item.venue || null,
                        publication_type: item.publication_type || null,
                        doi: item.doi || null,
                        url: item.url || null,
                        abstract: item.abstract || null,
                        citation_count: item.citation_count ? Number(item.citation_count) : 0,
                        source: item.source || "CSV_IMPORT",
                        verified_status: item.verified_status || "VERIFIED"
                    }
                });

                if (item.lecturers && Array.isArray(item.lecturers) && item.lecturers.length > 0) {
                    await Promise.all(
                        item.lecturers.map((p: any, index: number) => {
                            const lecturerId = typeof p === "string" ? p : p.lecturer_id;
                            const authorOrder = typeof p === "string" ? index + 1 : (p.author_order !== undefined ? p.author_order : index + 1);
                            return prisma.lecturerPublication.create({
                                data: {
                                    publication_id: created.id,
                                    lecturer_id: lecturerId,
                                    author_order: authorOrder
                                }
                            });
                        })
                    );
                } else if (item.lecturer_id) {
                    await prisma.lecturerPublication.create({
                        data: {
                            publication_id: created.id,
                            lecturer_id: item.lecturer_id,
                            author_order: item.author_order || 1
                        }
                    });
                }

                imported++;
            }
        } catch (err) {
            console.error("Error importing publication item:", err);
            errors++;
        }
    }

    return { imported, updated, errors };
};
