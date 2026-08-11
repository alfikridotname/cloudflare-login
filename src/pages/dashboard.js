import { tools } from "../tools/registry.js";

export function dashboardPage(user) {
  const categories = {};

  for (const tool of tools) {
    if (!categories[ tool.category ]) {
      categories[ tool.category ] = [];
    }

    categories[ tool.category ].push(tool);
  }

  const categoryHtml =
    Object.entries(categories)
      .map(([ category, categoryTools ]) => {

        const cards =
          categoryTools
            .map(tool => `
              <a
                href="/tools/${encodeURIComponent(tool.slug)}"
                class="tool-card"
              >

                <div class="tool-icon">
                  ${tool.icon}
                </div>

                <div class="tool-content">

                  <h3>
                    ${escapeHtml(tool.name)}
                  </h3>

                  <p>
                    ${escapeHtml(tool.description)}
                  </p>

                  <span class="open-tool">
                    Buka Tool →
                  </span>

                </div>

              </a>
            `)
            .join("");

        return `
          <section class="category">

            <div class="category-header">

              <h2>
                ${escapeHtml(category)}
              </h2>

              <span>
                ${categoryTools.length} tool
              </span>

            </div>

            <div class="tools-grid">
              ${cards}
            </div>

          </section>
        `;

      })
      .join("");

  return new Response(`
<!DOCTYPE html>

<html lang="id">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

<title>Dashboard - Cloudflare Tools</title>

<style>

* {
  box-sizing: border-box;
}

body {
  margin: 0;

  font-family:
    Arial,
    Helvetica,
    sans-serif;

  background: #f3f4f6;
  color: #111827;
}

/* =========================
   HEADER
   ========================= */

.header {
  height: 64px;

  background: #111827;
  color: white;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 28px;
}

.brand {
  font-size: 18px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-name {
  font-size: 14px;
  color: #d1d5db;
}

.logout-button {
  border: 0;
  border-radius: 7px;

  background: #dc2626;
  color: white;

  padding: 9px 14px;

  font-size: 13px;
  font-weight: bold;

  cursor: pointer;
}

.logout-button:hover {
  background: #ef4444;
}

/* =========================
   MAIN
   ========================= */

.main {
  max-width: 1200px;

  margin: 0 auto;

  padding: 40px 25px 60px;
}

.hero {
  margin-bottom: 40px;
}

.hero h1 {
  margin: 0 0 8px;

  font-size: 32px;
}

.hero p {
  margin: 0;

  color: #6b7280;

  font-size: 15px;
}

/* =========================
   CATEGORY
   ========================= */

.category {
  margin-bottom: 40px;
}

.category-header {
  display: flex;

  align-items: center;
  justify-content: space-between;

  margin-bottom: 15px;
}

.category-header h2 {
  margin: 0;

  font-size: 20px;
}

.category-header span {
  color: #6b7280;

  font-size: 13px;
}

/* =========================
   TOOLS
   ========================= */

.tools-grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fill,
      minmax(280px, 1fr)
    );

  gap: 18px;
}

.tool-card {
  display: flex;

  gap: 16px;

  padding: 22px;

  background: white;

  border-radius: 14px;

  text-decoration: none;

  color: inherit;

  border: 1px solid #e5e7eb;

  transition:
    transform .15s ease,
    box-shadow .15s ease,
    border-color .15s ease;
}

.tool-card:hover {
  transform: translateY(-3px);

  border-color: #cbd5e1;

  box-shadow:
    0 10px 30px
    rgba(0, 0, 0, .08);
}

.tool-icon {
  width: 52px;
  height: 52px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: #f3f4f6;

  font-size: 26px;
}

.tool-content {
  min-width: 0;
}

.tool-content h3 {
  margin: 0 0 7px;

  font-size: 16px;
}

.tool-content p {
  margin: 0 0 15px;

  color: #6b7280;

  font-size: 13px;

  line-height: 1.5;
}

.open-tool {
  color: #2563eb;

  font-size: 13px;

  font-weight: bold;
}

/* =========================
   MOBILE
   ========================= */

@media (max-width: 600px) {

  .header {
    height: auto;

    min-height: 60px;

    padding: 12px 15px;
  }

  .brand {
    font-size: 15px;
  }

  .user-name {
    display: none;
  }

  .main {
    padding:
      30px
      15px
      50px;
  }

  .hero h1 {
    font-size: 26px;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }

}

</style>

</head>

<body>

<header class="header">

  <div class="brand">
    Cloudflare Tools
  </div>

  <div class="header-right">

    <div class="user-name">
      ${escapeHtml(user.name)}
    </div>

    <form
      method="POST"
      action="/logout"
      style="margin:0"
    >

      <button
        type="submit"
        class="logout-button"
      >
        Logout
      </button>

    </form>

  </div>

</header>

<main class="main">

  <div class="hero">

    <h1>
      Dashboard
    </h1>

    <p>
      Selamat datang kembali,
      <strong>
        ${escapeHtml(user.name)}
      </strong>.
      Pilih tool yang ingin digunakan.
    </p>

  </div>

  ${categoryHtml}

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