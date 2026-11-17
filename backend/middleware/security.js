import cors from "cors";
import helmet from "helmet";
import { allowedOrigins } from "../src/config.js";

export const configureSecurityMiddleware = (app) => {
    app.use(helmet());
    app.use(cors({
        origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin))
    }));
};
