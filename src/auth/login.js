import {
    findUserByEmail
} from "../database/users.js";

import {
    base64Decode,
    hashPassword,
    constantTimeEqual
} from "../utils/crypto.js";

import { createSession } from "./session.js";

import { loginPage } from "../pages/login.js";

export async function handleLogin(
    request,
    env
) {
    const form =
        await request.formData();

    const email = String(
        form.get("email") || ""
    )
        .trim()
        .toLowerCase();

    const password = String(
        form.get("password") || ""
    );

    if (!email || !password) {
        return loginPage(
            "Email dan password wajib diisi."
        );
    }

    const user =
        await findUserByEmail(
            env,
            email
        );

    if (!user) {
        return loginPage(
            "Email atau password salah."
        );
    }

    const parts =
        String(user.password_hash)
            .split(".");

    if (parts.length !== 2) {
        return loginPage(
            "Data password tidak valid."
        );
    }

    const salt =
        base64Decode(parts[ 0 ]);

    const storedHash =
        base64Decode(parts[ 1 ]);

    const calculatedHash =
        await hashPassword(
            password,
            salt
        );

    if (
        !constantTimeEqual(
            calculatedHash,
            storedHash
        )
    ) {
        return loginPage(
            "Email atau password salah."
        );
    }

    const session =
        await createSession(
            env,
            user.id
        );

    return new Response(null, {
        status: 302,
        headers: {
            Location: "/dashboard",
            "Set-Cookie": session.cookie
        }
    });
}