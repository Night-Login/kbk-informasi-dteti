import { Request, Response, NextFunction } from "express";
import {
    CreateResearchClusterDTO,
    UpdateResearchClusterDTO,
    CreateResearchTagDTO,
    UpdateResearchTagDTO,
    ResearchClusterFilters,
    ResearchTagFilters
} from "../types/index.js";
import { researchService } from "../services/index.js";

/*
    Name           : Get overall research summary and tree controller
    Description    : Fetches overall research summary, clusters, tags, and statistics from database
    Request params : none (optional query filters for search, cluster_id, cluster_slug)
    Action         : fetch research tree data
    Response       : success or error message 
*/
export async function getResearch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { search, cluster_id, cluster_slug } = req.query;
        const filters = {
            search: typeof search === "string" ? search : undefined,
            cluster_id: typeof cluster_id === "string" ? cluster_id : undefined,
            cluster_slug: typeof cluster_slug === "string" ? cluster_slug : undefined
        };

        const result = await researchService.getResearch(filters);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get all research clusters controller
    Description    : Fetches all research cluster data from database based on optional filters
    Request params : none
    Action         : fetch clusters data from database
    Response       : success or error message 
*/
export async function getResearchClusters(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { search, include_tags, include_lecturers, page, limit } = req.query;

        const filters: ResearchClusterFilters = {
            search: typeof search === "string" ? search : undefined,
            include_tags: include_tags !== undefined ? include_tags !== "false" : undefined,
            include_lecturers: include_lecturers !== undefined ? include_lecturers === "true" : undefined,
            page: typeof page === "string" ? Number(page) : (typeof page === "number" ? page : undefined),
            limit: typeof limit === "string" ? Number(limit) : (typeof limit === "number" ? limit : undefined)
        };

        const clusters = await researchService.getResearchClusters(filters);
        res.status(200).json({
            success: true,
            data: clusters
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get paginated research clusters controller
    Description    : Fetches paginated list of research cluster data along with pagination metadata
    Request params : none
    Action         : fetch paginated clusters data from database
    Response       : success or error message 
*/
export async function getPaginatedResearchClusters(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { search, include_tags, include_lecturers, page, limit } = req.query;

        const filters: ResearchClusterFilters = {
            search: typeof search === "string" ? search : undefined,
            include_tags: include_tags !== undefined ? include_tags !== "false" : undefined,
            include_lecturers: include_lecturers !== undefined ? include_lecturers === "true" : undefined,
            page: typeof page === "string" ? Number(page) : (typeof page === "number" ? page : undefined),
            limit: typeof limit === "string" ? Number(limit) : (typeof limit === "number" ? limit : undefined)
        };

        const result = await researchService.getPaginatedResearchClusters(filters);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get single research cluster by ID controller
    Description    : Fetches single research cluster data from database based on ID parameter
    Request params : cluster ID
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getResearchClusterById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid research cluster ID parameter"
            });
            return;
        }

        const cluster = await researchService.getResearchClusterById(id);
        if (!cluster) {
            res.status(404).json({
                success: false,
                message: "Research cluster not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: cluster
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get single research cluster by slug controller
    Description    : Fetches single detailed research cluster data from database based on slug parameter
    Request params : cluster slug
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getResearchClusterBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const slug = typeof req.params.slug === "string" ? req.params.slug : (Array.isArray(req.params.slug) ? req.params.slug[0] : undefined);
        if (!slug) {
            res.status(400).json({
                success: false,
                message: "Invalid slug parameter"
            });
            return;
        }

        const cluster = await researchService.getResearchClusterBySlug(slug);
        if (!cluster) {
            res.status(404).json({
                success: false,
                message: "Research cluster not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: cluster
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Create new research cluster controller
    Description    : Creates new research cluster data
    Request params : name, slug, and optional description/sort_order
    Action         : create research cluster data
    Response       : success or error message 
*/
export async function createResearchCluster(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { name, slug } = req.body as CreateResearchClusterDTO;

        if (!name || !slug) {
            res.status(400).json({
                success: false,
                message: "Name and slug are required"
            });
            return;
        }

        const existingSlug = await researchService.getResearchClusterBySlug(slug);
        if (existingSlug) {
            res.status(409).json({
                success: false,
                message: "A research cluster with this slug already exists"
            });
            return;
        }

        const newCluster = await researchService.createResearchCluster(req.body as CreateResearchClusterDTO);
        res.status(201).json({
            success: true,
            message: "Research cluster created successfully",
            data: newCluster
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Update an existing research cluster controller
    Description    : Updates existing research cluster data
    Request params : cluster ID
    Action         : update research cluster data
    Response       : success or error message 
*/
export async function updateResearchCluster(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid research cluster ID parameter"
            });
            return;
        }

        const existing = await researchService.getResearchClusterById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Research cluster not found"
            });
            return;
        }

        const updateData = req.body as UpdateResearchClusterDTO;
        if (updateData.slug && updateData.slug !== existing.slug) {
            const existingSlug = await researchService.getResearchClusterBySlug(updateData.slug);
            if (existingSlug && existingSlug.id !== id) {
                res.status(409).json({
                    success: false,
                    message: "A research cluster with this slug already exists"
                });
                return;
            }
        }

        const updated = await researchService.updateResearchCluster(id, updateData);

        res.status(200).json({
            success: true,
            message: "Research cluster updated successfully",
            data: updated
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Soft delete a research cluster controller
    Description    : Soft deletes research cluster data
    Request params : cluster ID
    Action         : delete research cluster data
    Response       : success or error message 
*/
export async function deleteResearchCluster(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid research cluster ID parameter"
            });
            return;
        }

        const existing = await researchService.getResearchClusterById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Research cluster not found"
            });
            return;
        }

        const success = await researchService.deleteResearchCluster(id);
        if (!success) {
            res.status(500).json({
                success: false,
                message: "Failed to delete research cluster"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Research cluster deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Restore a soft-deleted research cluster controller
    Description    : Restores soft-deleted research cluster data
    Request params : cluster ID
    Action         : restore research cluster data
    Response       : success or error message 
*/
export async function restoreResearchCluster(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid research cluster ID parameter"
            });
            return;
        }

        const existing = await researchService.getResearchClusterById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Research cluster not found"
            });
            return;
        }

        const success = await researchService.restoreResearchCluster(id);
        if (!success) {
            res.status(500).json({
                success: false,
                message: "Failed to restore research cluster"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Research cluster restored successfully"
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get all research tags controller
    Description    : Fetches all research tag data from database based on optional filters
    Request params : none
    Action         : fetch tags data from database
    Response       : success or error message 
*/
export async function getResearchTags(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { search, cluster_id, cluster_slug, is_active, page, limit } = req.query;

        const filters: ResearchTagFilters = {
            search: typeof search === "string" ? search : undefined,
            cluster_id: typeof cluster_id === "string" ? cluster_id : undefined,
            cluster_slug: typeof cluster_slug === "string" ? cluster_slug : undefined,
            is_active: is_active !== undefined ? is_active === "true" : undefined,
            page: typeof page === "string" ? Number(page) : (typeof page === "number" ? page : undefined),
            limit: typeof limit === "string" ? Number(limit) : (typeof limit === "number" ? limit : undefined)
        };

        const tags = await researchService.getResearchTags(filters);
        res.status(200).json({
            success: true,
            data: tags
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get paginated research tags controller
    Description    : Fetches paginated list of research tag data along with pagination metadata
    Request params : none
    Action         : fetch paginated tags data from database
    Response       : success or error message 
*/
export async function getPaginatedResearchTags(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { search, cluster_id, cluster_slug, is_active, page, limit } = req.query;

        const filters: ResearchTagFilters = {
            search: typeof search === "string" ? search : undefined,
            cluster_id: typeof cluster_id === "string" ? cluster_id : undefined,
            cluster_slug: typeof cluster_slug === "string" ? cluster_slug : undefined,
            is_active: is_active !== undefined ? is_active === "true" : undefined,
            page: typeof page === "string" ? Number(page) : (typeof page === "number" ? page : undefined),
            limit: typeof limit === "string" ? Number(limit) : (typeof limit === "number" ? limit : undefined)
        };

        const result = await researchService.getPaginatedResearchTags(filters);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get single research tag by ID controller
    Description    : Fetches single research tag data from database based on ID parameter
    Request params : tag ID
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getResearchTagById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid research tag ID parameter"
            });
            return;
        }

        const tag = await researchService.getResearchTagById(id);
        if (!tag) {
            res.status(404).json({
                success: false,
                message: "Research tag not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: tag
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get single research tag by slug controller
    Description    : Fetches single detailed research tag data from database based on slug parameter
    Request params : tag slug
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getResearchTagBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const slug = typeof req.params.slug === "string" ? req.params.slug : (Array.isArray(req.params.slug) ? req.params.slug[0] : undefined);
        if (!slug) {
            res.status(400).json({
                success: false,
                message: "Invalid slug parameter"
            });
            return;
        }

        const tag = await researchService.getResearchTagBySlug(slug);
        if (!tag) {
            res.status(404).json({
                success: false,
                message: "Research tag not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: tag
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Create new research tag controller
    Description    : Creates new research tag data
    Request params : name, slug, cluster_id, and optional description/is_active
    Action         : create research tag data
    Response       : success or error message 
*/
export async function createResearchTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { name, slug, cluster_id } = req.body as CreateResearchTagDTO;

        if (!name || !slug || !cluster_id) {
            res.status(400).json({
                success: false,
                message: "Name, slug, and cluster_id are required"
            });
            return;
        }

        const existingSlug = await researchService.getResearchTagBySlug(slug);
        if (existingSlug) {
            res.status(409).json({
                success: false,
                message: "A research tag with this slug already exists"
            });
            return;
        }

        const newTag = await researchService.createResearchTag(req.body as CreateResearchTagDTO);
        res.status(201).json({
            success: true,
            message: "Research tag created successfully",
            data: newTag
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Update an existing research tag controller
    Description    : Updates existing research tag data
    Request params : tag ID
    Action         : update research tag data
    Response       : success or error message 
*/
export async function updateResearchTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid research tag ID parameter"
            });
            return;
        }

        const existing = await researchService.getResearchTagById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Research tag not found"
            });
            return;
        }

        const updateData = req.body as UpdateResearchTagDTO;
        if (updateData.slug && updateData.slug !== existing.slug) {
            const existingSlug = await researchService.getResearchTagBySlug(updateData.slug);
            if (existingSlug && existingSlug.id !== id) {
                res.status(409).json({
                    success: false,
                    message: "A research tag with this slug already exists"
                });
                return;
            }
        }

        const updated = await researchService.updateResearchTag(id, updateData);

        res.status(200).json({
            success: true,
            message: "Research tag updated successfully",
            data: updated
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Soft delete a research tag controller
    Description    : Soft deletes research tag data
    Request params : tag ID
    Action         : delete research tag data
    Response       : success or error message 
*/
export async function deleteResearchTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid research tag ID parameter"
            });
            return;
        }

        const existing = await researchService.getResearchTagById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Research tag not found"
            });
            return;
        }

        const success = await researchService.deleteResearchTag(id);
        if (!success) {
            res.status(500).json({
                success: false,
                message: "Failed to delete research tag"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Research tag deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Restore a soft-deleted research tag controller
    Description    : Restores soft-deleted research tag data
    Request params : tag ID
    Action         : restore research tag data
    Response       : success or error message 
*/
export async function restoreResearchTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : undefined);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Invalid research tag ID parameter"
            });
            return;
        }

        const existing = await researchService.getResearchTagById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Research tag not found"
            });
            return;
        }

        const success = await researchService.restoreResearchTag(id);
        if (!success) {
            res.status(500).json({
                success: false,
                message: "Failed to restore research tag"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Research tag restored successfully"
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Import research clusters CSV/JSON items controller
    Description    : Batch imports or upserts research clusters from CSV or JSON items
    Request params : items array
    Action         : batch import or upsert cluster data
    Response       : success or error message with import summary
*/
export async function importResearchClustersCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const items = req.body.items || req.body;

        if (!items || !Array.isArray(items)) {
            res.status(400).json({
                success: false,
                message: "Items array is required for batch import"
            });
            return;
        }

        const result = await researchService.importResearchClustersCSV(items);

        res.status(200).json({
            success: true,
            message: "Research clusters import process completed",
            data: result
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Import research tags CSV/JSON items controller
    Description    : Batch imports or upserts research tags from CSV or JSON items
    Request params : items array
    Action         : batch import or upsert tag data
    Response       : success or error message with import summary
*/
export async function importResearchTagsCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const items = req.body.items || req.body;

        if (!items || !Array.isArray(items)) {
            res.status(400).json({
                success: false,
                message: "Items array is required for batch import"
            });
            return;
        }

        const result = await researchService.importResearchTagsCSV(items);

        res.status(200).json({
            success: true,
            message: "Research tags import process completed",
            data: result
        });
    } catch (error) {
        next(error);
    }
}
