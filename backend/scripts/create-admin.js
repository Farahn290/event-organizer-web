import { createInterface } from "node:readline";
import bcrypt from "bcryptjs";
import pool from "../src/database.js";

const prompt = (question) => new Promise((resolve) => {
    const readline = createInterface({ input: process.stdin, output: process.stdout });
    readline.question(question, (answer) => {
        readline.close();
        resolve(answer.trim());
    });
});

const promptPassword = () => new Promise((resolve, reject) => {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
        reject(new Error("Jalankan skrip ini langsung di terminal interaktif agar password tidak terlihat."));
        return;
    }

    process.stdout.write("Password admin (minimal 12 karakter): ");
    const input = process.stdin;
    let password = "";

    const finish = (error) => {
        input.setRawMode(false);
        input.pause();
        input.removeListener("data", onData);
        process.stdout.write("\n");
        if (error) reject(error);
        else resolve(password);
    };

    const onData = (chunk) => {
        for (const character of chunk.toString("utf8")) {
            if (character === "\u0003") {
                finish(new Error("Pembuatan admin dibatalkan."));
                return;
            }
            if (character === "\r" || character === "\n") {
                finish();
                return;
            }
            if (character === "\u007f" || character === "\b") {
                password = password.slice(0, -1);
                continue;
            }
            if (character >= " ") password += character;
        }
    };

    input.setRawMode(true);
    input.resume();
    input.on("data", onData);
});

try {
    const nama = await prompt("Nama admin: ");
    const email = (await prompt("Email admin: ")).toLowerCase();
    const password = await promptPassword();

    if (!nama || nama.length > 255) {
        throw new Error("Nama wajib diisi dan maksimal 255 karakter.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        throw new Error("Format email tidak valid.");
    }
    if (password.length < 12 || Buffer.byteLength(password) > 72) {
        throw new Error("Password minimal 12 karakter dan maksimal 72 byte UTF-8.");
    }

    const [existingUsers] = await pool.execute("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
    if (existingUsers.length > 0) {
        throw new Error("Email tersebut sudah terdaftar.");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await pool.execute(
        "INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, 'admin')",
        [nama, email, passwordHash]
    );
    console.log(`Akun admin berhasil dibuat untuk ${email}.`);
} catch (error) {
    console.error("Gagal membuat akun admin:", error.message);
    process.exitCode = 1;
} finally {
    await pool.end();
}
