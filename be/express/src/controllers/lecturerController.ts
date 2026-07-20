import { Request, Response, NextFunction } from "express";
import { CreateLecturerDTO, UpdateLecturerDTO, LecturerFilters } from "../types/index.js";
import { lecturerService } from "../services/index.js";
import fs from "fs";

/*
    Name           : Get all lecturers controller
    Description    : Fetches all lecturer data from database based on optional filters
    Request params : none
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getLecturers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {
            search,
            tag_id,
            tag_slug,
            cluster_id,
            cluster_slug,
            supervision_status,
            is_active,
            sinta_id,
            sort_by,
            sort_order,
            page,
            limit
        } = req.query;

        const filters: LecturerFilters = {
            search: typeof search === "string" ? search : undefined,
            tag_id: typeof tag_id === "string" ? tag_id : undefined,
            tag_slug: typeof tag_slug === "string" ? tag_slug : undefined,
            cluster_id: typeof cluster_id === "string" ? cluster_id : undefined,
            cluster_slug: typeof cluster_slug === "string" ? cluster_slug : undefined,
            supervision_status: typeof supervision_status === "string" ? supervision_status : undefined,
            is_active: is_active !== undefined ? is_active === "true" : undefined,
            sinta_id: typeof sinta_id === "string" ? sinta_id : undefined,
            sort_by: typeof sort_by === "string" ? sort_by : undefined,
            sort_order: sort_order === "desc" || sort_order === "asc" ? sort_order : undefined,
            page: typeof page === "string" ? Number(page) : (typeof page === "number" ? page : undefined),
            limit: typeof limit === "string" ? Number(limit) : (typeof limit === "number" ? limit : undefined)
        };

        const lecturers = await lecturerService.getLecturers(filters);
        res.status(200).json({
            success: true,
            data: lecturers
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get paginated lecturers controller
    Description    : Fetches paginated list of lecturer data along with pagination metadata
    Request params : none
    Action         : fetch paginated data from database
    Response       : success or error message 
*/
export async function getPaginatedLecturers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {
            search,
            tag_id,
            tag_slug,
            cluster_id,
            cluster_slug,
            supervision_status,
            is_active,
            sinta_id,
            sort_by,
            sort_order,
            page,
            limit
        } = req.query;

        const filters: LecturerFilters = {
            search: typeof search === "string" ? search : undefined,
            tag_id: typeof tag_id === "string" ? tag_id : undefined,
            tag_slug: typeof tag_slug === "string" ? tag_slug : undefined,
            cluster_id: typeof cluster_id === "string" ? cluster_id : undefined,
            cluster_slug: typeof cluster_slug === "string" ? cluster_slug : undefined,
            supervision_status: typeof supervision_status === "string" ? supervision_status : undefined,
            is_active: is_active !== undefined ? is_active === "true" : undefined,
            sinta_id: typeof sinta_id === "string" ? sinta_id : undefined,
            sort_by: typeof sort_by === "string" ? sort_by : undefined,
            sort_order: sort_order === "desc" || sort_order === "asc" ? sort_order : undefined,
            page: typeof page === "string" ? Number(page) : (typeof page === "number" ? page : undefined),
            limit: typeof limit === "string" ? Number(limit) : (typeof limit === "number" ? limit : undefined)
        };

        const result = await lecturerService.getPaginatedLecturers(filters);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get single lecturer by ID controller
    Description    : Fetches single lecturer data from database based on ID parameter
    Request params : lecturer ID
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getLecturerById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid lecturer ID parameter"
            });
            return;
        }

        const lecturer = await lecturerService.getLecturerById(id);
        if (!lecturer) {
            res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: lecturer
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get single lecturer by slug controller
    Description    : Fetches single detailed lecturer data from database based on slug parameter
    Request params : lecturer slug
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getLecturerBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const slug = typeof req.params.slug === "string" ? req.params.slug : (Array.isArray(req.params.slug) ? req.params.slug[0] : undefined);
        if (!slug) {
            res.status(400).json({
                success: false,
                message: "Invalid slug parameter"
            });
            return;
        }

        const lecturer = await lecturerService.getLecturerBySlug(slug);
        if (!lecturer) {
            res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: lecturer
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get single lecturer by SINTA ID controller
    Description    : Fetches single lecturer data from database based on SINTA ID parameter
    Request params : SINTA ID
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getLecturerBySintaId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const sintaId = typeof req.params.sintaId === "string" ? req.params.sintaId : (Array.isArray(req.params.sintaId) ? req.params.sintaId[0] : undefined);
        if (!sintaId) {
            res.status(400).json({
                success: false,
                message: "Invalid SINTA ID parameter"
            });
            return;
        }

        const lecturer = await lecturerService.getLecturerBySintaId(sintaId);
        if (!lecturer) {
            res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: lecturer
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Create new lecturer controller
    Description    : Creates new lecturer data along with optional metrics and research tags
    Request params : full_name, slug, nip_or_staff_id, sinta_id, and optional details
    Action         : create lecturer data
    Response       : success or error message 
*/
export async function createLecturer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { full_name, slug, nip_or_staff_id, sinta_id } = req.body as CreateLecturerDTO;

        if (!full_name || !slug || !nip_or_staff_id || !sinta_id) {
            res.status(400).json({
                success: false,
                message: "Full name, slug, NIP/Staff ID, and SINTA ID are required"
            });
            return;
        }

        const existingSlug = await lecturerService.getLecturerBySlug(slug);
        if (existingSlug) {
            res.status(409).json({
                success: false,
                message: "A lecturer with this slug already exists"
            });
            return;
        }

        const existingSinta = await lecturerService.getLecturerBySintaId(sinta_id);
        if (existingSinta) {
            res.status(409).json({
                success: false,
                message: "A lecturer with this SINTA ID already exists"
            });
            return;
        }

        const newLecturer = await lecturerService.createLecturer(req.body as CreateLecturerDTO);
        res.status(201).json({
            success: true,
            message: "Lecturer created successfully",
            data: newLecturer
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Update an existing lecturer controller
    Description    : Updates existing lecturer data along with optional metrics and research tags
    Request params : lecturer ID
    Action         : update lecturer data
    Response       : success or error message 
*/
export async function updateLecturer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid lecturer ID parameter"
            });
            return;
        }

        const existing = await lecturerService.getLecturerById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
            return;
        }

        const updateData = req.body as UpdateLecturerDTO;
        const updated = await lecturerService.updateLecturer(id, updateData);

        res.status(200).json({
            success: true,
            message: "Lecturer updated successfully",
            data: updated
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Soft delete a lecturer controller
    Description    : Soft deletes lecturer data
    Request params : lecturer ID
    Action         : delete lecturer data
    Response       : success or error message 
*/
export async function deleteLecturer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid lecturer ID parameter"
            });
            return;
        }

        const existing = await lecturerService.getLecturerById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
            return;
        }

        const success = await lecturerService.deleteLecturer(id);
        if (!success) {
            res.status(500).json({
                success: false,
                message: "Failed to delete lecturer"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Lecturer deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Restore a soft-deleted lecturer controller
    Description    : Restores soft-deleted lecturer data
    Request params : lecturer ID
    Action         : restore lecturer data
    Response       : success or error message 
*/
export async function restoreLecturer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid lecturer ID parameter"
            });
            return;
        }

        const existing = await lecturerService.getLecturerById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
            return;
        }

        const success = await lecturerService.restoreLecturer(id);
        if (!success) {
            res.status(500).json({
                success: false,
                message: "Failed to restore lecturer"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Lecturer restored successfully"
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Assign research tags controller
    Description    : Assigns or replaces research tags for a specific lecturer
    Request params : lecturer ID and tags array
    Action         : update research tags relation
    Response       : success or error message 
*/
export async function assignResearchTags(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        const { tags } = req.body;

        if (!id || !Array.isArray(tags)) {
            res.status(400).json({
                success: false,
                message: "Lecturer ID and tags array are required"
            });
            return;
        }

        const existing = await lecturerService.getLecturerById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
            return;
        }

        const success = await lecturerService.assignResearchTagsToLecturer(id, tags);
        if (!success) {
            res.status(500).json({
                success: false,
                message: "Failed to assign research tags to lecturer"
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
    Name           : Upsert lecturer metric controller
    Description    : Creates or updates metric data for a specific lecturer
    Request params : lecturer ID and metric data
    Action         : create or update metric data
    Response       : success or error message 
*/
export async function upsertMetric(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid lecturer ID parameter"
            });
            return;
        }

        const existing = await lecturerService.getLecturerById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
            return;
        }

        const metric = await lecturerService.upsertLecturerMetric(id, req.body);
        res.status(200).json({
            success: true,
            message: "Lecturer metrics updated successfully",
            data: metric
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Upload lecturer profile photo controller
    Description    : Uploads and sets profile picture for a specific lecturer
    Request params : lecturer ID, multipart/form-data with 'photo' file
    Action         : save image and update photo_url in database
    Response       : success or error message with updated lecturer data
*/
export async function uploadPhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(400).json({
                success: false,
                message: "Invalid lecturer ID parameter"
            });
            return;
        }

        if (!req.file) {
            res.status(400).json({
                success: false,
                message: "No photo file provided"
            });
            return;
        }

        const existing = await lecturerService.getLecturerById(id);
        if (!existing) {
            if (req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
            return;
        }

        const photoUrl = `/uploads/lecturers/${req.file.filename}`;
        const updated = await lecturerService.updateLecturerPhoto(id, photoUrl);

        res.status(200).json({
            success: true,
            message: "Profile picture uploaded successfully",
            data: updated
        });
    } catch (error) {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkErr) {
                console.error("Error removing file on upload error:", unlinkErr);
            }
        }
        next(error);
    }
}

/*
    Name           : Import lecturers CSV/JSON items controller
    Description    : Batch imports or upserts lecturers from CSV or JSON items
    Request params : items array
    Action         : batch import or upsert lecturer data
    Response       : success or error message with import summary
*/
export async function importLecturersCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const items = req.body.items || req.body;

        if (!items || !Array.isArray(items)) {
            res.status(400).json({
                success: false,
                message: "Items array is required for batch import"
            });
            return;
        }

        const result = await lecturerService.importLecturersCSV(items);

        res.status(200).json({
            success: true,
            message: "Lecturers import process completed",
            data: result
        });
    } catch (error) {
        next(error);
    }
}
