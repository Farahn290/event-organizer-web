import { createHmac, timingSafeEqual } from "node:crypto";

const tokenLifetimeSeconds = 8 * 60 * 60;
const validRoles = ["admin", "panitia", "peserta"];

const sign = (value, secret) => createHmac("sha256", secret).update(value).digest("base64url");

export const createAuthToken = (userId, role, secret, now = Date.now()) => {
    if (!validRoles.includes(role)) throw new TypeError("Invalid user role");

    const payload = Buffer.from(JSON.stringify({
        sub: userId,
        role,
        exp: Math.floor(now / 1000) + tokenLifetimeSeconds
    })).toString("base64url");

    return `${payload}.${sign(payload, secret)}`;
};

export const verifyAuthToken = (token, secret, now = Date.now()) => {
    if (typeof token !== "string") return null;

    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra !== undefined) return null;

    const expectedSignature = Buffer.from(sign(payload, secret));
    const providedSignature = Buffer.from(signature);
    if (
        expectedSignature.length !== providedSignature.length ||
        !timingSafeEqual(expectedSignature, providedSignature)
    ) {
        return null;
    }

    try {
        const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        if (
            !Number.isSafeInteger(claims.sub) ||
            claims.sub <= 0 ||
            !validRoles.includes(claims.role) ||
            !Number.isSafeInteger(claims.exp) ||
            claims.exp <= Math.floor(now / 1000)
        ) {
            return null;
        }

        return { userId: claims.sub, role: claims.role };
    } catch {
        return null;
    }
};
