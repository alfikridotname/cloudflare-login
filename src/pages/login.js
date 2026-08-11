export function loginPage(
    error = "",
    success = ""
) {
    return new Response(`
<!DOCTYPE html>
<html lang="id">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

<title>Login</title>

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

.icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #111827;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
}

h1 {
  text-align: center;
  margin-bottom: 10px;
}

.description {
  text-align: center;
  color: #6b7280;
}

label {
  display: block;
  margin: 18px 0 7px;
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

.error {
  margin-top: 20px;
  padding: 12px;
  border-radius: 8px;
  background: #fee2e2;
  color: #991b1b;
  text-align: center;
}

.success {
  margin-top: 20px;
  padding: 12px;
  border-radius: 8px;
  background: #dcfce7;
  color: #166534;
  text-align: center;
}

.bottom {
  margin-top: 25px;
  text-align: center;
  color: #6b7280;
}

a {
  color: #2563eb;
  text-decoration: none;
  font-weight: bold;
}

</style>

</head>

<body>

<div class="card">

  <div class="icon">
    🔐
  </div>

  <h1>Login</h1>

  <p class="description">
    Masuk ke akun Anda.
  </p>

  ${error
            ? `
        <div class="error">
          ${escapeHtml(error)}
        </div>
      `
            : ""
        }

  ${success
            ? `
        <div class="success">
          ${escapeHtml(success)}
        </div>
      `
            : ""
        }

  <form
    method="POST"
    action="/login"
  >

    <label>Email</label>

    <input
      type="email"
      name="email"
      placeholder="email@example.com"
      required
    >

    <label>Password</label>

    <input
      type="password"
      name="password"
      placeholder="Password"
      required
    >

    <button type="submit">
      Login
    </button>

  </form>

  <p class="bottom">

    Belum punya akun?

    <a href="/register">
      Buat Akun
    </a>

  </p>

</div>

</body>

</html>
  `, {
        headers: {
            "Content-Type":
                "text/html; charset=UTF-8"
        }
    });
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}