export function profilePage(user, message = "", error = "") {
    return new Response(`
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Profile - Cloudflare Tools</title>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;

  font-family: Arial, Helvetica, sans-serif;

  background: #f3f4f6;
  color: #111827;
}

.header {
  height: 64px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 28px;

  background: #111827;
  color: white;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.back {
  color: white;
  text-decoration: none;

  background: #374151;

  padding: 9px 13px;

  border-radius: 7px;

  font-size: 13px;
}

.title {
  font-weight: bold;
}

.logout {
  border: 0;
  border-radius: 7px;

  padding: 9px 14px;

  background: #dc2626;
  color: white;

  font-weight: bold;

  cursor: pointer;
}

.container {
  max-width: 650px;

  margin: 45px auto;

  padding: 0 20px;
}

.card {
  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 14px;

  padding: 30px;

  box-shadow:
    0 8px 25px
    rgba(0,0,0,.05);
}

h1 {
  margin: 0 0 7px;

  font-size: 26px;
}

.subtitle {
  margin: 0 0 30px;

  color: #6b7280;

  font-size: 14px;
}

.info {
  padding: 18px;

  background: #f9fafb;

  border-radius: 10px;

  margin-bottom: 30px;
}

.info-row {
  padding: 12px 0;

  border-bottom: 1px solid #e5e7eb;
}

.info-row:last-child {
  border-bottom: 0;
}

.label {
  display: block;

  margin-bottom: 5px;

  color: #6b7280;

  font-size: 12px;
}

.value {
  font-weight: bold;

  font-size: 14px;
}

.divider {
  margin: 30px 0;

  border: 0;

  border-top: 1px solid #e5e7eb;
}

h2 {
  margin: 0 0 20px;

  font-size: 18px;
}

.form-group {
  margin-bottom: 18px;
}

label {
  display: block;

  margin-bottom: 7px;

  font-size: 13px;

  font-weight: bold;
}

input {
  width: 100%;

  padding: 12px 13px;

  border: 1px solid #d1d5db;

  border-radius: 8px;

  font-size: 14px;

  outline: none;
}

input:focus {
  border-color: #2563eb;

  box-shadow:
    0 0 0 3px
    rgba(37,99,235,.1);
}

.button {
  width: 100%;

  padding: 12px;

  border: 0;

  border-radius: 8px;

  background: #2563eb;

  color: white;

  font-size: 14px;

  font-weight: bold;

  cursor: pointer;
}

.button:hover {
  background: #1d4ed8;
}

.message {
  padding: 12px;

  margin-bottom: 20px;

  border-radius: 8px;

  background: #dcfce7;

  color: #166534;

  font-size: 13px;
}

.error {
  padding: 12px;

  margin-bottom: 20px;

  border-radius: 8px;

  background: #fee2e2;

  color: #991b1b;

  font-size: 13px;
}

@media (max-width: 600px) {

  .header {
    padding: 0 15px;
  }

  .title {
    display: none;
  }

  .container {
    margin: 25px auto;
  }

  .card {
    padding: 22px;
  }
}
</style>

</head>

<body>

<header class="header">

  <div class="header-left">

    <a
      href="/dashboard"
      class="back"
    >
      ← Dashboard
    </a>

    <div class="title">
      Profile
    </div>

  </div>

  <form
    method="POST"
    action="/logout"
    style="margin:0"
  >

    <button
      type="submit"
      class="logout"
    >
      Logout
    </button>

  </form>

</header>

<main class="container">

  <div class="card">

    <h1>
      Profile
    </h1>

    <p class="subtitle">
      Kelola keamanan akun Anda.
    </p>

    ${message
            ? `<div class="message">${escapeHtml(message)}</div>`
            : ""
        }

    ${error
            ? `<div class="error">${escapeHtml(error)}</div>`
            : ""
        }

    <div class="info">

      <div class="info-row">

        <span class="label">
          Nama
        </span>

        <span class="value">
          ${escapeHtml(user.name)}
        </span>

      </div>

      <div class="info-row">

        <span class="label">
          Email
        </span>

        <span class="value">
          ${escapeHtml(user.email)}
        </span>

      </div>

    </div>

    <hr class="divider">

    <h2>
      Ganti Password
    </h2>

    <form
      method="POST"
      action="/profile/password"
    >

      <div class="form-group">

        <label>
          Password Lama
        </label>

        <input
          type="password"
          name="current_password"
          required
          autocomplete="current-password"
        >

      </div>

      <div class="form-group">

        <label>
          Password Baru
        </label>

        <input
          type="password"
          name="new_password"
          minlength="8"
          required
          autocomplete="new-password"
        >

      </div>

      <div class="form-group">

        <label>
          Konfirmasi Password Baru
        </label>

        <input
          type="password"
          name="confirm_password"
          minlength="8"
          required
          autocomplete="new-password"
        >

      </div>

      <button
        type="submit"
        class="button"
      >
        Ganti Password
      </button>

    </form>

  </div>

</main>

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