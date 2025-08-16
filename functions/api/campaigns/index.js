export async function onRequest({ request, env }) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  const url = new URL(request.url);
  if (request.method === "GET") {
    const data = await env.BRAINSAIT_KV?.get("campaigns");
    const campaigns = data ? JSON.parse(data) : [];
    return new Response(JSON.stringify({ success: true, campaigns }), {
      headers: { ...cors, "Content-Type": "application/json" }
    });
  }

  if (request.method === "POST") {
    const body = await request.json();
    const id = `campaign_${Date.now()}`;
    const campaign = { id, name: body.name || "New Campaign", status: body.status || "active", created: new Date().toISOString(), ...body };

    const existing = await env.BRAINSAIT_KV?.get("campaigns");
    const list = existing ? JSON.parse(existing) : [];
    list.push(campaign);
    await env.BRAINSAIT_KV?.put("campaigns", JSON.stringify(list));

    return new Response(JSON.stringify({ success: true, campaign }), {
      headers: { ...cors, "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), { status: 405, headers: { ...cors, "Content-Type": "application/json" } });
}
