import prisma from "../prisma/client.js";
import {
    Project,
    CreateProjectDTO,
    UpdateProjectDTO,
    ProjectFilters,
    PaginatedResult
} from "../types/index.js";
import { Prisma, Status, Visibility } from "@prisma/client";

/**
 * Common include clause for Project queries
 */
const includeClause = {
    lead_lecturer: true,
    research_tags: {
        where: { tag: { deleted_at: null } },
        include: {
            tag: {
                include: {
                    cluster: true
                }
            }
        }
    },
    participants: {
        where: { lecturer: { deleted_at: null } },
        include: {
            lecturer: true
        }
    }
};

/**
 * Build Prisma where clause from project filters
 */
const buildWhereClause = (filters?: ProjectFilters): Prisma.ProjectWhereInput => {
    const conditions: Prisma.ProjectWhereInput[] = [
        { deleted_at: null }
    ];

    if (!filters) return { AND: conditions };

    if (filters.status) {
        conditions.push({ status: filters.status as Status });
    }

    if (filters.visibility) {
        conditions.push({ visibility: filters.visibility as Visibility });
    }

    if (filters.start_year !== undefined) {
        conditions.push({ start_year: filters.start_year });
    } else if (filters.min_year !== undefined || filters.max_year !== undefined) {
        const yearCondition: Prisma.IntFilter = {};
        if (filters.min_year !== undefined) yearCondition.gte = filters.min_year;
        if (filters.max_year !== undefined) yearCondition.lte = filters.max_year;
        conditions.push({ start_year: yearCondition });
    }

    if (filters.end_year !== undefined) {
        conditions.push({ end_year: filters.end_year });
    }

    if (filters.lead_lecturer_id) {
        conditions.push({ lead_lecturer_id: filters.lead_lecturer_id });
    } else if (filters.lead_lecturer_slug) {
        conditions.push({
            lead_lecturer: {
                slug: filters.lead_lecturer_slug,
                deleted_at: null
            }
        });
    }

    if (filters.participant_id) {
        conditions.push({
            participants: {
                some: {
                    lecturer_id: filters.participant_id,
                    lecturer: { deleted_at: null }
                }
            }
        });
    } else if (filters.participant_slug) {
        conditions.push({
            participants: {
                some: {
                    lecturer: {
                        slug: filters.participant_slug,
                        deleted_at: null
                    }
                }
            }
        });
    }

    if (filters.tag_id) {
        conditions.push({
            research_tags: {
                some: {
                    tag_id: filters.tag_id,
                    tag: { deleted_at: null }
                }
            }
        });
    } else if (filters.tag_slug) {
        conditions.push({
            research_tags: {
                some: {
                    tag: {
                        slug: filters.tag_slug,
                        deleted_at: null
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
                        cluster_id: filters.cluster_id,
                        deleted_at: null
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
                            slug: filters.cluster_slug,
                            deleted_at: null
                        },
                        deleted_at: null
                    }
                }
            }
        });
    }

    if (filters.search) {
        conditions.push({
            OR: [
                { title: { contains: filters.search, mode: "insensitive" } },
                { description: { contains: filters.search, mode: "insensitive" } },
                { slug: { contains: filters.search, mode: "insensitive" } },
                { partner_names: { contains: filters.search, mode: "insensitive" } },
                { funding_source: { contains: filters.search, mode: "insensitive" } }
            ]
        });
    }

    return { AND: conditions };
};

/**
 * Get all projects matching filters (returns array)
 */
export const getProjects = async (filters?: ProjectFilters): Promise<Project[]> => {
    const where = buildWhereClause(filters);

    const take = filters?.limit ? Number(filters.limit) : undefined;
    const skip = filters?.page && filters?.limit ? (Number(filters.page) - 1) * Number(filters.limit) : undefined;

    const sortBy = filters?.sort_by || "created_at";
    const sortOrder = filters?.sort_order === "asc" ? "asc" : "desc";

    const projects = await prisma.project.findMany({
        where,
        take,
        skip,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: includeClause
    });

    return projects as unknown as Project[];
};

/**
 * Get paginated list of projects
 */
export const getPaginatedProjects = async (filters?: ProjectFilters): Promise<PaginatedResult<Project>> => {
    const where = buildWhereClause(filters);
    const page = filters?.page ? Number(filters.page) : 1;
    const limit = filters?.limit ? Number(filters.limit) : 10;
    const skip = (page - 1) * limit;

    const sortBy = filters?.sort_by || "created_at";
    const sortOrder = filters?.sort_order === "asc" ? "asc" : "desc";

    const [data, total] = await Promise.all([
        prisma.project.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder
            },
            include: includeClause
        }),
        prisma.project.count({ where })
    ]);

    const total_pages = Math.ceil(total / limit);

    return {
        data: data as unknown as Project[],
        total,
        page,
        limit,
        total_pages
    };
};

/**
 * Get soft-deleted projects for the protected admin trash view.
 */
export const getDeletedProjects = async (): Promise<Project[]> => {
    const projects = await prisma.project.findMany({
        where: { deleted_at: { not: null } },
        orderBy: { deleted_at: "desc" },
        include: includeClause
    });

    return projects as unknown as Project[];
};

/**
 * Get a single project by ID
 */
export const getProjectById = async (id: string): Promise<Project | null> => {
    const project = await prisma.project.findFirst({
        where: { id, deleted_at: null },
        include: includeClause
    });

    return (project as unknown as Project) || null;
};

/**
 * Get a single project by slug
 */
export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
    const project = await prisma.project.findFirst({
        where: { slug, deleted_at: null },
        include: includeClause
    });

    return (project as unknown as Project) || null;
};

/**
 * Create a new project along with optional participants and research tags
 */
export const createProject = async (data: CreateProjectDTO): Promise<Project> => {
    const { participants, tag_ids, ...projectData } = data;

    const project = await prisma.$transaction(async (tx) => {
        const created = await tx.project.create({
            data: {
                title: projectData.title,
                slug: projectData.slug,
                description: projectData.description,
                status: projectData.status ? (projectData.status as Status) : "PLANNED",
                start_year: projectData.start_year !== undefined ? projectData.start_year : null,
                end_year: projectData.end_year !== undefined ? projectData.end_year : null,
                partner_names: projectData.partner_names,
                funding_source: projectData.funding_source,
                visibility: projectData.visibility ? (projectData.visibility as Visibility) : "PUBLIC",
                lead_lecturer_id: projectData.lead_lecturer_id || null
            }
        });

        if (participants && participants.length > 0) {
            await Promise.all(
                participants.map((item) =>
                    tx.lecturerProject.create({
                        data: {
                            project_id: created.id,
                            lecturer_id: item.lecturer_id,
                            role: item.role || null
                        }
                    })
                )
            );
        }

        if (tag_ids && tag_ids.length > 0) {
            await Promise.all(
                tag_ids.map((tagId) =>
                    tx.projectResearchTag.create({
                        data: {
                            project_id: created.id,
                            tag_id: tagId
                        }
                    })
                )
            );
        }

        return tx.project.findUnique({
            where: { id: created.id },
            include: includeClause
        });
    });

    return project as unknown as Project;
};

/**
 * Update an existing project
 */
export const updateProject = async (id: string, data: UpdateProjectDTO): Promise<Project> => {
    const existing = await prisma.project.findFirst({
        where: { id, deleted_at: null }
    });
    if (!existing) {
        throw new Error(`Project with id ${id} not found or deleted.`);
    }

    const { participants, tag_ids, ...projectData } = data;

    const project = await prisma.$transaction(async (tx) => {
        const updateData: Prisma.ProjectUpdateInput = {};

        if (projectData.title !== undefined) updateData.title = projectData.title;
        if (projectData.slug !== undefined) updateData.slug = projectData.slug;
        if (projectData.description !== undefined) updateData.description = projectData.description;
        if (projectData.status !== undefined) updateData.status = projectData.status as Status;
        if (projectData.start_year !== undefined) updateData.start_year = projectData.start_year;
        if (projectData.end_year !== undefined) updateData.end_year = projectData.end_year;
        if (projectData.partner_names !== undefined) updateData.partner_names = projectData.partner_names;
        if (projectData.funding_source !== undefined) updateData.funding_source = projectData.funding_source;
        if (projectData.visibility !== undefined) updateData.visibility = projectData.visibility as Visibility;
        if (projectData.lead_lecturer_id !== undefined) {
            if (projectData.lead_lecturer_id === null) {
                updateData.lead_lecturer = { disconnect: true };
            } else {
                updateData.lead_lecturer = { connect: { id: projectData.lead_lecturer_id } };
            }
        }

        await tx.project.update({
            where: { id },
            data: updateData
        });

        if (participants !== undefined) {
            await tx.lecturerProject.deleteMany({
                where: { project_id: id }
            });

            if (participants.length > 0) {
                await Promise.all(
                    participants.map((item) =>
                        tx.lecturerProject.create({
                            data: {
                                project_id: id,
                                lecturer_id: item.lecturer_id,
                                role: item.role || null
                            }
                        })
                    )
                );
            }
        }

        if (tag_ids !== undefined) {
            await tx.projectResearchTag.deleteMany({
                where: { project_id: id }
            });

            if (tag_ids.length > 0) {
                await Promise.all(
                    tag_ids.map((tagId) =>
                        tx.projectResearchTag.create({
                            data: {
                                project_id: id,
                                tag_id: tagId
                            }
                        })
                    )
                );
            }
        }

        return tx.project.findUnique({
            where: { id },
            include: includeClause
        });
    });

    return project as unknown as Project;
};

/**
 * Delete a project by ID (soft delete)
 */
export const deleteProject = async (id: string): Promise<boolean> => {
    try {
        await prisma.project.update({
            where: { id },
            data: { deleted_at: new Date() }
        });
        return true;
    } catch (error) {
        console.error(`Error deleting project ${id}:`, error);
        return false;
    }
};

/**
 * Restore a soft-deleted project by ID
 */
export const restoreProject = async (id: string): Promise<boolean> => {
    try {
        await prisma.project.update({
            where: { id },
            data: { deleted_at: null }
        });
        return true;
    } catch (error) {
        console.error(`Error restoring project ${id}:`, error);
        return false;
    }
};

/**
 * Assign participants (lecturers) to a project
 */
export const assignParticipantsToProject = async (
    projectId: string,
    participants: Array<{ lecturer_id: string; role?: string | null }>
): Promise<boolean> => {
    try {
        const existing = await prisma.project.findFirst({
            where: { id: projectId, deleted_at: null }
        });
        if (!existing) return false;

        await prisma.$transaction(async (tx) => {
            await tx.lecturerProject.deleteMany({
                where: { project_id: projectId }
            });

            if (participants.length > 0) {
                await Promise.all(
                    participants.map((item) =>
                        tx.lecturerProject.create({
                            data: {
                                project_id: projectId,
                                lecturer_id: item.lecturer_id,
                                role: item.role || null
                            }
                        })
                    )
                );
            }
        });
        return true;
    } catch (error) {
        console.error(`Error assigning participants to project ${projectId}:`, error);
        return false;
    }
};

/**
 * Assign research tags to a project
 */
export const assignResearchTagsToProject = async (
    projectId: string,
    tagIds: string[]
): Promise<boolean> => {
    try {
        const existing = await prisma.project.findFirst({
            where: { id: projectId, deleted_at: null }
        });
        if (!existing) return false;

        await prisma.$transaction(async (tx) => {
            await tx.projectResearchTag.deleteMany({
                where: { project_id: projectId }
            });

            if (tagIds.length > 0) {
                await Promise.all(
                    tagIds.map((tagId) =>
                        tx.projectResearchTag.create({
                            data: {
                                project_id: projectId,
                                tag_id: tagId
                            }
                        })
                    )
                );
            }
        });
        return true;
    } catch (error) {
        console.error(`Error assigning research tags to project ${projectId}:`, error);
        return false;
    }
};

/**
 * Batch import or upsert projects from CSV or JSON items
 */
export const importProjectsCSV = async (
    items?: any[] | any
): Promise<{ imported: number; updated: number; errors: number } | boolean> => {
    if (!items || !Array.isArray(items)) {
        return true; // Backward compatibility with mock true return when no array passed
    }

    let imported = 0;
    let updated = 0;
    let errors = 0;

    for (const item of items) {
        try {
            if (!item.title) {
                errors++;
                continue;
            }

            const slug = item.slug || item.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

            let existing = await prisma.project.findFirst({
                where: {
                    OR: [
                        { slug },
                        { title: { equals: item.title, mode: "insensitive" } }
                    ]
                }
            });

            if (existing) {
                await prisma.project.update({
                    where: { id: existing.id },
                    data: {
                        title: item.title || existing.title,
                        slug: slug || existing.slug,
                        description: item.description !== undefined ? item.description : existing.description,
                        status: item.status ? (item.status as Status) : existing.status,
                        start_year: item.start_year !== undefined ? Number(item.start_year) : existing.start_year,
                        end_year: item.end_year !== undefined ? Number(item.end_year) : existing.end_year,
                        partner_names: item.partner_names !== undefined ? item.partner_names : existing.partner_names,
                        funding_source: item.funding_source !== undefined ? item.funding_source : existing.funding_source,
                        visibility: item.visibility ? (item.visibility as Visibility) : existing.visibility,
                        lead_lecturer_id: item.lead_lecturer_id !== undefined ? item.lead_lecturer_id : existing.lead_lecturer_id,
                        deleted_at: null
                    }
                });

                if (item.participants && Array.isArray(item.participants)) {
                    await prisma.lecturerProject.deleteMany({
                        where: { project_id: existing.id }
                    });
                    if (item.participants.length > 0) {
                        await Promise.all(
                            item.participants.map((p: any) => {
                                const lecturerId = typeof p === "string" ? p : p.lecturer_id;
                                const role = typeof p === "string" ? null : p.role;
                                return prisma.lecturerProject.create({
                                    data: {
                                        project_id: existing.id,
                                        lecturer_id: lecturerId,
                                        role: role || null
                                    }
                                });
                            })
                        );
                    }
                }

                const tagIds = item.tag_ids || item.research_tags;
                if (tagIds && Array.isArray(tagIds)) {
                    await prisma.projectResearchTag.deleteMany({
                        where: { project_id: existing.id }
                    });
                    if (tagIds.length > 0) {
                        await Promise.all(
                            tagIds.map((tagId: string) =>
                                prisma.projectResearchTag.create({
                                    data: {
                                        project_id: existing.id,
                                        tag_id: typeof tagId === "string" ? tagId : (tagId as any).id || (tagId as any).tag_id
                                    }
                                })
                            )
                        );
                    }
                }

                updated++;
            } else {
                const created = await prisma.project.create({
                    data: {
                        title: item.title,
                        slug,
                        description: item.description || null,
                        status: item.status ? (item.status as Status) : "PLANNED",
                        start_year: item.start_year ? Number(item.start_year) : null,
                        end_year: item.end_year ? Number(item.end_year) : null,
                        partner_names: item.partner_names || null,
                        funding_source: item.funding_source || null,
                        visibility: item.visibility ? (item.visibility as Visibility) : "PUBLIC",
                        lead_lecturer_id: item.lead_lecturer_id || null
                    }
                });

                if (item.participants && Array.isArray(item.participants) && item.participants.length > 0) {
                    await Promise.all(
                        item.participants.map((p: any) => {
                            const lecturerId = typeof p === "string" ? p : p.lecturer_id;
                            const role = typeof p === "string" ? null : p.role;
                            return prisma.lecturerProject.create({
                                data: {
                                    project_id: created.id,
                                    lecturer_id: lecturerId,
                                    role: role || null
                                }
                            });
                        })
                    );
                }

                const tagIds = item.tag_ids || item.research_tags;
                if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
                    await Promise.all(
                        tagIds.map((tagId: string) =>
                            prisma.projectResearchTag.create({
                                data: {
                                    project_id: created.id,
                                    tag_id: typeof tagId === "string" ? tagId : (tagId as any).id || (tagId as any).tag_id
                                }
                            })
                        )
                    );
                }

                imported++;
            }
        } catch (err) {
            console.error("Error importing project item:", err);
            errors++;
        }
    }

    return { imported, updated, errors };
};
