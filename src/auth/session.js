import {
    randomBytes,
    sha256,
    base64UrlEncode
} from "../utils/crypto.js";

import {
    getCookie,
    createSessionCookie,
    clearSessionCookie
} from "../utils/cookie.js";

const SESSION_DAYS = 7;

export async function createSession(
    env,
    userId
) {
    const token = base64UrlEncode(
        randomBytes(32)
    );

    const tokenHash = await sha256(token);

    const expiresAt =
        Math.floor(Date.now() / 1000) +
        SESSION_DAYS * 24 * 60 * 60;

    await env.DB
        .prepare(`
      INSERT INTO sessions
      (
        token_hash,
        user_id,
        expires_at
      )
      VALUES (?, ?, ?)
    `)
        .bind(
            base64UrlEncode(tokenHash),
            userId,
            expiresAt
        )
        .run();

    return {
        token,
        cookie: createSessionCookie(
            token,
            SESSION_DAYS * 24 * 60 * 60
        )
    };
}

export async function getCurrentUser(
    request,
    env
) {
    const token = getCookie(
        request,
        "session"
    );

    if (!token) {
        return null;
    }

    const tokenHash =
        await sha256(token);

    const now =
        Math.floor(Date.now() / 1000);

    const user = await env.DB
        .prepare(`
      SELECT
        users.id,
        users.name,
        users.email
      FROM sessions
      INNER JOIN users
        ON users.id = sessions.user_id
      WHERE
        sessions.token_hash = ?
        AND sessions.expires_at > ?
      LIMIT 1
    `)
        .bind(
            base64UrlEncode(tokenHash),
            now
        )
        .first();

    return user || null;
}

export async function destroySession(
    request,
    env
) {
    const token = getCookie(
        request,
        "session"
    );

    if (token) {
        const tokenHash =
            await sha256(token);

        await env.DB
            .prepare(`
        DELETE FROM sessions
        WHERE token_hash = ?
      `)
            .bind(
                base64UrlEncode(tokenHash)
            )
            .run();
    }

    return clearSessionCookie();
}