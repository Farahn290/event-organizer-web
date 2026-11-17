import {
    authTokenSecret,
    bcrypt,
    createAuthToken,
    HttpError,
    getBody,
    getText,
    sendSuccess,
    pool
} from "./dependencies.js";

export const register = async (request, response) => {
    const { nama, email, password } = getBody(request);
    const name = getText(nama);
    const address = getText(email).toLowerCase();

    if (!name || !address || typeof password !== "string" || password === "") {
        throw new HttpError(400, "Nama, email, dan password wajib diisi");
    }
    if (name.length > 255) {
        throw new HttpError(400, "Nama maksimal 255 karakter");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) || address.length > 254) {
        throw new HttpError(400, "Format email tidak valid");
    }
    if (password.length < 12 || Buffer.byteLength(password) > 72) {
        throw new HttpError(400, "Password minimal 12 karakter dan maksimal 72 byte UTF-8");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    let result;
    try {
        [result] = await pool.execute(
            "INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, 'peserta')",
            [name, address, passwordHash]
        );
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            throw new HttpError(409, "Email tersebut sudah terdaftar");
        }
        throw error;
    }

    response.status(201);
    sendSuccess(response, "Akun peserta berhasil dibuat", {
        data: { id: result.insertId, nama: name, email: address, role: "peserta" }
    });
};

export const login = async (request, response) => {
    const { email, password } = getBody(request);
    const address = getText(email).toLowerCase();
    if (!address || typeof password !== "string" || password === "") {
        throw new HttpError(400, "Email dan password wajib diisi");
    }
    if (address.length > 254 || Buffer.byteLength(password) > 72) {
        throw new HttpError(400, "Email atau password melebihi batas panjang yang diizinkan");
    }

    const [rows] = await pool.execute(
        "SELECT id, nama, email, password, role FROM users WHERE email = ? LIMIT 1",
        [address]
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new HttpError(401, "Email atau password salah");
    }

    const { password: storedPassword, ...userData } = user;
    sendSuccess(response, "Login berhasil", {
        data: userData,
        token: createAuthToken(user.id, user.role, authTokenSecret)
    });
};

export const logout = (request, response) => {
    sendSuccess(response, "Logout berhasil");
};
