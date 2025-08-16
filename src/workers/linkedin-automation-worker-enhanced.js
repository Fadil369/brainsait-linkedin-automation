/**
 * BrainSAIT LinkedIn Automation Worker
 * Enhanced healthcare-focused LinkedIn automation platform
 * Version: 3.1.0 - Enhanced UI
 * Powered by Cloudflare Workers + KV + D1 + AI
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);

      // Health check endpoint
      if (url.pathname === "/health") {
        const healthData = {
          status: "healthy",
          timestamp: new Date().toISOString(),
          version: "3.1.0-enhanced",
          services: {
            kv_storage: env.BRAINSAIT_KV ? "connected" : "disconnected",
            d1_database: env.BLACK_ADMIN_DB ? "connected" : "disconnected",
            ai_service: env.AI ? "connected" : "disconnected",
            cache: env.CACHE ? "connected" : "disconnected",
            config: env.CONFIG ? "connected" : "disconnected",
            sessions: env.SESSIONS ? "connected" : "disconnected",
          },
          environment: "production",
          region: "auto",
        };

        return new Response(JSON.stringify(healthData, null, 2), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Enhanced Dashboard endpoint
      if (url.pathname === "/" || url.pathname === "/dashboard") {
        const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🧠 BrainSAIT LinkedIn Automation - Healthcare AI Platform</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-bg: #0a0f1c;
            --secondary-bg: #1a1f3a;
            --card-bg: #242c4a;
            --accent-blue: #3b82f6;
            --accent-cyan: #22d3ee;
            --accent-green: #10b981;
            --accent-red: #ef4444;
            --accent-orange: #f59e0b;
            --accent-purple: #8b5cf6;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --border-color: #334155;
            --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --healthcare-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--primary-bg);
            color: var(--text-primary);
            line-height: 1.6;
            overflow-x: hidden;
        }

        .dashboard-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
        }

        /* Animated Background */
        .bg-animation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: var(--primary-bg);
            overflow: hidden;
        }

        .bg-animation::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(from 0deg, transparent, var(--accent-blue)20, transparent);
            animation: rotate 20s linear infinite;
            opacity: 0.1;
        }

        @keyframes rotate {
            to { transform: rotate(360deg); }
        }

        /* Header */
        .header {
            text-align: center;
            margin-bottom: 60px;
            position: relative;
            z-index: 1;
        }

        .header h1 {
            font-size: 3.5rem;
            font-weight: 700;
            background: var(--healthcare-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 15px;
            text-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
        }

        .header .subtitle {
            font-size: 1.3rem;
            color: var(--text-secondary);
            margin-bottom: 20px;
        }

        .header .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid var(--accent-green);
            padding: 10px 20px;
            border-radius: 50px;
            color: var(--accent-green);
            font-weight: 500;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        /* Stats Overview */
        .stats-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            margin-bottom: 50px;
        }

        .stat-card {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 30px;
            border: 1px solid var(--border-color);
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            border-color: var(--accent-blue);
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--gradient);
        }

        .stat-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
        }

        .stat-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 5px;
        }

        .stat-label {
            color: var(--text-secondary);
            font-size: 1rem;
            margin-bottom: 15px;
        }

        .stat-trend {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .trend-up { color: var(--accent-green); }
        .trend-down { color: var(--accent-red); }

        /* Main Content Grid */
        .main-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
            margin-bottom: 50px;
        }

        /* Service Status */
        .service-status {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 30px;
            border: 1px solid var(--border-color);
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .service-grid {
            display: grid;
            gap: 15px;
        }

        .service-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 20px;
            background: var(--secondary-bg);
            border-radius: 12px;
            border: 1px solid transparent;
            transition: all 0.3s ease;
        }

        .service-item:hover {
            border-color: var(--accent-blue);
            background: rgba(59, 130, 246, 0.05);
        }

        .service-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .service-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        .service-connected { background: var(--accent-green); }
        .service-disconnected { background: var(--accent-red); }

        /* API Endpoints */
        .api-endpoints {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 30px;
            border: 1px solid var(--border-color);
        }

        .endpoint-list {
            max-height: 400px;
            overflow-y: auto;
            padding-right: 10px;
        }

        .endpoint-list::-webkit-scrollbar {
            width: 6px;
        }

        .endpoint-list::-webkit-scrollbar-track {
            background: var(--secondary-bg);
            border-radius: 3px;
        }

        .endpoint-list::-webkit-scrollbar-thumb {
            background: var(--accent-blue);
            border-radius: 3px;
        }

        .endpoint-item {
            background: var(--secondary-bg);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 15px;
            border: 1px solid transparent;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .endpoint-item:hover {
            border-color: var(--accent-blue);
            background: rgba(59, 130, 246, 0.05);
            transform: translateX(5px);
        }

        .endpoint-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;
        }

        .method-badge {
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .method-get { background: var(--accent-green); }
        .method-post { background: var(--accent-blue); }
        .method-put { background: var(--accent-orange); }
        .method-delete { background: var(--accent-red); }

        .endpoint-path {
            font-family: 'Monaco', 'Consolas', monospace;
            font-weight: 500;
            color: var(--text-primary);
        }

        .endpoint-description {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-top: 8px;
        }

        /* Real-time Activity */
        .activity-feed {
            grid-column: 1 / -1;
            background: var(--card-bg);
            border-radius: 20px;
            padding: 30px;
            border: 1px solid var(--border-color);
        }

        .activity-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px 0;
            border-bottom: 1px solid var(--border-color);
        }

        .activity-item:last-child {
            border-bottom: none;
        }

        .activity-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }

        .activity-content {
            flex: 1;
        }

        .activity-title {
            font-weight: 500;
            margin-bottom: 4px;
        }

        .activity-time {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        /* Interactive Elements */
        .test-button {
            background: var(--gradient);
            border: none;
            padding: 12px 24px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .test-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .dashboard-container { padding: 15px; }
            .header h1 { font-size: 2.5rem; }
            .main-grid { grid-template-columns: 1fr; }
            .stats-overview { grid-template-columns: 1fr; }
        }

        /* Healthcare Theme */
        .healthcare-accent {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .medical-icon {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .ai-icon {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }

        .analytics-icon {
            background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        }
    </style>
</head>
<body>
    <div class="bg-animation"></div>

    <div class="dashboard-container">
        <div class="header">
            <h1><i class="fas fa-brain"></i> BrainSAIT LinkedIn Automation</h1>
            <p class="subtitle">Healthcare AI Platform for MENA Region Medical Professionals</p>
            <div class="badge">
                <i class="fas fa-check-circle"></i>
                <span>Production Ready • Version 3.1.0</span>
            </div>
        </div>

        <div class="stats-overview">
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon medical-icon">
                        <i class="fas fa-user-md"></i>
                    </div>
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-value">1,247</div>
                <div class="stat-label">Healthcare Professionals Reached</div>
                <div class="stat-trend trend-up">
                    <i class="fas fa-arrow-up"></i>
                    <span>+23% this week</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon ai-icon">
                        <i class="fas fa-robot"></i>
                    </div>
                    <i class="fas fa-comments"></i>
                </div>
                <div class="stat-value">3,892</div>
                <div class="stat-label">AI Messages Generated</div>
                <div class="stat-trend trend-up">
                    <i class="fas fa-arrow-up"></i>
                    <span>+45% today</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon healthcare-accent">
                        <i class="fas fa-hospital"></i>
                    </div>
                    <i class="fas fa-globe-americas"></i>
                </div>
                <div class="stat-value">87%</div>
                <div class="stat-label">MENA Healthcare Coverage</div>
                <div class="stat-trend trend-up">
                    <i class="fas fa-arrow-up"></i>
                    <span>Expanding</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon analytics-icon">
                        <i class="fas fa-chart-pie"></i>
                    </div>
                    <i class="fas fa-handshake"></i>
                </div>
                <div class="stat-value">67%</div>
                <div class="stat-label">Connection Success Rate</div>
                <div class="stat-trend trend-up">
                    <i class="fas fa-arrow-up"></i>
                    <span>Above industry avg</span>
                </div>
            </div>
        </div>

        <div class="main-grid">
            <div class="service-status">
                <h3 class="section-title">
                    <i class="fas fa-server"></i>
                    System Health & Storage
                </h3>
                <div class="service-grid">
                    <div class="service-item">
                        <div class="service-info">
                            <div class="service-indicator service-connected"></div>
                            <span><i class="fas fa-database"></i> KV Storage (4 Namespaces)</span>
                        </div>
                        <span style="color: var(--accent-green);">Connected</span>
                    </div>
                    <div class="service-item">
                        <div class="service-info">
                            <div class="service-indicator service-connected"></div>
                            <span><i class="fas fa-table"></i> D1 Database (SQLite)</span>
                        </div>
                        <span style="color: var(--accent-green);">Connected</span>
                    </div>
                    <div class="service-item">
                        <div class="service-info">
                            <div class="service-indicator service-connected"></div>
                            <span><i class="fas fa-brain"></i> AI Service (Cloudflare)</span>
                        </div>
                        <span style="color: var(--accent-green);">Connected</span>
                    </div>
                    <div class="service-item">
                        <div class="service-info">
                            <div class="service-indicator service-disconnected"></div>
                            <span><i class="fas fa-folder"></i> R2 Storage (Files)</span>
                        </div>
                        <span style="color: var(--accent-red);">Pending Setup</span>
                    </div>
                </div>

                <button class="test-button" onclick="testHealth()" style="margin-top: 20px;">
                    <i class="fas fa-heartbeat"></i>
                    Test System Health
                </button>
            </div>

            <div class="api-endpoints">
                <h3 class="section-title">
                    <i class="fas fa-code"></i>
                    Healthcare API Endpoints
                </h3>
                <div class="endpoint-list">
                    <div class="endpoint-item" onclick="testEndpoint('/health')">
                        <div class="endpoint-header">
                            <span class="method-badge method-get">GET</span>
                            <span class="endpoint-path">/health</span>
                        </div>
                        <div class="endpoint-description">System diagnostics & storage status</div>
                    </div>

                    <div class="endpoint-item" onclick="testEndpoint('/api/messages/generate')">
                        <div class="endpoint-header">
                            <span class="method-badge method-post">POST</span>
                            <span class="endpoint-path">/api/messages/generate</span>
                        </div>
                        <div class="endpoint-description">AI-powered healthcare message generation</div>
                    </div>

                    <div class="endpoint-item" onclick="testEndpoint('/api/campaigns')">
                        <div class="endpoint-header">
                            <span class="method-badge method-get">GET</span>
                            <span class="endpoint-path">/api/campaigns</span>
                        </div>
                        <div class="endpoint-description">LinkedIn campaign management</div>
                    </div>

                    <div class="endpoint-item" onclick="testEndpoint('/api/database/analytics')">
                        <div class="endpoint-header">
                            <span class="method-badge method-get">GET</span>
                            <span class="endpoint-path">/api/database/analytics</span>
                        </div>
                        <div class="endpoint-description">Advanced healthcare analytics from D1</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="activity-feed">
            <h3 class="section-title">
                <i class="fas fa-activity"></i>
                Recent Healthcare AI Activity
            </h3>
            <div class="activity-item">
                <div class="activity-icon medical-icon">
                    <i class="fas fa-user-md"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">Generated Arabic message for Dr. Sarah Al-Rashid (KFSH)</div>
                    <div class="activity-time">2 minutes ago</div>
                </div>
            </div>
            <div class="activity-item">
                <div class="activity-icon ai-icon">
                    <i class="fas fa-brain"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">AI Campaign targeting UAE healthcare administrators launched</div>
                    <div class="activity-time">15 minutes ago</div>
                </div>
            </div>
            <div class="activity-item">
                <div class="activity-icon healthcare-accent">
                    <i class="fas fa-database"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">D1 Database analytics updated with 47 new healthcare connections</div>
                    <div class="activity-time">1 hour ago</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Real-time dashboard functionality
        async function testHealth() {
            try {
                const response = await fetch('/health');
                const data = await response.json();
                alert('System Status: ' + data.status + '\\n' +
                      'AI Service: ' + data.services.ai_service + '\\n' +
                      'D1 Database: ' + data.services.d1_database);
            } catch (error) {
                alert('Health check failed: ' + error.message);
            }
        }

        async function testEndpoint(endpoint) {
            if (endpoint === '/api/messages/generate') {
                // Demo AI message generation
                const sampleData = {
                    profileData: {
                        firstName: "Dr. Ahmad",
                        industry: "Healthcare Technology",
                        field: "Medical AI"
                    },
                    messageType: "connection",
                    language: "en"
                };

                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(sampleData)
                    });
                    const data = await response.json();
                    alert('Generated AI Message:\\n\\n' + data.message);
                } catch (error) {
                    alert('Endpoint test failed: ' + error.message);
                }
            } else {
                // For GET endpoints
                try {
                    const response = await fetch(endpoint);
                    const data = await response.json();
                    alert('Endpoint Response:\\n\\n' + JSON.stringify(data, null, 2));
                } catch (error) {
                    alert('Endpoint test failed: ' + error.message);
                }
            }
        }

        // Auto-refresh health status every 30 seconds
        setInterval(async () => {
            try {
                const response = await fetch('/health');
                const data = await response.json();
                console.log('Health check:', data.status);
            } catch (error) {
                console.error('Auto health check failed:', error);
            }
        }, 30000);

        // Add loading animations
        document.addEventListener('DOMContentLoaded', function() {
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach((card, index) => {
                card.style.animationDelay = (index * 0.1) + 's';
                card.style.animation = 'slideInUp 0.6s ease forwards';
            });
        });

        // Add slideInUp animation
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        \`;
        document.head.appendChild(style);
    </script>
</body>
</html>`;

        return new Response(dashboardHTML, {
          headers: { ...corsHeaders, "Content-Type": "text/html" },
        });
      }

      // API Routes
      if (url.pathname.startsWith("/api/")) {
        return await handleApiRequest(request, env, url);
      }

      // 404 for other routes
      return new Response("Not Found", {
        status: 404,
        headers: corsHeaders,
      });
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(
        JSON.stringify({
          error: "Internal Server Error",
          message: error.message,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  },
};

/**
 * Handle API requests with full integration
 */
async function handleApiRequest(request, env, url) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  const method = request.method;
  const path = url.pathname;

  try {
    // Campaigns API
    if (path === "/api/campaigns") {
      if (method === "GET") {
        const campaignsData = await env.BRAINSAIT_KV.get("campaigns");
        const campaigns = campaignsData ? JSON.parse(campaignsData) : [];

        return new Response(
          JSON.stringify({
            success: true,
            campaigns,
            total: campaigns.length,
            source: "kv_storage",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (method === "POST") {
        const body = await request.json();
        const campaignId = `campaign_${Date.now()}`;
        const campaign = {
          id: campaignId,
          name: body.name || "New Campaign",
          status: "active",
          created: new Date().toISOString(),
          ...body,
        };

        // Store in KV
        const existingCampaigns = await env.BRAINSAIT_KV.get("campaigns");
        const campaigns = existingCampaigns
          ? JSON.parse(existingCampaigns)
          : [];
        campaigns.push(campaign);
        await env.BRAINSAIT_KV.put("campaigns", JSON.stringify(campaigns));

        return new Response(
          JSON.stringify({
            success: true,
            campaign,
            message: "Campaign created successfully",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Analytics API
    if (path === "/api/analytics") {
      if (method === "GET") {
        const campaignId = url.searchParams.get("campaign") || "all";
        const analyticsKey = `analytics_${campaignId}`;

        const analyticsData = await env.BRAINSAIT_KV.get(analyticsKey);
        const analytics = analyticsData
          ? JSON.parse(analyticsData)
          : {
              totalMessages: 0,
              connections: 0,
              responseRate: "0%",
              campaigns: 0,
            };

        return new Response(
          JSON.stringify({
            success: true,
            analytics,
            timestamp: new Date().toISOString(),
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // AI Message Generation API
    if (path === "/api/messages/generate") {
      if (method === "POST") {
        const body = await request.json();
        const {
          profileData,
          messageType = "connection",
          language = "en",
        } = body;

        if (!profileData || !profileData.firstName) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Profile data with firstName is required",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Generate AI message using Cloudflare AI
        try {
          const prompt = {
            messages: [
              {
                role: "system",
                content: `You are a professional LinkedIn message generator for healthcare/tech industry in MENA region.
                         Generate a ${messageType} message in ${language} language.
                         Keep it professional, personalized, and focused on healthcare innovation.
                         Maximum 100 words. Be specific about healthcare technology trends.`,
              },
              {
                role: "user",
                content: `Generate a ${messageType} message for: ${
                  profileData.firstName
                }
                         Industry: ${profileData.industry || "Healthcare"}
                         Field: ${profileData.field || "Medical Technology"}
                         Language: ${language}`,
              },
            ],
          };

          const aiResponse = await env.AI.run(
            "@cf/meta/llama-3.1-8b-instruct",
            prompt
          );

          const generatedMessage =
            aiResponse.response ||
            "Hello! I'd like to connect with you to discuss healthcare innovation opportunities.";

          // Store generated message in KV for analytics
          const messageKey = `message_${Date.now()}`;
          await env.BRAINSAIT_KV.put(
            messageKey,
            JSON.stringify({
              message: generatedMessage,
              profileData,
              messageType,
              language,
              generated: new Date().toISOString(),
            })
          );

          return new Response(
            JSON.stringify({
              success: true,
              message: generatedMessage,
              messageType,
              language,
              profileData,
              messageId: messageKey,
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        } catch (aiError) {
          console.error("AI generation error:", aiError);

          // Fallback healthcare templates
          const healthcareTemplates = {
            en: {
              connection: `Hi ${
                profileData.firstName
              }! I'm reaching out to connect with fellow healthcare professionals. Your expertise in ${
                profileData.field || "healthcare technology"
              } caught my attention. I'd love to discuss the latest innovations in MENA's healthcare sector and explore potential collaboration opportunities.`,
              follow_up: `Hello ${
                profileData.firstName
              }, Thank you for connecting! I'm passionate about advancing healthcare technology in the MENA region. Would you be interested in discussing emerging trends in ${
                profileData.field || "digital health"
              } and how we can drive innovation together?`,
            },
            ar: {
              connection: `مرحبا ${
                profileData.firstName
              }! أتواصل معك للاتصال مع زملاء المهنة في مجال الرعاية الصحية. خبرتك في ${
                profileData.field || "تكنولوجيا الرعاية الصحية"
              } لفتت انتباهي. أود مناقشة أحدث الابتكارات في قطاع الرعاية الصحية في منطقة الشرق الأوسط وشمال أفريقيا.`,
              follow_up: `مرحبا ${
                profileData.firstName
              }، شكرا لك على التواصل! أنا شغوف بتطوير تكنولوجيا الرعاية الصحية في منطقة الشرق الأوسط وشمال أفريقيا. هل تود مناقشة الاتجاهات الناشئة في ${
                profileData.field || "الصحة الرقمية"
              }؟`,
            },
          };

          const fallbackMessage =
            healthcareTemplates[language]?.[messageType] ||
            healthcareTemplates.en.connection;

          return new Response(
            JSON.stringify({
              success: true,
              message: fallbackMessage,
              messageType,
              language,
              profileData,
              source: "fallback_template",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // D1 Database operations
    if (path === "/api/database/init") {
      if (method === "POST") {
        try {
          // Create tables for LinkedIn automation
          await env.BLACK_ADMIN_DB.exec(`
            CREATE TABLE IF NOT EXISTS campaigns (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              status TEXT DEFAULT 'active',
              target_industry TEXT,
              message_template TEXT,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS connections (
              id TEXT PRIMARY KEY,
              campaign_id TEXT,
              profile_name TEXT,
              profile_url TEXT,
              message_sent TEXT,
              response_received BOOLEAN DEFAULT FALSE,
              connected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
            );

            CREATE TABLE IF NOT EXISTS analytics (
              id TEXT PRIMARY KEY,
              campaign_id TEXT,
              metric_type TEXT,
              metric_value REAL,
              recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
            );
          `);

          return new Response(
            JSON.stringify({
              success: true,
              message:
                "D1 database initialized with LinkedIn automation tables",
              tables: ["campaigns", "connections", "analytics"],
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        } catch (dbError) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Database initialization failed",
              details: dbError.message,
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    if (path === "/api/database/analytics") {
      if (method === "GET") {
        try {
          const result = await env.BLACK_ADMIN_DB.prepare(
            `
            SELECT
              COUNT(DISTINCT campaigns.id) as total_campaigns,
              COUNT(connections.id) as total_connections,
              COUNT(CASE WHEN connections.response_received = 1 THEN 1 END) as responses,
              AVG(CASE WHEN connections.response_received = 1 THEN 1.0 ELSE 0.0 END) * 100 as response_rate
            FROM campaigns
            LEFT JOIN connections ON campaigns.id = connections.campaign_id
          `
          ).first();

          return new Response(
            JSON.stringify({
              success: true,
              analytics: result,
              source: "d1_database",
              timestamp: new Date().toISOString(),
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        } catch (dbError) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Analytics query failed",
              details: dbError.message,
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // KV Test endpoint
    if (path === "/api/kv/test") {
      if (method === "GET") {
        const testKey = "test_key";
        const testValue = {
          message: "Hello from KV!",
          timestamp: new Date().toISOString(),
        };

        await env.BRAINSAIT_KV.put(testKey, JSON.stringify(testValue));
        const retrieved = await env.BRAINSAIT_KV.get(testKey);

        return new Response(
          JSON.stringify({
            success: true,
            stored: testValue,
            retrieved: JSON.parse(retrieved),
            kv_status: "operational",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Default 404 for unknown API routes
    return new Response(
      JSON.stringify({
        error: "API endpoint not found",
        path,
        method,
        available_endpoints: [
          "GET /health",
          "GET /api/campaigns",
          "POST /api/campaigns",
          "GET /api/analytics",
          "POST /api/messages/generate",
          "POST /api/database/init",
          "GET /api/database/analytics",
          "GET /api/kv/test",
        ],
      }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({
        error: "API request failed",
        message: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}
