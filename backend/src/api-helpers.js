import pool from "./database.js";

export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export const getBody = (request) => (
    request.body && typeof request.body === "object" && !Array.isArray(request.body)
        ? request.body
        : {}
);

export const getText = (value) => (typeof value === "string" ? value.trim() : "");

export const getId = (value) => {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
};

export const parseTicketPrice = (value) => {
    const price = typeof value === "number" ? String(value) : getText(value);
    if (!/^\d{1,10}(?:\.\d{1,2})?$/.test(price)) {
        throw new HttpError(400, "Harga tiket harus berupa angka non-negatif dengan maksimal 2 angka desimal");
    }
    return price;
};

export const parsePositiveUnsignedInt = (value, fieldName) => {
    const number = typeof value === "number"
        ? value
        : typeof value === "string" && /^\d+$/.test(value.trim())
            ? Number(value)
            : Number.NaN;
    if (!Number.isSafeInteger(number) || number < 1 || number > 4294967295) {
        throw new HttpError(400, `${fieldName} harus berupa bilangan bulat positif`);
    }
    return number;
};

export const calculateInvoiceTotal = (price, quantity) => {
    const [whole, fraction = ""] = String(price).split(".");
    if (!/^\d+$/.test(whole) || !/^\d{0,2}$/.test(fraction)) {
        throw new Error("Database returned an invalid ticket price");
    }

    const totalCents = (
        BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"))
    ) * BigInt(quantity);
    if (totalCents > 999999999999n) {
        throw new HttpError(409, "Total tagihan melebihi batas yang didukung");
    }

    return `${totalCents / 100n}.${String(totalCents % 100n).padStart(2, "0")}`;
};

export const sendSuccess = (response, message, data = {}) => {
    response.json({ success: true, ...(message ? { message } : {}), ...data });
};

export const parseListPagination = (query) => {
    const requested = query.page !== undefined || query.limit !== undefined;
    const parseValue = (value, name, fallback, maximum) => {
        if (value === undefined) return fallback;
        if (typeof value !== "string" || !/^\d+$/.test(value)) {
            throw new HttpError(400, `${name} harus berupa bilangan bulat positif`);
        }
        const number = Number(value);
        if (!Number.isSafeInteger(number) || number < 1 || number > maximum) {
            throw new HttpError(400, `${name} di luar batas yang diizinkan`);
        }
        return number;
    };
    const page = parseValue(query.page, "page", 1, Number.MAX_SAFE_INTEGER);
    const limit = parseValue(query.limit, "limit", 20, 100);
    const offset = (page - 1) * limit;
    if (!Number.isSafeInteger(offset)) {
        throw new HttpError(400, "Nilai page terlalu besar");
    }

    return { requested, page, limit, offset };
};

export const getListPaginationSql = ({ requested }) => (requested ? " LIMIT ? OFFSET ?" : "");
export const getListPaginationParams = ({ requested, limit, offset }) => (requested ? [limit, offset] : []);
export const sendListSuccess = (response, data, total, pagination) => {
    sendSuccess(response, null, {
        data,
        ...(pagination.requested
            ? {
                pagination: {
                    page: pagination.page,
                    limit: pagination.limit,
                    total,
                    total_pages: Math.ceil(total / pagination.limit)
                }
            }
            : {})
    });
};

export const parseListFilter = (query, name, maxLength = 255) => {
    const value = query[name];
    if (value === undefined) return "";
    if (typeof value !== "string") {
        throw new HttpError(400, `Filter ${name} tidak valid`);
    }
    const filter = value.trim();
    if (filter.length > maxLength) {
        throw new HttpError(400, `Filter ${name} terlalu panjang`);
    }
    return filter;
};

export const parseListIdFilter = (query, name) => {
    const value = query[name];
    if (value === undefined || value === "") return null;
    if (typeof value !== "string" || !/^\d+$/.test(value)) {
        throw new HttpError(400, `Filter ${name} tidak valid`);
    }
    const id = getId(value);
    if (!id) throw new HttpError(400, `Filter ${name} tidak valid`);
    return id;
};

export const parseEventId = (value) => {
    if (value === undefined || value === "") return null;
    const eventId = getId(value);
    if (!eventId) throw new HttpError(400, "Event yang dipilih tidak valid");
    return eventId;
};

export const ensureEventExists = async (eventId) => {
    if (eventId === null) return;
    const [rows] = await pool.execute("SELECT id FROM events WHERE id = ? LIMIT 1", [eventId]);
    if (rows.length === 0) throw new HttpError(400, "Event yang dipilih tidak ditemukan");
};

export const ensureEventAccess = async (eventId, userId, userRole) => {
    const [rows] = await pool.execute(
        "SELECT id, created_by FROM events WHERE id = ? LIMIT 1",
        [eventId]
    );
    if (rows.length === 0) throw new HttpError(404, "Event tidak ditemukan");
    if (userRole === "panitia" && Number(rows[0].created_by) !== userId) {
        throw new HttpError(403, "Panitia hanya dapat mengelola event miliknya");
    }
};
