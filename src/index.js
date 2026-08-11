import { homePage } from "./pages/home.js";
import { registerPage } from "./pages/register.js";
import { loginPage } from "./pages/login.js";
import { dashboardPage } from "./pages/dashboard.js";

import { handleRegister } from "./auth/register.js";
import { handleLogin } from "./auth/login.js";
import { handleLogout } from "./auth/logout.js";

import { getCurrentUser } from "./auth/session.js";

export default {
    async fetch(request, env) {
        try {
            const url = new URL(request.url);
            const path = url.pathname;

            // HOME
            if (
                request.method === "GET" &&
                path === "/"
            ) {
                return homePage();
            }

            // REGISTER PAGE
            if (
                request.method === "GET" &&
                path === "/register"
            ) {
                return registerPage();
            }

            // REGISTER ACTION
            if (
                request.method === "POST" &&
                path === "/register"
            ) {
                return await handleRegister(
                    request,
                    env
                );
            }

            // LOGIN PAGE
            if (
                request.method === "GET" &&
                path === "/login"
            ) {
                const registered =
                    url.searchParams.get(
                        "registered"
                    );

                return loginPage(
                    "",
                    registered
                        ? "Registrasi berhasil. Silakan login."
                        : ""
                );
            }

            // LOGIN ACTION
            if (
                request.method === "POST" &&
                path === "/login"
            ) {
                return await handleLogin(
                    request,
                    env
                );
            }

            // DASHBOARD
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
                    return new Response(null, {
                        status: 302,
                        headers: {
                            Location: "/login"
                        }
                    });
                }

                return dashboardPage(user);
            }

            // LOGOUT
            if (
                request.method === "POST" &&
                path === "/logout"
            ) {
                return await handleLogout(
                    request,
                    env
                );
            }

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