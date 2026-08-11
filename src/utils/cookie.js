export function getCookie(request, name) {
    const header = request.headers.get("Cookie");

    if (!header) {
        return null;
    }

    const cookies = header.split(";");

    for (const cookie of cookies) {
        const parts = cookie.trim().split("=");

        const key = parts.shift();
        const value = parts.join("=");

        if (key === name) {
            return value;
        }
    }

    return null;
}

export function createSessionCookie(token, maxAge) {
    return [
        `session=${token}`,
        "Path=/",
        "HttpOnly",
        "Secure",
        "SameSite=Lax",
        `Max-Age=${maxAge}`
    ].join("; ");
}

export function clearSessionCookie() {
    return [
        "session=",
        "Path=/",
        "HttpOnly",
        "Secure",
        "SameSite=Lax",
        "Max-Age=0"
    ].join("; ");
}