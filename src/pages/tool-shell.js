export function toolShellPage(tool) {
  const title = formatToolName(tool);

  return new Response(`
<!DOCTYPE html>
<html lang="id">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

<title>${escapeHtml(title)} - Tools</title>

<style>

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: Arial, sans-serif;
  background: #f3f4f6;
}

/* =========================
   APP HEADER
   ========================= */

.app-header {
  height: 60px;
  background: #111827;
  color: white;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 18px;

  position: relative;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}

.back-button,
.logout-button {
  border: none;
  border-radius: 7px;

  padding: 9px 14px;

  font-size: 14px;
  font-weight: bold;

  cursor: pointer;
  text-decoration: none;

  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.back-button {
  background: #374151;
  color: white;
}

.logout-button {
  background: #dc2626;
  color: white;
}

.back-button:hover {
  background: #4b5563;
}

.logout-button:hover {
  background: #ef4444;
}

/* =========================
   TOOL AREA
   ========================= */

.tool-container {
  width: 100%;
  height: calc(100vh - 60px);
  background: white;
}

.tool-frame {
  display: block;

  width: 100%;
  height: 100%;

  border: 0;
  margin: 0;
  padding: 0;
}

@media (max-width: 600px) {

  .app-header {
    height: 55px;
    padding: 0 10px;
  }

  .header-title {
    font-size: 14px;
  }

  .back-button,
  .logout-button {
    padding: 8px 10px;
    font-size: 13px;
  }

  .tool-container {
    height: calc(100vh - 55px);
  }

}

</style>

</head>

<body>

<header class="app-header">

  <div class="header-left">

    <a
      href="/dashboard"
      class="back-button"
    >
      ← Dashboard
    </a>

    <div class="header-title">
      ${escapeHtml(title)}
    </div>

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

</header>

<main class="tool-container">

  <iframe
    class="tool-frame"
    src="/tool-files/${encodeURIComponent(tool)}.html"
    title="${escapeHtml(title)}"
    allow="clipboard-read; clipboard-write"
  ></iframe>

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


function formatToolName(tool) {

  return tool
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, char =>
      char.toUpperCase()
    );
}


function escapeHtml(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}