export function dashboardPage(user) {
    return new Response(`
<!DOCTYPE html>
<html lang="id">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

<title>Dashboard</title>

<style>

body {
  margin: 0;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  background: #f3f4f6;
}

.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.card {
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 40px;
  border-radius: 18px;
  box-shadow: 0 15px 40px rgba(0,0,0,.08);
}

.icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #16a34a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

h1 {
  text-align: center;
}

.welcome {
  text-align: center;
  color: #6b7280;
}

.info {
  margin-top: 30px;
  padding: 5px 20px;
  background: #f9fafb;
  border-radius: 12px;
}

.row {
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
}

.row:last-child {
  border-bottom: none;
}

.label {
  display: block;
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 5px;
}

button {
  width: 100%;
  padding: 14px;
  margin-top: 25px;
  border: none;
  border-radius: 9px;
  background: #dc2626;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

</style>

</head>

<body>

<div class="container">

<div class="card">

  <div class="icon">
    ✓
  </div>

  <h1>
    Dashboard
  </h1>

  <p class="welcome">
    Selamat datang,
    <strong>
      ${escapeHtml(user.name)}
    </strong>
  </p>

  <div class="info">

    <div class="row">
      <span class="label">
        Nama
      </span>

      <strong>
        ${escapeHtml(user.name)}
      </strong>
    </div>

    <div class="row">
      <span class="label">
        Email
      </span>

      <strong>
        ${escapeHtml(user.email)}
      </strong>
    </div>

  </div>

  <form
    method="POST"
    action="/logout"
  >

    <button type="submit">
      Logout
    </button>

  </form>

</div>

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