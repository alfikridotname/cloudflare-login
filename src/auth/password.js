import {
    randomBytes,
    hashPassword,
    base64Encode,
    base64Decode,
    constantTimeEqual
} from "../utils/crypto.js";

export async function verifyPassword(
    password,
    storedPassword
) {
    const parts =
        String(storedPassword).split(".");

    if (parts.length !== 2) {
        return false;
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

    return constantTimeEqual(
        calculatedHash,
        storedHash
    );
}


export async function createPasswordHash(
    password
) {
    const salt =
        randomBytes(16);

    const hash =
        await hashPassword(
            password,
            salt
        );

    return [
        base64Encode(salt),
        base64Encode(hash)
    ].join(".");
}