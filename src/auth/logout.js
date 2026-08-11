import {
    destroySession
} from "./session.js";

export async function handleLogout(
    request,
    env
) {
    const cookie =
        await destroySession(
            request,
            env
        );

    return new Response(null, {
        status: 302,
        headers: {
            Location: "/login",
            "Set-Cookie": cookie
        }
    });
}