import { Request, Response, NextFunction } from "express";
import { CreatePublicationDTO, UpdatePublicationDTO, PublicationFilters } from "../types/index.js";
import { publicationService } from "../services/index.js";

/*
    Name           : Get all publications controller
    Description    : Fetches all publication data from database based on optional filters
    Request params : none
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getPublications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {
            search,
            year,
            min_year,
            max_year,
            venue,
            publication_type,
            source,
            verified_status,
            lecturer_id,
            lecturer_slug,
            tag_id,
            tag_slug,
            cluster_id,
            cluster_slug,
            sort_by,
            sort_order,
            page,
            limit
        } = req.query;

        const filters: PublicationFilters = {
            search: typeof search === "string" ? search : undefined,
            year: typeof year === "string" ? Number(year) : (typeof year === "number" ? year : undefined),
            min_year: typeof min_year === "string" ? Number(min_year) : (typeof min_year === "number" ? min_year : undefined),
            max_year: typeof max_year === "string" ? Number(max_year) : (typeof max_year === "number" ? max_year : undefined),
            venue: typeof venue === "string" ? venue : undefined,
            publication_type: typeof publication_type === "string" ? publication_type : undefined,
            source: typeof source === "string" ? source : undefined,
            verified_status: typeof verified_status === "string" ? verified_status : undefined,
            lecturer_id: typeof lecturer_id === "string" ? lecturer_id : undefined,
            lecturer_slug: typeof lecturer_slug === "string" ? lecturer_slug : undefined,
            tag_id: typeof tag_id === "string" ? tag_id : undefined,
            tag_slug: typeof tag_slug === "string" ? tag_slug : undefined,
            cluster_id: typeof cluster_id === "string" ? cluster_id : undefined,
            cluster_slug: typeof cluster_slug === "string" ? cluster_slug : undefined,
            sort_by: typeof sort_by === "string" ? sort_by : undefined,
            sort_order: sort_order === "desc" || sort_order === "asc" ? sort_order : undefined,
            page: typeof page === "string" ? Number(page) : (typeof page === "number" ? page : undefined),
            limit: typeof limit === "string" ? Number(limit) : (typeof limit === "number" ? limit : undefined)
        };

        const publications = await publicationService.getPublications(filters);
        res.status(200).json({
            success: true,
            data: publications
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get paginated publications controller
    Description    : Fetches paginated list of publication data along with pagination metadata
    Request params : none
    Action         : fetch paginated data from database
    Response       : success or error message 
*/
export async function getPaginatedPublications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {
            search,
            year,
            min_year,
            max_year,
            venue,
            publication_type,
            source,
            verified_status,
            lecturer_id,
            lecturer_slug,
            tag_id,
            tag_slug,
            cluster_id,
            cluster_slug,
            sort_by,
            sort_order,
            page,
            limit
        } = req.query;

        const filters: PublicationFilters = {
            search: typeof search === "string" ? search : undefined,
            year: typeof year === "string" ? Number(year) : (typeof year === "number" ? year : undefined),
            min_year: typeof min_year === "string" ? Number(min_year) : (typeof min_year === "number" ? min_year : undefined),
            max_year: typeof max_year === "string" ? Number(max_year) : (typeof max_year === "number" ? max_year : undefined),
            venue: typeof venue === "string" ? venue : undefined,
            publication_type: typeof publication_type === "string" ? publication_type : undefined,
            source: typeof source === "string" ? source : undefined,
            verified_status: typeof verified_status === "string" ? verified_status : undefined,
            lecturer_id: typeof lecturer_id === "string" ? lecturer_id : undefined,
            lecturer_slug: typeof lecturer_slug === "string" ? lecturer_slug : undefined,
            tag_id: typeof tag_id === "string" ? tag_id : undefined,
            tag_slug: typeof tag_slug === "string" ? tag_slug : undefined,
            cluster_id: typeof cluster_id === "string" ? cluster_id : undefined,
            cluster_slug: typeof cluster_slug === "string" ? cluster_slug : undefined,
            sort_by: typeof sort_by === "string" ? sort_by : undefined,
            sort_order: sort_order === "desc" || sort_order === "asc" ? sort_order : undefined,
            page: typeof page === "string" ? Number(page) : (typeof page === "number" ? page : undefined),
            limit: typeof limit === "string" ? Number(limit) : (typeof limit === "number" ? limit : undefined)
        };

        const result = await publicationService.getPaginatedPublications(filters);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get single publication by ID controller
    Description    : Fetches single publication data from database based on ID parameter
    Request params : publication ID
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getPublicationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid publication ID parameter"
            });
            return;
        }

        const publication = await publicationService.getPublicationById(id);
        if (!publication) {
            res.status(404).json({
                success: false,
                message: "Publication not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: publication
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get single publication by slug controller
    Description    : Fetches single detailed publication data from database based on slug parameter
    Request params : publication slug
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getPublicationBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const slug = typeof req.params.slug === "string" ? req.params.slug : (Array.isArray(req.params.slug) ? req.params.slug[0] : undefined);
        if (!slug) {
            res.status(400).json({
                success: false,
                message: "Invalid slug parameter"
            });
            return;
        }

        const publication = await publicationService.getPublicationBySlug(slug);
        if (!publication) {
            res.status(404).json({
                success: false,
                message: "Publication not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: publication
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get single publication by DOI controller
    Description    : Fetches single publication data from database based on DOI parameter
    Request params : publication DOI
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getPublicationByDoi(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const doi = typeof req.params.doi === "string" ? req.params.doi : (Array.isArray(req.params.doi) ? req.params.doi[0] : undefined);
        if (!doi) {
            res.status(400).json({
                success: false,
                message: "Invalid DOI parameter"
            });
            return;
        }

        const publication = await publicationService.getPublicationByDoi(doi);
        if (!publication) {
            res.status(404).json({
                success: false,
                message: "Publication not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: publication
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Create new publication controller
    Description    : Creates new publication data along with optional author relations
    Request params : title, slug, year, and optional details
    Action         : create publication data
    Response       : success or error message 
*/
export async function createPublication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { title, slug, year } = req.body as CreatePublicationDTO;

        if (!title || !slug || year === undefined || year === null) {
            res.status(400).json({
                success: false,
                message: "Title, slug, and year are required"
            });
            return;
        }

        const existingSlug = await publicationService.getPublicationBySlug(slug);
        if (existingSlug) {
            res.status(409).json({
                success: false,
                message: "A publication with this slug already exists"
            });
            return;
        }

        if (req.body.doi) {
            const existingDoi = await publicationService.getPublicationByDoi(req.body.doi);
            if (existingDoi) {
                res.status(409).json({
                    success: false,
                    message: "A publication with this DOI already exists"
                });
                return;
            }
        }

        const newPublication = await publicationService.createPublication(req.body as CreatePublicationDTO);
        res.status(201).json({
            success: true,
            message: "Publication created successfully",
            data: newPublication
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Update an existing publication controller
    Description    : Updates existing publication data along with optional author relations
    Request params : publication ID
    Action         : update publication data
    Response       : success or error message 
*/
export async function updatePublication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid publication ID parameter"
            });
            return;
        }

        const existing = await publicationService.getPublicationById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Publication not found"
            });
            return;
        }

        const updateData = req.body as UpdatePublicationDTO;
        if (updateData.slug && updateData.slug !== existing.slug) {
            const existingSlug = await publicationService.getPublicationBySlug(updateData.slug);
            if (existingSlug && existingSlug.id !== id) {
                res.status(409).json({
                    success: false,
                    message: "A publication with this slug already exists"
                });
                return;
            }
        }

        if (updateData.doi && updateData.doi !== existing.doi) {
            const existingDoi = await publicationService.getPublicationByDoi(updateData.doi);
            if (existingDoi && existingDoi.id !== id) {
                res.status(409).json({
                    success: false,
                    message: "A publication with this DOI already exists"
                });
                return;
            }
        }

        const updated = await publicationService.updatePublication(id, updateData);

        res.status(200).json({
            success: true,
            message: "Publication updated successfully",
            data: updated
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Soft delete a publication controller
    Description    : Soft deletes publication data
    Request params : publication ID
    Action         : delete publication data
    Response       : success or error message 
*/
export async function deletePublication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid publication ID parameter"
            });
            return;
        }

        const existing = await publicationService.getPublicationById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Publication not found"
            });
            return;
        }

        const success = await publicationService.deletePublication(id);
        if (!success) {
            res.status(500).json({
                success: false,
                message: "Failed to delete publication"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Publication deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Restore a soft-deleted publication controller
    Description    : Restores soft-deleted publication data
    Request params : publication ID
    Action         : restore publication data
    Response       : success or error message 
*/
export async function restorePublication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid publication ID parameter"
            });
            return;
        }

        const existing = await publicationService.getPublicationById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Publication not found"
            });
            return;
        }

        const success = await publicationService.restorePublication(id);
        if (!success) {
            res.status(500).json({
                success: false,
                message: "Failed to restore publication"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Publication restored successfully"
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Assign lecturers to publication controller
    Description    : Assigns or replaces authoring lecturers for a specific publication
    Request params : publication ID and lecturers array
    Action         : update publication lecturers relation
    Response       : success or error message 
*/
export async function assignLecturersToPublication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        const { lecturers } = req.body;

        if (!id || !Array.isArray(lecturers)) {
            res.status(400).json({
                success: false,
                message: "Publication ID and lecturers array are required"
            });
            return;
        }

        const existing = await publicationService.getPublicationById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Publication not found"
            });
            return;
        }

        const success = await publicationService.assignLecturersToPublication(id, lecturers);
        if (!success) {
            res.status(500).json({
                success: false,
                message: "Failed to assign lecturers to publication"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Lecturers assigned to publication successfully"
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Import publications CSV/JSON items controller
    Description    : Batch imports or upserts publications from CSV or JSON items
    Request params : items array
    Action         : batch import or upsert publication data
    Response       : success or error message with import summary
*/
export async function importPublicationsCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const items = req.body.items || req.body;

        if (!items || !Array.isArray(items)) {
            res.status(400).json({
                success: false,
                message: "Items array is required for batch import"
            });
            return;
        }

        const result = await publicationService.importPublicationsCSV(items);

        res.status(200).json({
            success: true,
            message: "Publications import process completed",
            data: result
        });
    } catch (error) {
        next(error);
    }
}
