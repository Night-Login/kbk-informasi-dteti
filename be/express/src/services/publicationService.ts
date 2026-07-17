import { Publication } from "../types/index.js";
import { mockPublications } from "../utils/mock.js";

export const getPublications = async (filters?: Record<string, any>): Promise<Publication[]> => {
    return mockPublications;
};

export const importPublicationsCSV = async (file?: any): Promise<boolean> => {
    return true;
};
