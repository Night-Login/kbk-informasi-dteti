import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "lecturers");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure disk storage
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }
        cb(null, UPLOAD_DIR);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const ext = path.extname(file.originalname) || ".jpg";
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `lecturer-${uniqueSuffix}${ext}`);
    }
});

// File filter to allow only image files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed."));
    }
};

// Multer upload instance configured with 5MB file size limit
export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB limit
    },
    fileFilter
});

/**
 * Middleware for single lecturer profile photo upload (field name: 'photo')
 */
export const uploadPhoto = upload.single("photo");
