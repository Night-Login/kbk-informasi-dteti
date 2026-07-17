import { Lecturer } from "../types/index.js";
import { mockLecturers } from "../utils/mock.js";

export const getLecturers = async (filters?: Record<string, any>): Promise<Lecturer[]> => {
    return mockLecturers;
};

export const getLecturersBySlug = async (slug: string): Promise<Lecturer | null> => {
    return mockLecturers.find(l => l.slug === slug) || null;
};
