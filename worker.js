/**
 * FDG Priority1 Proxy Worker
 * Deploy to Cloudflare Workers.
 * Set secret: wrangler secret put P1_API_KEY
 * Then paste your P1 key when prompted — it never touches this file.
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    // Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const url = new URL(request.url);

    // POST /quote  →  P1 rates
    if (url.pathname === "/quote") {
      let body;
      try {
        body = await request.json();
      } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      }

      const p1Res = await fetch("https://api.priority1.com/v2/ltl/quotes/rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": env.P1_API_KEY,
        },
        body: JSON.stringify(body),
      });

      const data = await p1Res.text();
      return new Response(data, {
        status: p1Res.status,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    // POST /suggestedclass  →  P1 density-based class suggestion
    if (url.pathname === "/suggestedclass") {
      let body;
      try {
        body = await request.json();
      } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      }

      const p1Res = await fetch("https://api.priority1.com/v2/ltl/quotes/suggestedclass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": env.P1_API_KEY,
        },
        body: JSON.stringify(body),
      });

      const data = await p1Res.text();
      return new Response(data, {
        status: p1Res.status,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
