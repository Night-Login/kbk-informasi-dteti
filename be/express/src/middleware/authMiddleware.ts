import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt.js";

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

/*
    Name           : Authenticate JWT middleware
    Description    : Verifies JWT token in Authorization header or cookies
    Request params : none
    Action         : authenticating token
    Response       : success or error message 
*/
export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : undefined;

    const tokenFromCookie = req.cookies && req.cookies.token;
    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
        res.status(401).json({
            success: false,
            message: "Authentication token missing"
        });
        return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
        return;
    }

    req.user = decoded;
    next();
}

/*
    Name           : Require Role middleware
    Description    : Restrict access to specific roles 
    Request params : array of allowed roles
    Action         : checking user role
    Response       : success or error message 
*/
export function requireRole(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: "Insufficient permissions to access this resource"
            });
            return;
        }
        next();
    };
}
