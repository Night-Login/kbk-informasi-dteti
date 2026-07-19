export type Role = "SUPERADMIN" | "ADMIN";

export interface Admin {
    id?: number;
    username: string;
    password?: string;
    role?: Role;
    createdAt?: Date | string;
}

// Data Transfer Objects (DTOs) for creating/updating
export interface CreateAdminDTO {
    username: string;
    password?: string;
    role?: Role;
}

export interface UpdateAdminDTO extends Partial<CreateAdminDTO> {}
