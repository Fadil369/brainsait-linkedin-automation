// BrainSAIT LinkedIn Automation Dashboard JavaScript

class LinkedInDashboard {
  constructor() {
    this.apiBase = "/api/v1";
    this.wsConnection = null;
    this.charts = {};
    this.currentLanguage = "en";

    this.init();
  }

  async init() {
    console.log("🚀 Initializing BrainSAIT LinkedIn Dashboard...");

    this.setupEventListeners();
    this.setupWebSocket();
    this.updateTime();
    await this.loadInitialData();
    this.setupCharts();

    // Update data every 30 seconds
    setInterval(() => this.refreshData(), 30000);

    console.log("✅ Dashboard initialized successfully");
  }

  setupEventListeners() {
    // Modal controls
    document
      .getElementById("create-campaign-btn")
      .addEventListener("click", () => {
        this.showModal("campaign-modal");
      });

    document.getElementById("close-modal").addEventListener("click", () => {
      this.hideModal("campaign-modal");
    });

    document.getElementById("cancel-campaign").addEventListener("click", () => {
      this.hideModal("campaign-modal");
    });

    // Campaign form
    document.getElementById("campaign-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.createCampaign();
    });

    // Language toggle
    document
      .getElementById("language-select")
      .addEventListener("change", (e) => {
        this.changeLanguage(e.target.value);
      });

    // Quick actions
    this.setupQuickActions();
  }

  setupQuickActions() {
    const quickActions = document.querySelectorAll(".card button");
    quickActions.forEach((button) => {
      button.addEventListener("click", (e) => {
        const action = this.getActionFromButton(e.target);
        this.handleQuickAction(action);
      });
    });
  }

  getActionFromButton(button) {
    const text = button.textContent.toLowerCase();
    if (text.includes("start")) return "start";
    if (text.includes("pause")) return "pause";
    if (text.includes("export")) return "export";
    if (text.includes("insights")) return "insights";
    return "unknown";
  }

  setupWebSocket() {
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${window.location.host}/ws`;

    try {
      this.wsConnection = new WebSocket(wsUrl);

      this.wsConnection.onopen = () => {
        console.log("🔌 WebSocket connected");
        this.updateSystemStatus("Online");
      };

      this.wsConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      };

      this.wsConnection.onclose = () => {
        console.log("🔌 WebSocket disconnected");
        this.updateSystemStatus("Offline");

        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.setupWebSocket(), 5000);
      };

      this.wsConnection.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.updateSystemStatus("Error");
      };
    } catch (error) {
      console.error("Failed to setup WebSocket:", error);
      this.updateSystemStatus("Offline");
    }
  }

  handleWebSocketMessage(data) {
    switch (data.type) {
      case "metrics_update":
        this.updateMetrics(data.payload);
        break;
      case "campaign_update":
        this.updateCampaign(data.payload);
        break;
      case "account_status":
        this.updateAccountHealth(data.payload);
        break;
      case "notification":
        this.showNotification(data.payload);
        break;
    }
  }

  async loadInitialData() {
    try {
      // Load metrics
      const metricsResponse = await fetch(`${this.apiBase}/analytics/24h`);
      const metricsData = await metricsResponse.json();

      if (metricsData.success) {
        this.updateMetrics(metricsData.data);
      }

      // Load campaigns
      const campaignsResponse = await fetch(`${this.apiBase}/campaigns`);
      const campaignsData = await campaignsResponse.json();

      if (campaignsData.success) {
        this.updateCampaignsList(campaignsData.data);
      }

      // Load account health
      const accountsResponse = await fetch(`${this.apiBase}/accounts`);
      const accountsData = await accountsResponse.json();

      if (accountsData.success) {
        this.updateAccountHealth(accountsData.data);
      }
    } catch (error) {
      console.error("Failed to load initial data:", error);
      this.showNotification({
        type: "error",
        message: "Failed to load dashboard data",
      });
    }
  }

  updateMetrics(metrics) {
    // Update metric cards
    const elements = {
      "active-campaigns": metrics.activeCampaigns || 0,
      "messages-sent": metrics.messagesSent || 0,
      "response-rate": `${metrics.responseRate || 0}%`,
      "leads-generated": metrics.leadsGenerated || 0,
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;

        // Add animation effect
        element.classList.add("animate-pulse");
        setTimeout(() => element.classList.remove("animate-pulse"), 1000);
      }
    });

    // Update charts
    if (this.charts.messageChart) {
      this.updateMessageChart(metrics.chartData);
    }
  }

  updateCampaignsList(campaigns) {
    const container = document.getElementById("campaigns-list");
    if (!container) return;

    container.innerHTML = "";

    campaigns.forEach((campaign) => {
      const campaignElement = this.createCampaignElement(campaign);
      container.appendChild(campaignElement);
    });
  }

  createCampaignElement(campaign) {
    const div = document.createElement("div");
    div.className = "bg-gray-50 rounded-lg p-4 border border-gray-200";

    const statusColor =
      {
        active: "text-green-600",
        paused: "text-yellow-600",
        completed: "text-blue-600",
        error: "text-red-600",
      }[campaign.status] || "text-gray-600";

    div.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-gray-800">${campaign.name}</h4>
                <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColor} bg-opacity-20">
                    ${campaign.status}
                </span>
            </div>
            <div class="grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                    <span class="block font-medium">Sent</span>
                    <span>${campaign.metrics.sent}</span>
                </div>
                <div>
                    <span class="block font-medium">Accepted</span>
                    <span>${campaign.metrics.accepted}</span>
                </div>
                <div>
                    <span class="block font-medium">Leads</span>
                    <span>${campaign.metrics.leads}</span>
                </div>
            </div>
            <div class="flex space-x-2 mt-3">
                <button onclick="dashboard.pauseCampaign('${campaign.id}')" class="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700">
                    Pause
                </button>
                <button onclick="dashboard.editCampaign('${campaign.id}')" class="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                    Edit
                </button>
                <button onclick="dashboard.deleteCampaign('${campaign.id}')" class="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    Delete
                </button>
            </div>
        `;

    return div;
  }

  updateAccountHealth(accounts) {
    const container = document.getElementById("account-health");
    if (!container) return;

    container.innerHTML = "";

    accounts.forEach((account) => {
      const healthElement = this.createAccountHealthElement(account);
      container.appendChild(healthElement);
    });
  }

  createAccountHealthElement(account) {
    const div = document.createElement("div");
    div.className =
      "flex items-center justify-between p-3 bg-gray-50 rounded-lg";

    const healthColor =
      {
        excellent: "text-green-600",
        good: "text-yellow-600",
        needs_attention: "text-red-600",
      }[account.status] || "text-gray-600";

    div.innerHTML = `
            <div>
                <span class="font-medium text-gray-800">${
                  account.name || account.accountId
                }</span>
                <span class="block text-sm text-gray-600">Health Score: ${
                  account.healthScore
                }%</span>
            </div>
            <div class="text-right">
                <span class="block ${healthColor} font-medium">${
      account.status
    }</span>
                <span class="text-xs text-gray-500">${
                  account.isOnline ? "Online" : "Offline"
                }</span>
            </div>
        `;

    return div;
  }

  setupCharts() {
    // Message Performance Chart
    const ctx = document.getElementById("messageChart");
    if (ctx) {
      this.charts.messageChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Messages Sent",
              data: [],
              borderColor: "rgb(99, 102, 241)",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              tension: 0.4,
            },
            {
              label: "Responses",
              data: [],
              borderColor: "rgb(34, 197, 94)",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    }
  }

  updateMessageChart(chartData) {
    if (!this.charts.messageChart || !chartData) return;

    this.charts.messageChart.data.labels = chartData.labels || [];
    this.charts.messageChart.data.datasets[0].data =
      chartData.messagesSent || [];
    this.charts.messageChart.data.datasets[1].data = chartData.responses || [];
    this.charts.messageChart.update();
  }

  async createCampaign() {
    const formData = {
      name: document.getElementById("campaign-name").value,
      targetCriteria: {
        industry: document.getElementById("target-industry").value,
      },
      messageTemplate: document.getElementById("message-template").value,
      accountIds: [], // This would be populated from account selection
    };

    try {
      const response = await fetch(`${this.apiBase}/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        this.showNotification({
          type: "success",
          message: "Campaign created successfully!",
        });

        this.hideModal("campaign-modal");
        document.getElementById("campaign-form").reset();

        // Refresh campaigns list
        await this.refreshData();
      } else {
        throw new Error(result.error || "Failed to create campaign");
      }
    } catch (error) {
      console.error("Failed to create campaign:", error);
      this.showNotification({
        type: "error",
        message: "Failed to create campaign: " + error.message,
      });
    }
  }

  async handleQuickAction(action) {
    console.log(`Executing quick action: ${action}`);

    switch (action) {
      case "start":
        await this.startAutomation();
        break;
      case "pause":
        await this.pauseAutomation();
        break;
      case "export":
        await this.exportData();
        break;
      case "insights":
        await this.showAIInsights();
        break;
    }
  }

  async startAutomation() {
    this.showNotification({
      type: "info",
      message: "Starting automation...",
    });

    // Implementation for starting automation
  }

  async pauseAutomation() {
    this.showNotification({
      type: "info",
      message: "Pausing all automation...",
    });

    // Implementation for pausing automation
  }

  async exportData() {
    this.showNotification({
      type: "info",
      message: "Preparing data export...",
    });

    // Implementation for data export
  }

  async showAIInsights() {
    this.showNotification({
      type: "info",
      message: "Generating AI insights...",
    });

    // Implementation for AI insights
  }

  changeLanguage(language) {
    this.currentLanguage = language;

    if (language === "ar") {
      document.body.classList.add("rtl-support");
      this.translateToArabic();
    } else {
      document.body.classList.remove("rtl-support");
      this.translateToEnglish();
    }
  }

  translateToArabic() {
    // Basic Arabic translations
    const translations = {
      "BrainSAIT LinkedIn Automation": "منصة برين سايت لأتمتة لينكد إن",
      "Healthcare-Focused AI Platform": "منصة ذكية متخصصة في الرعاية الصحية",
      "Active Campaigns": "الحملات النشطة",
      "Messages Sent": "الرسائل المرسلة",
      "Response Rate": "معدل الاستجابة",
      "Leads Generated": "العملاء المحتملون",
    };

    // Apply translations (simplified implementation)
    Object.entries(translations).forEach(([english, arabic]) => {
      const elements = document.querySelectorAll("*");
      elements.forEach((element) => {
        if (element.textContent === english) {
          element.textContent = arabic;
        }
      });
    });
  }

  translateToEnglish() {
    // Restore English text (would need more sophisticated implementation)
    location.reload(); // Simple solution for demo
  }

  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("hidden");
    }
  }

  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("hidden");
    }
  }

  showNotification(notification) {
    // Create notification element
    const notifDiv = document.createElement("div");
    notifDiv.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
      notification.type === "success"
        ? "bg-green-600 text-white"
        : notification.type === "error"
        ? "bg-red-600 text-white"
        : notification.type === "warning"
        ? "bg-yellow-600 text-white"
        : "bg-blue-600 text-white"
    }`;

    notifDiv.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>${notification.message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    document.body.appendChild(notifDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notifDiv.parentNode) {
        notifDiv.remove();
      }
    }, 5000);
  }

  updateSystemStatus(status) {
    const statusElement = document.getElementById("system-status");
    if (statusElement) {
      statusElement.textContent = status;
      statusElement.className = `font-semibold ${
        status === "Online"
          ? "text-green-600"
          : status === "Offline"
          ? "text-red-600"
          : "text-yellow-600"
      }`;
    }
  }

  updateTime() {
    const timeElement = document.getElementById("current-time");
    if (timeElement) {
      const now = new Date();
      const riyadhTime = now.toLocaleString("en-US", {
        timeZone: "Asia/Riyadh",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      timeElement.textContent = riyadhTime + " RST";
    }
  }

  async refreshData() {
    try {
      await this.loadInitialData();
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
  }

  // Campaign management methods
  async pauseCampaign(campaignId) {
    try {
      const response = await fetch(`${this.apiBase}/campaigns/${campaignId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paused" }),
      });

      if (response.ok) {
        this.showNotification({
          type: "success",
          message: "Campaign paused successfully",
        });
        await this.refreshData();
      }
    } catch (error) {
      this.showNotification({
        type: "error",
        message: "Failed to pause campaign",
      });
    }
  }

  async editCampaign(campaignId) {
    // Implementation for editing campaign
    this.showNotification({
      type: "info",
      message: "Edit campaign functionality coming soon!",
    });
  }

  async deleteCampaign(campaignId) {
    if (confirm("Are you sure you want to delete this campaign?")) {
      try {
        const response = await fetch(
          `${this.apiBase}/campaigns/${campaignId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          this.showNotification({
            type: "success",
            message: "Campaign deleted successfully",
          });
          await this.refreshData();
        }
      } catch (error) {
        this.showNotification({
          type: "error",
          message: "Failed to delete campaign",
        });
      }
    }
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.dashboard = new LinkedInDashboard();
});

// Update time every minute
setInterval(() => {
  if (window.dashboard) {
    window.dashboard.updateTime();
  }
}, 60000);
