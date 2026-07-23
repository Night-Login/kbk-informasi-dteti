import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const allowedOrigins = (
    process.env.FRONTEND_URLS ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000"
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true
}));
app.use(compression());
app.use(morgan('dev'));

// Body Parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Serve static upload directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req: Request, res: Response) => {
    res.json({
        status: "running"
    });
});

// API Routes
app.use("/api/v1", routes);
app.use("/api", routes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error("Error caught by global handler:", err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({
        success: false,
        message
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
