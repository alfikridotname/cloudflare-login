export async function findUserByEmail(env, email) {
    return await env.DB
        .prepare(`
      SELECT id, email, password_hash, name
      FROM users
      WHERE email = ?
      LIMIT 1
    `)
        .bind(email)
        .first();
}

export async function createUser(
    env,
    name,
    email,
    passwordHash
) {
    return await env.DB
        .prepare(`
      INSERT INTO users
      (name, email, password_hash)
      VALUES (?, ?, ?)
    `)
        .bind(
            name,
            email,
            passwordHash
        )
        .run();
}