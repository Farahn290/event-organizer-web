import { verifyAuthToken } from "../src/auth.js";
import { authTokenSecret } from "../src/config.js";

export const requireRole = (...roles) => (request, response, next) => {
    const authorization = request.get("authorization") || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    const claims = verifyAuthToken(token, authTokenSecret);

    if (!claims) {
        return response.status(401).json({ success: false, message: "Sesi admin tidak valid atau sudah berakhir" });
    }
    if (!roles.includes(claims.role)) {
        return response.status(403).json({ success: false, message: "Anda tidak memiliki izin untuk mengakses fitur ini" });
    }

    request.userId = claims.userId;
    request.userRole = claims.role;
    return next();
};
