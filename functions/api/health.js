export async function onRequestGet({ env }) {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "3.1.0-enhanced",
    services: {
      kv_storage: env.BRAINSAIT_KV ? "connected" : "disconnected",
      d1_database: env.BLACK_ADMIN_DB ? "connected" : "disconnected",
      ai_service: env.AI ? "connected" : "disconnected",
      cache: env.BRAINSAIT_CACHE ? "connected" : "disconnected",
      config: env.BRAINSAIT_CONFIG ? "connected" : "disconnected",
      sessions: env.SESSIONS ? "connected" : "disconnected",
    },
    environment: env.ENVIRONMENT || "pages",
  };

  return new Response(JSON.stringify(health, null, 2), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}
