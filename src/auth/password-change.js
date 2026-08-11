import {
    findUserById
} from "../database/users.js";

import {
    verifyPassword,
    createPasswordHash
} from "./password.js";

import {
    getCurrentUser,
    destroySession
} from "./session.js";

import { profilePage } from "../pages/profile.js";

export async function handlePasswordChange(
    request,
    env
) {
    const user =
        await getCurrentUser(
            request,
            env
        );

    if (!user) {
        return redirect("/login");
    }

    const form =
        await request.formData();

    const currentPassword =
        String(
            form.get("current_password") || ""
        );

    const newPassword =
        String(
            form.get("new_password") || ""
        );

    const confirmPassword =
        String(
            form.get("confirm_password") || ""
        );

    /*
     * Validasi dasar
     */

    if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
    ) {
        return profilePage(
            user,
            "",
            "Semua password wajib diisi."
        );
    }

    /*
     * Password baru minimal 8 karakter
     */

    if (newPassword.length < 8) {
        return profilePage(
            user,
            "",
            "Password baru minimal 8 karakter."
        );
    }

    /*
     * Konfirmasi password
     */

    if (
        newPassword !== confirmPassword
    ) {
        return profilePage(
            user,
            "",
            "Konfirmasi password tidak cocok."
        );
    }

    /*
     * Ambil user lengkap
     */

    const fullUser =
        await findUserById(
            env,
            user.id
        );

    if (!fullUser) {
        return profilePage(
            user,
            "",
            "User tidak ditemukan."
        );
    }

    /*
     * Verifikasi password lama
     */

    const valid =
        await verifyPassword(
            currentPassword,
            fullUser.password_hash
        );

    if (!valid) {
        return profilePage(
            user,
            "",
            "Password lama salah."
        );
    }

    /*
     * Jangan izinkan password
     * baru sama dengan password lama.
     */

    const samePassword =
        await verifyPassword(
            newPassword,
            fullUser.password_hash
        );

    if (samePassword) {
        return profilePage(
            user,
            "",
            "Password baru harus berbeda dari password lama."
        );
    }

    /*
     * Buat hash password baru
     */

    const passwordHash =
        await createPasswordHash(
            newPassword
        );

    /*
     * Update database
     */

    await env.DB
        .prepare(`
      UPDATE users
      SET password_hash = ?
      WHERE id = ?
    `)
        .bind(
            passwordHash,
            user.id
        )
        .run();

    /*
     * Hapus session aktif.
     *
     * Setelah password berubah,
     * user wajib login kembali.
     */

    const cookie =
        await destroySession(
            request,
            env
        );

    return new Response(null, {
        status: 302,
        headers: {
            Location:
                "/login?password_changed=1",

            "Set-Cookie": cookie
        }
    });
}


function redirect(location) {
    return new Response(null, {
        status: 302,
        headers: {
            Location: location
        }
    });
}