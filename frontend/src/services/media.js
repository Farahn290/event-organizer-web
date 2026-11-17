export const backendOrigin = (import.meta.env.VITE_API_URL || "http://localhost:8000")
    .replace(/\/+$/, "");

export const buildUploadUrl = (imageName) => {
    if (!imageName) return "";

    const normalizedName = String(imageName).trim();
    if (!normalizedName) return "";
    if (/^https?:\/\//i.test(normalizedName) || normalizedName.startsWith("/")) {
        return normalizedName;
    }

    return `${backendOrigin}/uploads/${encodeURIComponent(normalizedName.replace(/^\/+/, ""))}`;
};
