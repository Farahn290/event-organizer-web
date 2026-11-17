import {
    bcrypt,
    HttpError,
    getBody,
    getText,
    sendSuccess,
    pool
} from "./dependencies.js";

export const getProfile = async (request, response) => {
    const [users] = await pool.execute(
        "SELECT id, nama, email, role FROM users WHERE id = ? LIMIT 1",
        [request.userId]
    );
    if (!users[0]) throw new HttpError(401, "Sesi tidak valid atau sudah berakhir");
    sendSuccess(response, null, { data: users[0] });
};

export const updateProfile = async (request, response) => {
    const { nama, email } = getBody(request);
    const name = getText(nama);
    const address = getText(email).toLowerCase();

    if (!name || !address) {
        throw new HttpError(400, "Nama dan email wajib diisi");
    }
    if (name.length > 255) {
        throw new HttpError(400, "Nama maksimal 255 karakter");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) || address.length > 254) {
        throw new HttpError(400, "Format email tidak valid");
    }

    try {
        await pool.execute(
            "UPDATE users SET nama = ?, email = ? WHERE id = ?",
            [name, address, request.userId]
        );
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            throw new HttpError(409, "Email tersebut sudah terdaftar");
        }
        throw error;
    }

    sendSuccess(response, "Profil berhasil diperbarui", {
        data: { id: request.userId, nama: name, email: address, role: request.userRole }
    });
};

export const changePassword = async (request, response) => {
    const { password_lama: currentPassword, password_baru: newPassword } = getBody(request);
    if (
        typeof currentPassword !== "string" ||
        currentPassword === "" ||
        typeof newPassword !== "string" ||
        newPassword === ""
    ) {
        throw new HttpError(400, "Password lama dan password baru wajib diisi");
    }
    if (Buffer.byteLength(currentPassword) > 72) {
        throw new HttpError(400, "Password lama melebihi batas panjang yang diizinkan");
    }
    if (newPassword.length < 12 || Buffer.byteLength(newPassword) > 72) {
        throw new HttpError(400, "Password baru minimal 12 karakter dan maksimal 72 byte UTF-8");
    }

    const [users] = await pool.execute("SELECT password FROM users WHERE id = ? LIMIT 1", [request.userId]);
    if (!users[0] || !(await bcrypt.compare(currentPassword, users[0].password))) {
        throw new HttpError(400, "Password lama salah");
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await pool.execute("UPDATE users SET password = ? WHERE id = ?", [passwordHash, request.userId]);
    sendSuccess(response, "Password berhasil diubah");
};
