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

export async function findUserById(
    env,
    id
) {
    return await env.DB
        .prepare(`
      SELECT
        id,
        name,
        email,
        password_hash
      FROM users
      WHERE id = ?
      LIMIT 1
    `)
        .bind(id)
        .first();
}