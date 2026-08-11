export function registerPage(error = "") {
  return new Response(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Register</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
      background: #f3f4f6;
      color: #111827;
    }

    .card {
      width: 100%;
      max-width: 420px;
      background: white;
      padding: 35px;
      border-radius: 18px;
      box-shadow: 0 15px 40px rgba(0,0,0,.08);
    }

    h1 {
      text-align: center;
      margin-bottom: 10px;
    }

    .description {
      text-align: center;
      color: #6b7280;
      margin-bottom: 25px;
    }

    label {
      display: block;
      margin: 15px 0 7px;
      font-weight: bold;
    }

    input {
      width: 100%;
      padding: 13px;
      border: 1px solid #d1d5db;
      border-radius: 9px;
      font-size: 15px;
    }

    input:focus {
      outline: none;
      border-color: #2563eb;
    }

    button {
      width: 100%;
      padding: 14px;
      margin-top: 25px;
      border: none;
      border-radius: 9px;
      background: #111827;
      color: white;
      font-size: 15px;
      font-weight: bold;
      cursor: pointer;
    }

    .bottom {
      text-align: center;
      margin-top: 25px;
      color: #6b7280;
    }

    a {
      color: #2563eb;
      text-decoration: none;
      font-weight: bold;
    }

    .error {
  background: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}
  </style>
</head>

<body>

  <div class="card">

    <h1>Buat Akun</h1>

    <p class="description">
      Daftar untuk membuat akun baru.
    </p>

    ${error
      ? `
      <div class="error">
        ${escapeHtml(error)}
      </div>
    `
      : ""
    }

    <form method="POST" action="/register">

      <label for="name">
        Nama
      </label>

      <input
        id="name"
        type="text"
        name="name"
        placeholder="Nama Anda"
        required
      >

      <label for="email">
        Email
      </label>

      <input
        id="email"
        type="email"
        name="email"
        placeholder="email@example.com"
        required
      >

      <label for="password">
        Password
      </label>

      <input
        id="password"
        type="password"
        name="password"
        placeholder="Minimal 8 karakter"
        minlength="8"
        required
      >

      <button type="submit">
        Buat Akun
      </button>

    </form>

    <p class="bottom">
      Sudah punya akun?
      <a href="/login">
        Login
      </a>
    </p>

  </div>

</body>
</html>
  `, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8"
    }
  });
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}