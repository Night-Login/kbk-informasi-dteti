import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

function createStorage(directory: "lecturers" | "media", prefix: string) {
    const uploadDirectory = path.join(process.cwd(), "uploads", directory);
    const extensionByMimeType: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/jpg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/gif": ".gif",
    };

    return multer.diskStorage({
        destination: (_req: Request, _file: Express.Multer.File, callback) => {
            fs.mkdirSync(uploadDirectory, { recursive: true });
            callback(null, uploadDirectory);
        },
        filename: (_req: Request, file: Express.Multer.File, callback) => {
            const extension = extensionByMimeType[file.mimetype] || ".jpg";
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            callback(null, `${prefix}-${uniqueSuffix}${extension}`);
        },
    });
}

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
    storage: createStorage("lecturers", "lecturer"),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB limit
    },
    fileFilter
});

/**
 * Middleware for single lecturer profile photo upload (field name: 'photo')
 */
export const uploadPhoto = upload.single("photo");

export const uploadContentImage = multer({
    storage: createStorage("media", "content"),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter,
}).single("image");
