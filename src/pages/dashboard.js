import { tools } from "../tools/registry.js";

export function dashboardPage(user) {
  const categories = {};

  for (const tool of tools) {
    if (!categories[ tool.category ]) {
      categories[ tool.category ] = [];
    }

    categories[ tool.category ].push(tool);
  }

  const sidebarCategories = Object.entries(categories)
    .map(([ category, categoryTools ]) => {

      const items = categoryTools
        .map(tool => `
          <a
            href="/tools/${encodeURIComponent(tool.slug)}"
            class="sidebar-tool"
          >
            <span class="sidebar-tool-icon">
              ${tool.icon}
            </span>

            <span>
              ${escapeHtml(tool.name)}
            </span>
          </a>
        `)
        .join("");

      return `
        <div class="sidebar-section">

          <div class="sidebar-section-title">
            ${escapeHtml(category)}
          </div>

          ${items}

        </div>
      `;
    })
    .join("");

  const categoryContent = Object.entries(categories)
    .map(([ category, categoryTools ]) => {

      const cards = categoryTools
        .map(tool => `
          <a
            href="/tools/${encodeURIComponent(tool.slug)}"
            class="tool-card"
          >

            <div class="tool-icon">
              ${tool.icon}
            </div>

            <div class="tool-info">

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
        <section class="tool-category">

          <div class="category-heading">

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

<title>Cloudflare Tools</title>

<style>

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;

  min-height: 100%;

  font-family:
    Arial,
    Helvetica,
    sans-serif;

  background: #f3f4f6;
  color: #111827;
}

/* =========================================
   LAYOUT
========================================= */

.app {
  min-height: 100vh;

  display: flex;
}

/* =========================================
   SIDEBAR
========================================= */

.sidebar {
  width: 270px;

  position: fixed;

  top: 0;
  bottom: 0;
  left: 0;

  background: #111827;
  color: white;

  overflow-y: auto;

  padding: 22px 15px;

  z-index: 20;
}

.logo {
  padding: 5px 12px 25px;

  font-size: 19px;
  font-weight: bold;

  border-bottom:
    1px solid #374151;

  margin-bottom: 20px;
}

.logo-icon {
  margin-right: 7px;
}

/* =========================================
   SIDEBAR MENU
========================================= */

.sidebar-section {
  margin-bottom: 25px;
}

.sidebar-section-title {
  padding: 0 12px 8px;

  color: #9ca3af;

  font-size: 11px;

  font-weight: bold;

  text-transform: uppercase;

  letter-spacing: .7px;
}

.sidebar-tool {
  display: flex;

  align-items: center;

  gap: 9px;

  padding: 10px 12px;

  margin-bottom: 3px;

  border-radius: 7px;

  color: #d1d5db;

  text-decoration: none;

  font-size: 13px;
}

.sidebar-tool:hover {
  background: #1f2937;
  color: white;
}

.sidebar-tool-icon {
  width: 22px;

  text-align: center;

  font-size: 16px;
}

/* =========================================
   SIDEBAR BOTTOM
========================================= */

.sidebar-bottom {
  margin-top: 30px;

  padding-top: 18px;

  border-top:
    1px solid #374151;
}

.sidebar-link {
  display: flex;

  align-items: center;

  gap: 10px;

  padding: 10px 12px;

  color: #d1d5db;

  text-decoration: none;

  border-radius: 7px;

  font-size: 13px;
}

.sidebar-link:hover {
  background: #1f2937;
  color: white;
}

.sidebar-logout {
  width: 100%;

  margin-top: 5px;

  padding: 10px 12px;

  border: 0;

  border-radius: 7px;

  background: transparent;

  color: #fca5a5;

  text-align: left;

  font-size: 13px;

  cursor: pointer;
}

.sidebar-logout:hover {
  background: #450a0a;
}

/* =========================================
   MAIN
========================================= */

.main {
  margin-left: 270px;

  width: calc(100% - 270px);

  min-height: 100vh;

  padding: 35px;
}

/* =========================================
   TOP BAR
========================================= */

.topbar {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 35px;
}

.page-title h1 {
  margin: 0 0 7px;

  font-size: 28px;
}

.page-title p {
  margin: 0;

  color: #6b7280;

  font-size: 14px;
}

.user {
  padding: 9px 14px;

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 8px;

  font-size: 13px;

  color: #374151;
}

/* =========================================
   CATEGORY
========================================= */

.tool-category {
  margin-bottom: 40px;
}

.category-heading {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 15px;
}

.category-heading h2 {
  margin: 0;

  font-size: 18px;
}

.category-heading span {
  color: #6b7280;

  font-size: 12px;
}

/* =========================================
   TOOL CARDS
========================================= */

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

  padding: 20px;

  background: white;

  border:
    1px solid #e5e7eb;

  border-radius: 13px;

  color: inherit;

  text-decoration: none;

  transition:
    transform .15s ease,
    box-shadow .15s ease;
}

.tool-card:hover {
  transform: translateY(-3px);

  box-shadow:
    0 10px 25px
    rgba(0,0,0,.08);
}

.tool-icon {
  width: 52px;
  height: 52px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  background: #f3f4f6;

  border-radius: 11px;

  font-size: 25px;
}

.tool-info {
  min-width: 0;
}

.tool-info h3 {
  margin: 0 0 7px;

  font-size: 15px;
}

.tool-info p {
  margin: 0 0 13px;

  color: #6b7280;

  font-size: 12px;

  line-height: 1.5;
}

.open-tool {
  color: #2563eb;

  font-size: 12px;

  font-weight: bold;
}

/* =========================================
   MOBILE
========================================= */

.mobile-header {
  display: none;
}

@media (max-width: 800px) {

  .sidebar {
    width: 220px;
  }

  .main {
    margin-left: 220px;

    width:
      calc(100% - 220px);

    padding: 25px 18px;
  }

}

@media (max-width: 600px) {

  .sidebar {
    display: none;
  }

  .main {
    margin-left: 0;

    width: 100%;

    padding: 20px 15px;
  }

  .mobile-header {
    display: flex;

    height: 55px;

    align-items: center;

    padding: 0 15px;

    background: #111827;

    color: white;
  }

  .mobile-header strong {
    font-size: 16px;
  }

  .topbar {
    margin-top: 25px;
  }

  .user {
    display: none;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }

}

</style>

</head>

<body>

<div class="app">

  <!-- =====================================
       SIDEBAR
  ====================================== -->

  <aside class="sidebar">

    <div class="logo">
      <span class="logo-icon">🛠️</span>
      Cloudflare Tools
    </div>

    ${sidebarCategories}

    <div class="sidebar-bottom">

      <a
        href="/dashboard"
        class="sidebar-link"
      >
        🏠 Dashboard
      </a>

      <a
        href="/profile"
        class="sidebar-link"
      >
        ⚙️ Profile
      </a>

      <form
        method="POST"
        action="/logout"
        style="margin:0"
      >

        <button
          type="submit"
          class="sidebar-logout"
        >
          🚪 Logout
        </button>

      </form>

    </div>

  </aside>

  <!-- =====================================
       MOBILE HEADER
  ====================================== -->

  <div class="mobile-header">

    <strong>
      🛠️ Cloudflare Tools
    </strong>

  </div>

  <!-- =====================================
       MAIN
  ====================================== -->

  <main class="main">

    <div class="topbar">

      <div class="page-title">

        <h1>
          Dashboard
        </h1>

        <p>
          Selamat datang kembali,
          <strong>
            ${escapeHtml(user.name)}
          </strong>.
        </p>

      </div>

      <div class="user">

        👤
        ${escapeHtml(user.name)}

      </div>

    </div>

    ${categoryContent}

  </main>

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