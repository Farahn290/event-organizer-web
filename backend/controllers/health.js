import {
    pool,
    sendSuccess
} from "./dependencies.js";

export const healthCheck = async (request, response) => {
    await pool.query("SELECT 1");
    sendSuccess(response, "Backend Node.js aktif");
};
