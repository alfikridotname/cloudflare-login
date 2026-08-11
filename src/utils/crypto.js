const PBKDF2_ITERATIONS = 100000;

export function randomBytes(length) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
}

export async function hashPassword(password, salt) {
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        [ "deriveBits" ]
    );

    const bits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt,
            iterations: PBKDF2_ITERATIONS,
            hash: "SHA-256"
        },
        key,
        256
    );

    return new Uint8Array(bits);
}

export async function sha256(value) {
    const data =
        typeof value === "string"
            ? new TextEncoder().encode(value)
            : value;

    const hash = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    return new Uint8Array(hash);
}

export function base64Encode(bytes) {
    let binary = "";

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary);
}

export function base64Decode(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[ i ] = binary.charCodeAt(i);
    }

    return bytes;
}

export function base64UrlEncode(bytes) {
    return base64Encode(bytes)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

export function constantTimeEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }

    let result = 0;

    for (let i = 0; i < a.length; i++) {
        result |= a[ i ] ^ b[ i ];
    }

    return result === 0;
}