import { homePage } from "./pages/home.js";
import { registerPage } from "./pages/register.js";
import { loginPage } from "./pages/login.js";
import { dashboardPage } from "./pages/dashboard.js";
import { toolShellPage } from "./pages/tool-shell.js";

import { handleRegister } from "./auth/register.js";
import { handleLogin } from "./auth/login.js";
import { handleLogout } from "./auth/logout.js";

import { getCurrentUser } from "./auth/session.js";

export default {
    async fetch(request, env) {
        try {
            const url = new URL(request.url);
            const path = url.pathname;

            /*
             * ==========================================
             * PUBLIC AUTH ROUTES
             * ==========================================
             */

            if (
                request.method === "GET" &&
                path === "/"
            ) {
                return homePage();
            }

            if (
                request.method === "GET" &&
                path === "/register"
            ) {
                return registerPage();
            }

            if (
                request.method === "POST" &&
                path === "/register"
            ) {
                return await handleRegister(
                    request,
                    env
                );
            }

            if (
                request.method === "GET" &&
                path === "/login"
            ) {
                const registered =
                    url.searchParams.get("registered");

                return loginPage(
                    "",
                    registered
                        ? "Registrasi berhasil. Silakan login."
                        : ""
                );
            }

            if (
                request.method === "POST" &&
                path === "/login"
            ) {
                return await handleLogin(
                    request,
                    env
                );
            }

            /*
             * ==========================================
             * DASHBOARD
             * ==========================================
             */

            if (
                request.method === "GET" &&
                path === "/dashboard"
            ) {
                const user =
                    await getCurrentUser(
                        request,
                        env
                    );

                if (!user) {
                    return redirect("/login");
                }

                return dashboardPage(user);
            }

            /*
             * ==========================================
             * LOGOUT
             * ==========================================
             */

            if (
                request.method === "POST" &&
                path === "/logout"
            ) {
                return await handleLogout(
                    request,
                    env
                );
            }

            /*
 * ==========================================
 * TOOL SHELL
 * ==========================================
 */

            if (
                request.method === "GET" &&
                path.startsWith("/tools/") &&
                !path.endsWith(".html")
            ) {
                const user =
                    await getCurrentUser(
                        request,
                        env
                    );

                if (!user) {
                    return redirect("/login");
                }

                const tool =
                    path
                        .replace("/tools/", "")
                        .replace(/\/$/, "");

                if (
                    !/^[a-zA-Z0-9_-]+$/.test(tool)
                ) {
                    return new Response(
                        "Tool tidak valid",
                        {
                            status: 400
                        }
                    );
                }

                return toolShellPage(tool);
            }

            if (
                request.method === "GET" &&
                path.startsWith("/tool-files/")
            ) {
                const user =
                    await getCurrentUser(request, env);

                if (!user) {
                    return redirect("/login");
                }

                return env.ASSETS.fetch(request);
            }

            /*
 * ==========================================
 * PROTECTED TOOL HTML ASSETS
 * ==========================================
 */

            if (
                request.method === "GET" &&
                path.startsWith("/tools/") &&
                path.endsWith(".html")
            ) {
                const user =
                    await getCurrentUser(
                        request,
                        env
                    );

                if (!user) {
                    return redirect("/login");
                }

                return env.ASSETS.fetch(request);
            }

            /*
             * ==========================================
             * 404
             * ==========================================
             */

            return new Response(
                "404 - Halaman tidak ditemukan",
                {
                    status: 404,
                    headers: {
                        "Content-Type":
                            "text/plain; charset=UTF-8"
                    }
                }
            );

        } catch (error) {
            console.error(error);

            return new Response(
                "Internal Server Error",
                {
                    status: 500,
                    headers: {
                        "Content-Type":
                            "text/plain; charset=UTF-8"
                    }
                }
            );
        }
    }
};


function redirect(location) {
    return new Response(null, {
        status: 302,
        headers: {
            Location: location
        }
    });
}