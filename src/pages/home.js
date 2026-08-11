export function homePage() {
    return new Response(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cloudflare Login</title>

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
      padding: 40px;
      border-radius: 18px;
      box-shadow: 0 15px 40px rgba(0,0,0,.08);
      text-align: center;
    }

    .icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 20px;
      border-radius: 50%;
      background: #111827;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
    }

    h1 {
      margin-bottom: 10px;
    }

    p {
      color: #6b7280;
      line-height: 1.6;
    }

    .button {
      display: block;
      width: 100%;
      padding: 14px;
      margin-top: 15px;
      border-radius: 9px;
      text-decoration: none;
      font-weight: bold;
      background: #111827;
      color: white;
    }

    .button.secondary {
      background: #e5e7eb;
      color: #111827;
    }
  </style>
</head>

<body>

  <div class="card">

    <div class="icon">
      🔐
    </div>

    <h1>Cloudflare Login</h1>

    <p>
      Selamat datang di aplikasi kami.
    </p>

    <a href="/login" class="button">
      Login
    </a>

    <a href="/register" class="button secondary">
      Buat Akun
    </a>

  </div>

</body>
</html>
  `, {
        headers: {
            "Content-Type": "text/html; charset=UTF-8"
        }
    });
}