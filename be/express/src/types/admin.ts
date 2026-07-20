export type Role = "SUPERADMIN" | "ADMIN";

export interface Admin {
    id?: number;
    username: string;
    password?: string;
    role?: Role;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
}

// Data Transfer Objects (DTOs) for creating/updating
export interface CreateAdminDTO {
    username: string;
    password?: string;
    role?: Role;
}

export interface UpdateAdminDTO extends Partial<CreateAdminDTO> {}

export interface LoginRequestDTO {
    username: string;
    password: string;
}

export interface LoginResponseDTO {
    admin: Omit<Admin, "password">;
    token?: string;
}

