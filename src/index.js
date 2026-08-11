import { homePage } from "./pages/home.js";
import { registerPage } from "./pages/register.js";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (request.method === "GET" && url.pathname === "/") {
            return homePage();
        }

        if (request.method === "GET" && url.pathname === "/register") {
            return registerPage();
        }

        return new Response("404 - Halaman tidak ditemukan", {
            status: 404,
            headers: {
                "Content-Type": "text/plain; charset=UTF-8"
            }
        });
    }
};