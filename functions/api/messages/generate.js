export async function onRequestPost({ request, env }) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  try {
    const body = await request.json();
    const { profileData, messageType = "connection", language = "en" } = body || {};

    if (!profileData || !profileData.firstName) {
      return new Response(JSON.stringify({ success: false, error: "Missing profileData.firstName" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    // Build prompt
    const prompt = {
      messages: [
        {
          role: "system",
          content: `You are a professional LinkedIn message generator for healthcare/tech industry in MENA region. Generate a ${messageType} message in ${language}. Max 100 words, professional and personalized.`
        },
        {
          role: "user",
          content: `Generate a ${messageType} message for ${profileData.firstName}. Industry: ${profileData.industry || "Healthcare"}. Field: ${profileData.field || "Medical Technology"}.`
        }
      ]
    };

    // Use Cloudflare AI binding if available
    let generatedMessage = "Hello! I'd like to connect regarding healthcare innovation in the MENA region.";
    if (env.AI && env.AI.run) {
      const aiRes = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", prompt);
      generatedMessage = aiRes.response || generatedMessage;
    }

    // Store sample analytics in KV when available
    if (env.BRAINSAIT_KV && env.BRAINSAIT_KV.put) {
      const key = `message_${Date.now()}`;
      await env.BRAINSAIT_KV.put(key, JSON.stringify({
        message: generatedMessage,
        profileData,
        messageType,
        language,
        created: new Date().toISOString()
      }));
    }

    return new Response(JSON.stringify({ success: true, message: generatedMessage }), {
      headers: { ...cors, "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
}
