import { homePage } from "./pages/home.js";
import { registerPage } from "./pages/register.js";
import { handleRegister } from "./auth/register.js";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // HOME
        if (
            request.method === "GET" &&
            url.pathname === "/"
        ) {
            return homePage();
        }

        // REGISTER PAGE
        if (
            request.method === "GET" &&
            url.pathname === "/register"
        ) {
            return registerPage();
        }

        // REGISTER ACTION
        if (
            request.method === "POST" &&
            url.pathname === "/register"
        ) {
            return await handleRegister(
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
    }
};