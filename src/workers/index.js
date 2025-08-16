// Cloudflare Workers entry point for BrainSAIT LinkedIn Automation

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  },

  async scheduled(event, env, ctx) {
    return handleScheduledEvent(event, env, ctx);
  },
};

async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let response;

    if (path.startsWith("/api/")) {
      response = await handleAPIRequest(request, env, path);
    } else if (path === "/webhook/linkedin") {
      response = await handleLinkedInWebhook(request, env);
    } else if (path === "/health") {
      response = await handleHealthCheck(env);
    } else {
      response = new Response("Not Found", { status: 404 });
    }

    // Add CORS headers to response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("Worker error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
}

async function handleAPIRequest(request, env, path) {
  const segments = path.split("/").filter(Boolean);
  const apiVersion = segments[1]; // api
  const resource = segments[2];
  const action = segments[3];

  if (apiVersion !== "v1") {
    return new Response(
      JSON.stringify({ error: "API version not supported" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  switch (resource) {
    case "campaigns":
      return await handleCampaignRequest(request, env, action);
    case "messages":
      return await handleMessageRequest(request, env, action);
    case "analytics":
      return await handleAnalyticsRequest(request, env, action);
    case "accounts":
      return await handleAccountRequest(request, env, action);
    default:
      return new Response(JSON.stringify({ error: "Resource not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
  }
}

async function handleCampaignRequest(request, env, action) {
  switch (request.method) {
    case "POST":
      return await createCampaign(request, env);
    case "GET":
      return await getCampaigns(request, env);
    case "PUT":
      return await updateCampaign(request, env, action);
    case "DELETE":
      return await deleteCampaign(request, env, action);
    default:
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
  }
}

async function createCampaign(request, env) {
  try {
    const body = await request.json();
    const { name, targetCriteria, messageTemplate, accountIds } = body;

    // Validate input
    if (!name || !targetCriteria || !messageTemplate || !accountIds) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate campaign ID
    const campaignId = generateId();

    // Create campaign object
    const campaign = {
      id: campaignId,
      name,
      targetCriteria,
      messageTemplate,
      accountIds,
      status: "active",
      createdAt: new Date().toISOString(),
      metrics: {
        sent: 0,
        accepted: 0,
        replied: 0,
        leads: 0,
      },
    };

    // Store in KV
    await env.SESSIONS.put(`campaign:${campaignId}`, JSON.stringify(campaign));

    // Add to action queue
    const queueId = env.ACTION_QUEUE.idFromName("default");
    const queueStub = env.ACTION_QUEUE.get(queueId);
    await queueStub.fetch(
      new Request("https://worker/enqueue", {
        method: "POST",
        body: JSON.stringify({
          type: "campaign",
          campaignId,
          data: campaign,
        }),
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        campaignId,
        campaign,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to create campaign",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function handleMessageRequest(request, env, action) {
  if (action === "generate" && request.method === "POST") {
    return await generateMessage(request, env);
  }

  return new Response(JSON.stringify({ error: "Invalid message action" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

async function generateMessage(request, env) {
  try {
    const body = await request.json();
    const { profileData, messageType = "connection", language = "en" } = body;

    if (!profileData) {
      return new Response(
        JSON.stringify({
          error: "Profile data is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Use Cloudflare AI to generate message
    const aiResponse = await env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [
        {
          role: "system",
          content: `You are a professional LinkedIn message generator for healthcare/tech industry.
                    Generate a ${messageType} message in ${language} language.
                    Keep it under 300 characters, professional, and personalized.
                    Context: BrainSAIT provides AI-powered healthcare solutions.`,
        },
        {
          role: "user",
          content: `Generate a LinkedIn ${messageType} message for this profile: ${JSON.stringify(
            profileData
          )}`,
        },
      ],
    });

    const generatedMessage = aiResponse.response;

    // Store generation analytics
    await env.ANALYTICS.put(
      `message_generation:${Date.now()}`,
      JSON.stringify({
        profileData,
        messageType,
        language,
        generatedMessage,
        timestamp: new Date().toISOString(),
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: generatedMessage,
        messageType,
        language,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to generate message",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function handleAnalyticsRequest(request, env, period) {
  try {
    const analytics = await getAnalytics(env, period);

    return new Response(
      JSON.stringify({
        success: true,
        data: analytics,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch analytics",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function getAnalytics(env, period = "24h") {
  const now = Date.now();
  const periodMs = {
    "1h": 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };

  const timeRange = periodMs[period] || periodMs["24h"];
  const startTime = now - timeRange;

  // Fetch analytics data from KV store
  const listResult = await env.ANALYTICS.list({
    prefix: "message_generation:",
  });

  let totalGenerated = 0;
  let byLanguage = {};
  let byType = {};

  for (const key of listResult.keys) {
    const timestamp = parseInt(key.name.split(":")[1]);
    if (timestamp >= startTime) {
      const data = JSON.parse(await env.ANALYTICS.get(key.name));
      totalGenerated++;

      byLanguage[data.language] = (byLanguage[data.language] || 0) + 1;
      byType[data.messageType] = (byType[data.messageType] || 0) + 1;
    }
  }

  return {
    period,
    totalGenerated,
    byLanguage,
    byType,
    timeRange: {
      start: new Date(startTime).toISOString(),
      end: new Date(now).toISOString(),
    },
  };
}

async function handleScheduledEvent(event, env, ctx) {
  console.log("Scheduled event triggered:", event.scheduledTime);

  try {
    // Process automation queue
    const queueId = env.ACTION_QUEUE.idFromName("default");
    const queueStub = env.ACTION_QUEUE.get(queueId);

    await queueStub.fetch(
      new Request("https://worker/process", {
        method: "POST",
      })
    );

    // Update analytics
    await updateAnalytics(env);

    console.log("Scheduled event completed successfully");
  } catch (error) {
    console.error("Scheduled event error:", error);
  }
}

async function updateAnalytics(env) {
  const timestamp = new Date().toISOString();

  // Store scheduled run analytics
  await env.ANALYTICS.put(
    `scheduled_run:${Date.now()}`,
    JSON.stringify({
      timestamp,
      status: "completed",
    })
  );
}

async function handleHealthCheck(env) {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: "cloudflare-workers",
    version: "1.0.0",
    services: {
      kv: "healthy",
      durableObjects: "healthy",
      ai: "healthy",
    },
  };

  return new Response(JSON.stringify(health), {
    headers: { "Content-Type": "application/json" },
  });
}

function generateId() {
  return crypto.randomUUID();
}

// Durable Object for LinkedIn Sessions
export class LinkedInSession {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sessions = new Map();
  }

  async fetch(request) {
    const url = new URL(request.url);

    switch (url.pathname) {
      case "/create":
        return await this.createSession(request);
      case "/get":
        return await this.getSession(request);
      case "/update":
        return await this.updateSession(request);
      case "/delete":
        return await this.deleteSession(request);
      default:
        return new Response("Not Found", { status: 404 });
    }
  }

  async createSession(request) {
    const body = await request.json();
    const { accountId, sessionData } = body;

    this.sessions.set(accountId, {
      ...sessionData,
      createdAt: Date.now(),
      lastActivity: Date.now(),
    });

    await this.state.storage.put(
      `session:${accountId}`,
      this.sessions.get(accountId)
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  async getSession(request) {
    const url = new URL(request.url);
    const accountId = url.searchParams.get("accountId");

    let session = this.sessions.get(accountId);
    if (!session) {
      session = await this.state.storage.get(`session:${accountId}`);
      if (session) {
        this.sessions.set(accountId, session);
      }
    }

    return new Response(JSON.stringify({ session }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Durable Object for Action Queue
export class ActionQueue {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.queue = [];
  }

  async fetch(request) {
    const url = new URL(request.url);

    switch (url.pathname) {
      case "/enqueue":
        return await this.enqueue(request);
      case "/process":
        return await this.process(request);
      case "/status":
        return await this.getStatus(request);
      default:
        return new Response("Not Found", { status: 404 });
    }
  }

  async enqueue(request) {
    const body = await request.json();

    const queueItem = {
      id: generateId(),
      ...body,
      enqueuedAt: Date.now(),
      status: "pending",
    };

    this.queue.push(queueItem);
    await this.state.storage.put("queue", this.queue);

    return new Response(JSON.stringify({ success: true, id: queueItem.id }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  async process(request) {
    if (!this.queue.length) {
      const storedQueue = await this.state.storage.get("queue");
      this.queue = storedQueue || [];
    }

    const processed = [];
    const remaining = [];

    for (const item of this.queue) {
      if (item.status === "pending") {
        // Process the item (simulate processing)
        item.status = "processed";
        item.processedAt = Date.now();
        processed.push(item);
      } else {
        remaining.push(item);
      }
    }

    this.queue = remaining;
    await this.state.storage.put("queue", this.queue);

    return new Response(
      JSON.stringify({
        processed: processed.length,
        remaining: remaining.length,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
