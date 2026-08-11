import { homePage } from "./pages/home.js";
import { registerPage } from "./pages/register.js";
import { loginPage } from "./pages/login.js";
import { dashboardPage } from "./pages/dashboard.js";
import { toolShellPage } from "./pages/tool-shell.js";

import { handleRegister } from "./auth/register.js";
import { handleLogin } from "./auth/login.js";
import { handleLogout } from "./auth/logout.js";

import { getCurrentUser } from "./auth/session.js";

import {
    handlePasswordChange
} from "./auth/password-change.js";

import { profilePage } from "./pages/profile.js";

export default {
    async fetch(request, env) {
        try {
            const url = new URL(request.url);
            const path = url.pathname;

            /*
 * ==========================================
 * PUMA CORS PROXY
 * ==========================================
 */

            if (
                request.method === "OPTIONS" &&
                path === "/api/proxy"
            ) {
                return new Response(null, {
                    status: 204,
                    headers: {
                        "Access-Control-Allow-Origin": url.origin,
                        "Access-Control-Allow-Methods": "GET, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type",
                        "Access-Control-Max-Age": "86400",
                        "Vary": "Origin"
                    }
                });
            }

            if (
                request.method === "GET" &&
                path === "/api/proxy"
            ) {
                const target = url.searchParams.get("url");

                if (!target) {
                    return new Response(
                        JSON.stringify({
                            error: "Parameter url wajib diisi."
                        }),
                        {
                            status: 400,
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin": url.origin
                            }
                        }
                    );
                }

                let targetUrl;

                try {
                    targetUrl = new URL(target);
                } catch {
                    return new Response(
                        JSON.stringify({
                            error: "URL tidak valid."
                        }),
                        {
                            status: 400,
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin": url.origin
                            }
                        }
                    );
                }

                /*
                 * Hanya izinkan domain PUMA.
                 */
                const allowedHosts = [
                    "id.puma.com",
                    "images.puma.com"
                ];

                if (
                    !allowedHosts.includes(
                        targetUrl.hostname.toLowerCase()
                    )
                ) {
                    return new Response(
                        JSON.stringify({
                            error: "Domain tidak diizinkan.",
                            domain: targetUrl.hostname
                        }),
                        {
                            status: 403,
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin": url.origin
                            }
                        }
                    );
                }

                try {
                    const upstream = await fetch(
                        targetUrl.toString(),
                        {
                            method: "GET",
                            redirect: "follow",
                            headers: {
                                "User-Agent":
                                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36",
                                "Accept":
                                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                                "Accept-Language":
                                    "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
                            }
                        }
                    );

                    const headers = new Headers();

                    const contentType =
                        upstream.headers.get("Content-Type");

                    const cacheControl =
                        upstream.headers.get("Cache-Control");

                    if (contentType) {
                        headers.set(
                            "Content-Type",
                            contentType
                        );
                    }

                    if (cacheControl) {
                        headers.set(
                            "Cache-Control",
                            cacheControl
                        );
                    }

                    headers.set(
                        "Access-Control-Allow-Origin",
                        url.origin
                    );

                    headers.set(
                        "Access-Control-Allow-Methods",
                        "GET, OPTIONS"
                    );

                    headers.set(
                        "Access-Control-Allow-Headers",
                        "Content-Type"
                    );

                    headers.set(
                        "Vary",
                        "Origin"
                    );

                    return new Response(
                        upstream.body,
                        {
                            status: upstream.status,
                            statusText: upstream.statusText,
                            headers
                        }
                    );

                } catch (error) {

                    console.error(
                        "PUMA proxy error:",
                        error
                    );

                    return new Response(
                        JSON.stringify({
                            error:
                                "Gagal mengambil resource dari PUMA.",
                            detail:
                                error instanceof Error
                                    ? error.message
                                    : String(error)
                        }),
                        {
                            status: 502,
                            headers: {
                                "Content-Type":
                                    "application/json",
                                "Access-Control-Allow-Origin":
                                    url.origin
                            }
                        }
                    );
                }
            }

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
                const user =
                    await getCurrentUser(
                        request,
                        env
                    );

                if (!user) {
                    return redirect("/login");
                }

                return registerPage();
            }

            if (
                request.method === "POST" &&
                path === "/register"
            ) {
                const user =
                    await getCurrentUser(
                        request,
                        env
                    );

                if (!user) {
                    return redirect("/login");
                }

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

                const passwordChanged =
                    url.searchParams.get(
                        "password_changed"
                    );


                return loginPage(
                    "",
                    passwordChanged
                        ? "Password berhasil diubah. Silakan login kembali."
                        : registered
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

            if (
                request.method === "GET" &&
                path === "/profile"
            ) {
                const user =
                    await getCurrentUser(
                        request,
                        env
                    );

                if (!user) {
                    return redirect("/login");
                }

                return profilePage(user);
            }

            if (
                request.method === "POST" &&
                path === "/profile/password"
            ) {
                return await handlePasswordChange(
                    request,
                    env
                );
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