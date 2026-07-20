import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

export interface TokenPayload {
    id?: number;
    username: string;
    role?: string;
    [key: string]: any;
}

/**
 * Generate a JWT token for an authenticated user
 */
export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
    });
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): TokenPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded as TokenPayload;
    } catch (error) {
        return null;
    }
};
