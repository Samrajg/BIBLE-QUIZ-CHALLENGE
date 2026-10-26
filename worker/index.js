/**
 * Cloudflare Worker Entrypoint
 * Routes incoming HTTP and WebSocket requests to the appropriate Durable Object instance.
 * Supports:
 * - WebSocket upgrade at /ws?event={eventId}
 * - POST /api/submit-score (with payload validation & anti-tamper checking)
 * - GET /api/leaderboard?event={eventId}
 * - POST /api/admin/event-control (Start, Close, Reset - protected with ADMIN_API_KEY)
 */

import { LeaderboardDurableObject } from "./leaderboard-do.js";

export { LeaderboardDurableObject };

function corsHeaders(origin = "*") {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Event-Id",
    "Access-Control-Max-Age": "86400",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": "default-src 'self'; connect-src 'self' wss: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob:;"
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(env.CORS_ORIGIN || "*"),
      });
    }

    // Health check
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "healthy", timestamp: Date.now() }), {
        headers: { "Content-Type": "application/json", ...corsHeaders(env.CORS_ORIGIN || "*") }
      });
    }

    // Resolve eventId (default: "default-event")
    const eventId = url.searchParams.get("event") || request.headers.get("X-Event-Id") || "default-event";
    const sanitizedEventId = eventId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "default-event";

    // Obtain the Durable Object stub for this specific event
    const id = env.LEADERBOARD_DO.idFromName(sanitizedEventId);
    const stub = env.LEADERBOARD_DO.get(id);

    // Forward request directly to the Durable Object instance
    const response = await stub.fetch(request);

    // Inject CORS headers on response if not already present
    const newHeaders = new Headers(response.headers);
    const existingCors = newHeaders.get("Access-Control-Allow-Origin");
    if (!existingCors) {
      newHeaders.set("Access-Control-Allow-Origin", env.CORS_ORIGIN || "*");
      newHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      newHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Event-Id");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};
