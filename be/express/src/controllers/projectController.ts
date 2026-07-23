import { Request, Response, NextFunction } from "express";
import { CreateProjectDTO, UpdateProjectDTO, ProjectFilters } from "../types/index.js";
import { projectService } from "../services/index.js";

/*
    Name           : Get all projects controller
    Description    : Fetches all project data from database based on optional filters
    Request params : none
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {
            search,
            status,
            visibility,
            start_year,
            end_year,
            min_year,
            max_year,
            lead_lecturer_id,
            lead_lecturer_slug,
            participant_id,
            participant_slug,
            tag_id,
            tag_slug,
            cluster_id,
            cluster_slug,
            sort_by,
            sort_order,
            page,
            limit
        } = req.query;

        const filters: ProjectFilters = {
            search: typeof search === "string" ? search : undefined,
            status: typeof status === "string" ? status : undefined,
            visibility: typeof visibility === "string" ? visibility : undefined,
            start_year: typeof start_year === "string" ? Number(start_year) : (typeof start_year === "number" ? start_year : undefined),
            end_year: typeof end_year === "string" ? Number(end_year) : (typeof end_year === "number" ? end_year : undefined),
            min_year: typeof min_year === "string" ? Number(min_year) : (typeof min_year === "number" ? min_year : undefined),
            max_year: typeof max_year === "string" ? Number(max_year) : (typeof max_year === "number" ? max_year : undefined),
            lead_lecturer_id: typeof lead_lecturer_id === "string" ? lead_lecturer_id : undefined,
            lead_lecturer_slug: typeof lead_lecturer_slug === "string" ? lead_lecturer_slug : undefined,
            participant_id: typeof participant_id === "string" ? participant_id : undefined,
            participant_slug: typeof participant_slug === "string" ? participant_slug : undefined,
            tag_id: typeof tag_id === "string" ? tag_id : undefined,
            tag_slug: typeof tag_slug === "string" ? tag_slug : undefined,
            cluster_id: typeof cluster_id === "string" ? cluster_id : undefined,
            cluster_slug: typeof cluster_slug === "string" ? cluster_slug : undefined,
            sort_by: typeof sort_by === "string" ? sort_by : undefined,
            sort_order: sort_order === "desc" || sort_order === "asc" ? sort_order : undefined,
            page: typeof page === "string" ? Number(page) : (typeof page === "number" ? page : undefined),
            limit: typeof limit === "string" ? Number(limit) : (typeof limit === "number" ? limit : undefined)
        };

        const projects = await projectService.getProjects(filters);
        res.status(200).json({
            success: true,
            data: projects
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get paginated projects controller
    Description    : Fetches paginated list of project data along with pagination metadata
    Request params : none
    Action         : fetch paginated data from database
    Response       : success or error message 
*/
export async function getPaginatedProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {
            search,
            status,
            visibility,
            start_year,
            end_year,
            min_year,
            max_year,
            lead_lecturer_id,
            lead_lecturer_slug,
            participant_id,
            participant_slug,
            tag_id,
            tag_slug,
            cluster_id,
            cluster_slug,
            sort_by,
            sort_order,
            page,
            limit
        } = req.query;

        const filters: ProjectFilters = {
            search: typeof search === "string" ? search : undefined,
            status: typeof status === "string" ? status : undefined,
            visibility: typeof visibility === "string" ? visibility : undefined,
            start_year: typeof start_year === "string" ? Number(start_year) : (typeof start_year === "number" ? start_year : undefined),
            end_year: typeof end_year === "string" ? Number(end_year) : (typeof end_year === "number" ? end_year : undefined),
            min_year: typeof min_year === "string" ? Number(min_year) : (typeof min_year === "number" ? min_year : undefined),
            max_year: typeof max_year === "string" ? Number(max_year) : (typeof max_year === "number" ? max_year : undefined),
            lead_lecturer_id: typeof lead_lecturer_id === "string" ? lead_lecturer_id : undefined,
            lead_lecturer_slug: typeof lead_lecturer_slug === "string" ? lead_lecturer_slug : undefined,
            participant_id: typeof participant_id === "string" ? participant_id : undefined,
            participant_slug: typeof participant_slug === "string" ? participant_slug : undefined,
            tag_id: typeof tag_id === "string" ? tag_id : undefined,
            tag_slug: typeof tag_slug === "string" ? tag_slug : undefined,
            cluster_id: typeof cluster_id === "string" ? cluster_id : undefined,
            cluster_slug: typeof cluster_slug === "string" ? cluster_slug : undefined,
            sort_by: typeof sort_by === "string" ? sort_by : undefined,
            sort_order: sort_order === "desc" || sort_order === "asc" ? sort_order : undefined,
            page: typeof page === "string" ? Number(page) : (typeof page === "number" ? page : undefined),
            limit: typeof limit === "string" ? Number(limit) : (typeof limit === "number" ? limit : undefined)
        };

        const result = await projectService.getPaginatedProjects(filters);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}

export async function getDeletedProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const projects = await projectService.getDeletedProjects();
        res.status(200).json({
            success: true,
            data: projects
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get single project by ID controller
    Description    : Fetches single project data from database based on ID parameter
    Request params : project ID
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid project ID parameter"
            });
            return;
        }

        const project = await projectService.getProjectById(id);
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get single project by slug controller
    Description    : Fetches single detailed project data from database based on slug parameter
    Request params : project slug
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getProjectBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const slug = typeof req.params.slug === "string" ? req.params.slug : (Array.isArray(req.params.slug) ? req.params.slug[0] : undefined);
        if (!slug) {
            res.status(400).json({
                success: false,
                message: "Invalid slug parameter"
            });
            return;
        }

        const project = await projectService.getProjectBySlug(slug);
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Create new project controller
    Description    : Creates new project data along with optional participants and research tags
    Request params : title, slug, and optional details
    Action         : create project data
    Response       : success or error message 
*/
export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { title, slug } = req.body as CreateProjectDTO;

        if (!title || !slug) {
            res.status(400).json({
                success: false,
                message: "Title and slug are required"
            });
            return;
        }

        const existingSlug = await projectService.getProjectBySlug(slug);
        if (existingSlug) {
            res.status(409).json({
                success: false,
                message: "A project with this slug already exists"
            });
            return;
        }

        const newProject = await projectService.createProject(req.body as CreateProjectDTO);
        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: newProject
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Update an existing project controller
    Description    : Updates existing project data along with optional participants and research tags
    Request params : project ID
    Action         : update project data
    Response       : success or error message 
*/
export async function updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid project ID parameter"
            });
            return;
        }

        const existing = await projectService.getProjectById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Project not found"
            });
            return;
        }

        const updateData = req.body as UpdateProjectDTO;
        if (updateData.slug && updateData.slug !== existing.slug) {
            const existingSlug = await projectService.getProjectBySlug(updateData.slug);
            if (existingSlug && existingSlug.id !== id) {
                res.status(409).json({
                    success: false,
                    message: "A project with this slug already exists"
                });
                return;
            }
        }

        const updated = await projectService.updateProject(id, updateData);

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: updated
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Soft delete a project controller
    Description    : Soft deletes project data
    Request params : project ID
    Action         : delete project data
    Response       : success or error message 
*/
export async function deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid project ID parameter"
            });
            return;
        }

        const existing = await projectService.getProjectById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Project not found"
            });
            return;
        }

        const success = await projectService.deleteProject(id);
        if (!success) {
            res.status(500).json({
                success: false,
                message: "Failed to delete project"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Restore a soft-deleted project controller
    Description    : Restores soft-deleted project data
    Request params : project ID
    Action         : restore project data
    Response       : success or error message 
*/
export async function restoreProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid project ID parameter"
            });
            return;
        }

        const success = await projectService.restoreProject(id);
        if (!success) {
            res.status(404).json({
                success: false,
                message: "Project not found or failed to restore"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Project restored successfully"
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Assign participants to project controller
    Description    : Assigns or replaces participants for a specific project
    Request params : project ID and participants array
    Action         : update project participants relation
    Response       : success or error message 
*/
export async function assignParticipantsToProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        const { participants } = req.body;

        if (!id || !Array.isArray(participants)) {
            res.status(400).json({
                success: false,
                message: "Project ID and participants array are required"
            });
            return;
        }

        const existing = await projectService.getProjectById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Project not found"
            });
            return;
        }

        const success = await projectService.assignParticipantsToProject(id, participants);
        if (!success) {
            res.status(500).json({
                success: false,
                message: "Failed to assign participants to project"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Participants assigned successfully"
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Assign research tags to project controller
    Description    : Assigns or replaces research tags for a specific project
    Request params : project ID and tags array
    Action         : update project research tags relation
    Response       : success or error message 
*/
export async function assignResearchTagsToProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        const tags = req.body.tags || req.body.tag_ids;

        if (!id || !Array.isArray(tags)) {
            res.status(400).json({
                success: false,
                message: "Project ID and tags array are required"
            });
            return;
        }

        const existing = await projectService.getProjectById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Project not found"
            });
            return;
        }

        const success = await projectService.assignResearchTagsToProject(id, tags);
        if (!success) {
            res.status(500).json({
                success: false,
                message: "Failed to assign research tags to project"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Research tags assigned successfully"
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Import projects CSV/JSON items controller
    Description    : Batch imports or upserts projects from CSV or JSON items
    Request params : items array
    Action         : batch import or upsert project data
    Response       : success or error message with import summary
*/
export async function importProjectsCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const items = req.body.items || req.body;

        if (!items || !Array.isArray(items)) {
            res.status(400).json({
                success: false,
                message: "Items array is required for batch import"
            });
            return;
        }

        const result = await projectService.importProjectsCSV(items);

        res.status(200).json({
            success: true,
            message: "Projects import process completed",
            data: result
        });
    } catch (error) {
        next(error);
    }
}
