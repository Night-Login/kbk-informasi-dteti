import { Project } from "../types/index.js";
import { mockProjects } from "../utils/mock.js";

export const getProjects = async (filters?: Record<string, any>): Promise<Project[]> => {
    return mockProjects;
};
