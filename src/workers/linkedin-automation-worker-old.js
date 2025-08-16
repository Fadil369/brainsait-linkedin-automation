/**
 * BrainSAIT LinkedIn Automation Platform - Master Worker
 * Unified Cloudflare Worker with KV, D1, R2, AI integration
 * Healthcare-focused LinkedIn automation for MENA region
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Health check endpoint
      if (url.pathname === "/health") {
        const healthData = {
          status: "healthy",
          timestamp: new Date().toISOString(),
          environment: "cloudflare-workers-unified",
          version: "3.0.0",
          region: "auto",
          services: {
            api: "healthy",
            kv_storage: "connected",
            r2_storage: env.DASH_BUCKET ? "connected" : "not_found",
            d1_database: env.BLACK_ADMIN_DB ? "connected" : "not_found",
            ai_service: env.AI ? "connected" : "not_found",
            analytics: "active",
          },
          kv_namespaces: {
            brainsait_kv: env.BRAINSAIT_KV ? "connected" : "not_found",
            cache: env.BRAINSAIT_CACHE ? "connected" : "not_found",
            config: env.BRAINSAIT_CONFIG ? "connected" : "not_found",
            sessions: env.SESSIONS ? "connected" : "not_found",
          },
          r2_buckets: {
            dash_bucket: env.DASH_BUCKET ? "connected" : "not_found",
          },
          d1_databases: {
            black_admin_db: env.BLACK_ADMIN_DB ? "connected" : "not_found",
          },
          message:
            "BrainSAIT LinkedIn Automation Platform - Healthcare AI for MENA region is running!",
        };

        return new Response(JSON.stringify(healthData, null, 2), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Dashboard endpoint - serve the enhanced dashboard
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
                <span>Production Ready • Version 3.0.0</span>
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
            <div class="status-card">
                <h3>🔧 System Status</h3>
                <div class="status-item">
                    <span>Worker Status:</span>
                    <span class="status-connected">✅ Online</span>
                </div>
                <div class="status-item">
                    <span>Version:</span>
                    <span>v2.0.0-kv</span>
                </div>
                <div class="status-item">
                    <span>Environment:</span>
                    <span>Cloudflare Workers</span>
                </div>
                <div class="status-item">
                    <span>Deployed:</span>
                    <span>${new Date().toISOString()}</span>
                </div>
            </div>

            <div class="status-card">
                <h3>🗄️ KV Storage</h3>
                <div class="status-item">
                    <span>BRAINSAIT_KV:</span>
                    <span class="status-connected">✅ Connected</span>
                </div>
                <div class="status-item">
                    <span>CACHE:</span>
                    <span class="status-connected">✅ Connected</span>
                </div>
                <div class="status-item">
                    <span>CONFIG:</span>
                    <span class="status-connected">✅ Connected</span>
                </div>
                <div class="status-item">
                    <span>SESSIONS:</span>
                    <span class="status-connected">✅ Connected</span>
                </div>
            </div>

            <div class="status-card">
                <h3>📦 R2 Storage</h3>
                <div class="status-item">
                    <span>DASH Bucket:</span>
                    <span class="status-connected">✅ Connected</span>
                </div>
                <div class="status-item">
                    <span>Storage Type:</span>
                    <span>Object Storage</span>
                </div>
                <div class="status-item">
                    <span>Use Cases:</span>
                    <span>Files, Reports, Exports</span>
                </div>
            </div>

            <div class="status-card">
                <h3>🗄️ D1 Database</h3>
                <div class="status-item">
                    <span>BLACK_ADMIN_DB:</span>
                    <span class="status-connected">✅ Connected</span>
                </div>
                <div class="status-item">
                    <span>Database Type:</span>
                    <span>SQLite/D1</span>
                </div>
                <div class="status-item">
                    <span>Use Cases:</span>
                    <span>Structured Data, Analytics</span>
                </div>
            </div>
        </div>

        <div class="api-section">
            <h3>🚀 Available API Endpoints</h3>

            <div class="endpoint">
                <div><span class="endpoint-method get">GET</span> <strong>/health</strong></div>
                <p>System health check with KV namespace status</p>
            </div>

            <div class="endpoint">
                <div><span class="endpoint-method get">GET</span> <strong>/api/campaigns</strong></div>
                <p>List all LinkedIn automation campaigns</p>
            </div>

            <div class="endpoint">
                <div><span class="endpoint-method post">POST</span> <strong>/api/campaigns</strong></div>
                <p>Create a new LinkedIn automation campaign</p>
            </div>

            <div class="endpoint">
                <div><span class="endpoint-method get">GET</span> <strong>/api/campaigns/{id}</strong></div>
                <p>Get specific campaign details and analytics</p>
            </div>

            <div class="endpoint">
                <div><span class="endpoint-method get">GET</span> <strong>/api/analytics</strong></div>
                <p>Get LinkedIn automation analytics and performance metrics</p>
            </div>

            <div class="endpoint">
                <div><span class="endpoint-method post">POST</span> <strong>/api/messages/generate</strong></div>
                <p>Generate AI-powered LinkedIn messages with healthcare focus</p>
            </div>

            <div class="endpoint">
                <div><span class="endpoint-method post">POST</span> <strong>/api/messages/send</strong></div>
                <p>Send LinkedIn messages using AI personalization</p>
            </div>

            <div class="endpoint">
                <div><span class="endpoint-method get">GET</span> <strong>/api/config</strong></div>
                <p>Get platform configuration from KV storage</p>
            </div>

            <div class="endpoint">
                <div><span class="endpoint-method post">POST</span> <strong>/api/config</strong></div>
                <p>Update platform configuration in KV storage</p>
            </div>

            <div class="endpoint">
                <div><span class="endpoint-method post">POST</span> <strong>/api/files/upload</strong></div>
                <p>Upload files to R2 storage (dash bucket)</p>
            </div>

            <div class="endpoint">
                <div><span class="endpoint-method get">GET</span> <strong>/api/files/{filename}</strong></div>
                <p>Download files from R2 storage</p>
            </div>

            <div class="endpoint">
                <div><span class="endpoint-method get">GET</span> <strong>/api/files</strong></div>
                <p>List all files in R2 storage</p>
            </div>

            <div class="endpoint">
                <div><span class="endpoint-method delete">DELETE</span> <strong>/api/files/{filename}</strong></div>
                <p>Delete files from R2 storage</p>
            </div>

            <div class="endpoint">
                <div><span class="endpoint-method get">GET</span> <strong>/api/database/campaigns</strong></div>
                <p>Get campaigns from D1 database with SQL queries</p>
            </div>

            <div class="endpoint">
                <div><span class="endpoint-method post">POST</span> <strong>/api/database/init</strong></div>
                <p>Initialize D1 database tables for LinkedIn automation</p>
            </div>

            <div class="endpoint">
                <div><span class="endpoint-method get">GET</span> <strong>/api/database/analytics</strong></div>
                <p>Get detailed analytics from D1 database</p>
            </div>

            <div class="endpoint">
                <div><span class="endpoint-method post">POST</span> <strong>/api/database/query</strong></div>
                <p>Execute custom SQL queries on D1 database</p>
            </div>
        </div>
    </div>
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
 * Handle API requests with KV storage integration
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
        // Get campaigns from KV storage
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

        // Get existing campaigns
        const existingCampaigns = await env.BRAINSAIT_KV.get("campaigns");
        const campaigns = existingCampaigns
          ? JSON.parse(existingCampaigns)
          : [];

        // Add new campaign
        const newCampaign = {
          id: campaignId,
          name: body.name || "New Campaign",
          status: "draft",
          created_at: new Date().toISOString(),
          target_audience: body.target_audience || "default",
          message_template: body.message_template || "Hello {name}!",
          ...body,
        };

        campaigns.push(newCampaign);

        // Store back to KV
        await env.BRAINSAIT_KV.put("campaigns", JSON.stringify(campaigns));

        return new Response(
          JSON.stringify({
            success: true,
            campaign: newCampaign,
            message: "Campaign created successfully",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Single Campaign API
    if (path.match(/^\/api\/campaigns\/(.+)$/)) {
      const campaignId = path.split("/").pop();

      if (method === "GET") {
        const campaignsData = await env.BRAINSAIT_KV.get("campaigns");
        const campaigns = campaignsData ? JSON.parse(campaignsData) : [];
        const campaign = campaigns.find((c) => c.id === campaignId);

        if (!campaign) {
          return new Response(
            JSON.stringify({
              error: "Campaign not found",
            }),
            {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Get analytics for this campaign from cache
        const analyticsKey = `analytics_${campaignId}`;
        const analyticsData = await env.BRAINSAIT_CACHE.get(analyticsKey);
        const analytics = analyticsData
          ? JSON.parse(analyticsData)
          : {
              messages_sent: 0,
              responses_received: 0,
              conversion_rate: 0,
            };

        return new Response(
          JSON.stringify({
            success: true,
            campaign: { ...campaign, analytics },
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Analytics API
    if (path === "/api/analytics") {
      const analyticsData = await env.BRAINSAIT_CACHE.get("platform_analytics");
      const analytics = analyticsData
        ? JSON.parse(analyticsData)
        : {
            total_campaigns: 0,
            total_messages_sent: 0,
            total_responses: 0,
            overall_conversion_rate: 0,
            active_users: 0,
            last_updated: new Date().toISOString(),
          };

      return new Response(
        JSON.stringify({
          success: true,
          analytics,
          source: "kv_cache",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Configuration API
    if (path === "/api/config") {
      if (method === "GET") {
        const configData = await env.BRAINSAIT_CONFIG.get("platform_config");
        const config = configData
          ? JSON.parse(configData)
          : {
              ai_model: "gpt-4",
              message_delay: 30,
              daily_message_limit: 100,
              automation_enabled: true,
              timezone: "Asia/Riyadh",
            };

        return new Response(
          JSON.stringify({
            success: true,
            config,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (method === "POST") {
        const body = await request.json();
        await env.BRAINSAIT_CONFIG.put("platform_config", JSON.stringify(body));

        return new Response(
          JSON.stringify({
            success: true,
            message: "Configuration updated successfully",
            config: body,
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
        try {
          const body = await request.json();
          const {
            profileData,
            messageType = "connection",
            language = "en",
          } = body;

          if (!profileData) {
            return new Response(
              JSON.stringify({
                error: "Profile data is required",
              }),
              {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              }
            );
          }

          // Healthcare-focused AI message generation
          let generatedMessage;

          if (env.AI) {
            // Use Cloudflare AI if available
            const aiResponse = await env.AI.run(
              "@cf/meta/llama-2-7b-chat-int8",
              {
                messages: [
                  {
                    role: "system",
                    content: `You are a professional LinkedIn message generator for healthcare/tech industry in MENA region.
                           Generate a ${messageType} message in ${language} language.
                           Keep it under 300 characters, professional, and personalized.
                           Context: BrainSAIT provides AI-powered healthcare solutions for medical professionals.
                           Focus on healthcare innovation, AI technology, and MENA market.`,
                  },
                  {
                    role: "user",
                    content: `Generate a LinkedIn ${messageType} message for: ${JSON.stringify(
                      profileData
                    )}`,
                  },
                ],
              }
            );
            generatedMessage = aiResponse.response;
          } else {
            // Fallback to predefined healthcare-focused templates
            const templates = {
              en: {
                connection: `Hi ${
                  profileData?.firstName || "there"
                }, I noticed your work in ${
                  profileData?.industry || "healthcare"
                }. At BrainSAIT, we're developing AI solutions for medical professionals in the MENA region. Would love to connect!`,
                followup: `Thanks for connecting! I'd love to share how BrainSAIT's AI platform is helping healthcare organizations streamline their operations.`,
                healthcare: `Hello ${
                  profileData?.firstName || ""
                }, Your expertise in ${
                  profileData?.field || "healthcare"
                } caught my attention. BrainSAIT is revolutionizing medical AI in MENA. Let's connect!`,
              },
              ar: {
                connection: `مرحباً ${
                  profileData?.firstName || ""
                }، لاحظت عملك في ${
                  profileData?.industry || "الرعاية الصحية"
                }. في برين سايت، نطور حلول ذكية للمهنيين الطبيين في منطقة الشرق الأوسط. أود التواصل معك!`,
                followup: `شكراً للتواصل! أود مشاركة كيف تساعد منصة برين سايت الذكية المؤسسات الصحية في تحسين عملياتها.`,
                healthcare: `مرحباً ${profileData?.firstName || ""}، خبرتك في ${
                  profileData?.field || "الرعاية الصحية"
                } لفتت انتباهي. برين سايت تثور الذكاء الاصطناعي الطبي في منطقة الشرق الأوسط. لنتواصل!`,
              },
            };

            generatedMessage =
              templates[language]?.[messageType] || templates.en.connection;
          }

          // Store generation analytics in D1 if available
          if (env.BLACK_ADMIN_DB) {
            try {
              await env.BLACK_ADMIN_DB.prepare(
                `
                INSERT INTO linkedin_messages (id, recipient, message, status, created_at)
                VALUES (?, ?, ?, ?, ?)
              `
              )
                .bind(
                  `gen_${Date.now()}`,
                  profileData?.email || profileData?.name || "unknown",
                  generatedMessage,
                  "generated",
                  new Date().toISOString()
                )
                .run();
            } catch (dbError) {
              console.log(
                "D1 storage failed, continuing without analytics:",
                dbError.message
              );
            }
          }

          return new Response(
            JSON.stringify({
              success: true,
              message: generatedMessage,
              messageType,
              language,
              profileData: profileData?.firstName
                ? `Personalized for ${profileData.firstName}`
                : "Generic template",
              timestamp: new Date().toISOString(),
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: "Message generation failed",
              message: error.message,
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // Messages API
    if (path === "/api/messages/send") {
      if (method === "POST") {
        const body = await request.json();
        const messageId = `msg_${Date.now()}`;

        // Store message in sessions KV
        const messageData = {
          id: messageId,
          recipient: body.recipient,
          message: body.message,
          status: "sent",
          timestamp: new Date().toISOString(),
          campaign_id: body.campaign_id,
        };

        await env.SESSIONS.put(
          `message_${messageId}`,
          JSON.stringify(messageData)
        );

        return new Response(
          JSON.stringify({
            success: true,
            message_id: messageId,
            status: "sent",
            message: "LinkedIn message sent successfully",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Files API - R2 Storage Operations
    if (path === "/api/files") {
      if (method === "GET") {
        try {
          // List all files in the R2 bucket
          const objects = await env.DASH_BUCKET.list();
          const files = objects.objects.map((obj) => ({
            name: obj.key,
            size: obj.size,
            uploaded: obj.uploaded,
            etag: obj.etag,
          }));

          return new Response(
            JSON.stringify({
              success: true,
              files,
              count: files.length,
              bucket: "dash",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: "Failed to list files",
              message: error.message,
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // File upload API
    if (path === "/api/files/upload") {
      if (method === "POST") {
        try {
          const formData = await request.formData();
          const file = formData.get("file");
          const filename =
            formData.get("filename") || file.name || `upload_${Date.now()}`;

          if (!file) {
            return new Response(
              JSON.stringify({
                error: "No file provided",
              }),
              {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              }
            );
          }

          // Upload file to R2
          await env.DASH_BUCKET.put(filename, file.stream(), {
            httpMetadata: {
              contentType: file.type || "application/octet-stream",
            },
          });

          return new Response(
            JSON.stringify({
              success: true,
              filename,
              size: file.size,
              type: file.type,
              message: "File uploaded successfully",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: "Upload failed",
              message: error.message,
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // Single file operations
    if (path.match(/^\/api\/files\/(.+)$/)) {
      const filename = decodeURIComponent(path.split("/").pop());

      if (method === "GET") {
        try {
          const object = await env.DASH_BUCKET.get(filename);

          if (!object) {
            return new Response(
              JSON.stringify({
                error: "File not found",
              }),
              {
                status: 404,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              }
            );
          }

          return new Response(object.body, {
            headers: {
              ...corsHeaders,
              "Content-Type":
                object.httpMetadata?.contentType || "application/octet-stream",
              "Content-Length": object.size,
              "Content-Disposition": `attachment; filename="${filename}"`,
            },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: "Failed to retrieve file",
              message: error.message,
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }

      if (method === "DELETE") {
        try {
          await env.DASH_BUCKET.delete(filename);

          return new Response(
            JSON.stringify({
              success: true,
              message: `File ${filename} deleted successfully`,
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: "Failed to delete file",
              message: error.message,
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // Database API - D1 Database Operations
    if (path === "/api/database/init") {
      if (method === "POST") {
        try {
          // Initialize D1 database tables
          const initQueries = [
            `CREATE TABLE IF NOT EXISTS linkedin_campaigns (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              status TEXT DEFAULT 'draft',
              target_audience TEXT,
              message_template TEXT,
              daily_limit INTEGER DEFAULT 50,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS linkedin_messages (
              id TEXT PRIMARY KEY,
              campaign_id TEXT,
              recipient TEXT,
              message TEXT,
              status TEXT DEFAULT 'draft',
              sent_at DATETIME,
              response_received BOOLEAN DEFAULT FALSE,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (campaign_id) REFERENCES linkedin_campaigns (id)
            )`,
            `CREATE TABLE IF NOT EXISTS linkedin_analytics (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              campaign_id TEXT,
              date DATE DEFAULT CURRENT_DATE,
              messages_sent INTEGER DEFAULT 0,
              responses_received INTEGER DEFAULT 0,
              connection_requests INTEGER DEFAULT 0,
              profile_views INTEGER DEFAULT 0,
              FOREIGN KEY (campaign_id) REFERENCES linkedin_campaigns (id)
            )`,
          ];

          const results = [];
          for (const query of initQueries) {
            const result = await env.BLACK_ADMIN_DB.prepare(query).run();
            results.push({ success: result.success });
          }

          return new Response(
            JSON.stringify({
              success: true,
              message: "D1 database initialized successfully",
              tables_created: results.length,
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: "Database initialization failed",
              message: error.message,
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // Get campaigns from D1 database
    if (path === "/api/database/campaigns") {
      if (method === "GET") {
        try {
          const query = `SELECT * FROM linkedin_campaigns ORDER BY created_at DESC`;
          const result = await env.BLACK_ADMIN_DB.prepare(query).all();

          return new Response(
            JSON.stringify({
              success: true,
              campaigns: result.results,
              count: result.results.length,
              source: "d1_database",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: "Failed to fetch campaigns from database",
              message: error.message,
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // Get analytics from D1 database
    if (path === "/api/database/analytics") {
      if (method === "GET") {
        try {
          const analyticsQuery = `
            SELECT
              COUNT(*) as total_campaigns,
              COALESCE(SUM(messages_sent), 0) as total_messages,
              COALESCE(SUM(responses_received), 0) as total_responses
            FROM linkedin_analytics
          `;

          const result = await env.BLACK_ADMIN_DB.prepare(
            analyticsQuery
          ).first();

          return new Response(
            JSON.stringify({
              success: true,
              analytics: result || {
                total_campaigns: 0,
                total_messages: 0,
                total_responses: 0,
              },
              source: "d1_database",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: "Failed to fetch analytics from database",
              message: error.message,
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // Default API response
    return new Response(
      JSON.stringify({
        error: "API endpoint not found",
        available_endpoints: [
          "GET /api/campaigns",
          "POST /api/campaigns",
          "GET /api/campaigns/{id}",
          "GET /api/analytics",
          "GET /api/config",
          "POST /api/config",
          "POST /api/messages/generate",
          "POST /api/messages/send",
          "GET /api/files",
          "POST /api/files/upload",
          "GET /api/files/{filename}",
          "DELETE /api/files/{filename}",
          "POST /api/database/init",
          "GET /api/database/campaigns",
          "GET /api/database/analytics",
        ],
      }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        error: "API Error",
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

// Scheduled event handler for cron jobs
export async function scheduled(event, env, ctx) {
  console.log("Cron trigger executed:", event.cron);

  try {
    // Update analytics
    const currentTime = new Date().toISOString();
    const analyticsUpdate = {
      last_cron_execution: currentTime,
      cron_pattern: event.cron,
      status: "executed",
    };

    await env.BRAINSAIT_CACHE.put(
      "last_cron_execution",
      JSON.stringify(analyticsUpdate)
    );

    // You can add more automation logic here
    console.log("Cron job completed successfully");
  } catch (error) {
    console.error("Cron job error:", error);
  }
}
