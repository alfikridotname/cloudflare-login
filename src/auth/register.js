import {
    findUserByEmail,
    createUser
} from "../database/users.js";

import {
    randomBytes,
    hashPassword,
    base64Encode
} from "../utils/crypto.js";

import { registerPage } from "../pages/register.js";

export async function handleRegister(
    request,
    env
) {
    const form = await request.formData();

    const name = String(
        form.get("name") || ""
    ).trim();

    const email = String(
        form.get("email") || ""
    )
        .trim()
        .toLowerCase();

    const password = String(
        form.get("password") || ""
    );

    // Validasi nama
    if (!name) {
        return registerPage(
            "Nama wajib diisi."
        );
    }

    if (name.length > 100) {
        return registerPage(
            "Nama maksimal 100 karakter."
        );
    }

    // Validasi email
    if (!email) {
        return registerPage(
            "Email wajib diisi."
        );
    }

    if (!isValidEmail(email)) {
        return registerPage(
            "Format email tidak valid."
        );
    }

    // Validasi password
    if (password.length < 8) {
        return registerPage(
            "Password minimal 8 karakter."
        );
    }

    // Cek apakah email sudah ada
    const existingUser =
        await findUserByEmail(
            env,
            email
        );

    if (existingUser) {
        return registerPage(
            "Email sudah terdaftar."
        );
    }

    // Buat salt
    const salt = randomBytes(16);

    // Hash password
    const passwordHash =
        await hashPassword(
            password,
            salt
        );

    // Simpan:
    // salt.hash
    const storedPassword =
        `${base64Encode(salt)}.${base64Encode(passwordHash)}`;

    await createUser(
        env,
        name,
        email,
        storedPassword
    );

    // Redirect ke login
    return new Response(null, {
        status: 302,
        headers: {
            Location: "/login?registered=1"
        }
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );
}