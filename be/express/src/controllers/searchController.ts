import { Request, Response, NextFunction } from "express";
import searchService from "../services/searchService.js";

/**
 * Universal search controller
 * GET /api/v1/search
 */
export async function searchUniversal(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { q, search, query, limit, type } = req.query;
    const searchKeyword = String(q || search || query || "").trim();
    const searchLimit = limit ? parseInt(String(limit), 10) : 5;
    const searchType = type as
      | "all"
      | "lecturers"
      | "tags"
      | "publications"
      | "projects"
      | "content"
      | undefined;

    const results = await searchService.searchUniversal({
      q: searchKeyword,
      limit: isNaN(searchLimit) ? 5 : searchLimit,
      type: searchType,
    });

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
}
