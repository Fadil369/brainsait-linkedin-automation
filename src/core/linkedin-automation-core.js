import crypto from "crypto";
import { FingerprintGenerator } from "fingerprint-generator";
import fs from "fs/promises";
import path from "path";
import { chromium } from "playwright-extra";

export class LinkedInAutomationCore {
  constructor(config = {}) {
    this.config = {
      maxConcurrentSessions: 5,
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      headless: process.env.NODE_ENV === "production",
      ...config,
    };

    this.sessions = new Map();
    this.fingerprintGen = new FingerprintGenerator();
    this.cookieJars = new Map();
    this.antiDetection = config.antiDetection;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    console.log("🔧 Initializing LinkedIn Automation Core...");

    // Create sessions directory
    await this.ensureDirectoryExists("./sessions");
    await this.ensureDirectoryExists("./profiles");

    // Load existing sessions
    await this.loadSavedSessions();

    this.isInitialized = true;
    console.log("✅ LinkedIn Automation Core initialized");
  }

  async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  async createStealthBrowser(accountId) {
    console.log(`🌐 Creating stealth browser for account: ${accountId}`);

    // Generate or load existing fingerprint
    let fingerprint = await this.loadFingerprint(accountId);
    if (!fingerprint) {
      fingerprint = this.fingerprintGen.generate({
        browsers: ["chrome"],
        operatingSystems: ["macos", "windows"],
        devices: ["desktop"],
      });
      await this.saveFingerprint(accountId, fingerprint);
    }

    const browser = await chromium.launch({
      headless: this.config.headless,
      args: [
        "--disable-blink-features=AutomationControlled",
        `--user-agent=${fingerprint.userAgent}`,
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
        "--disable-dev-shm-usage",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        `--window-size=${fingerprint.screen.width},${fingerprint.screen.height}`,
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
      ],
    });

    const context = await browser.newContext({
      viewport: {
        width: fingerprint.screen.width,
        height: fingerprint.screen.height,
      },
      locale: "en-US",
      timezoneId: "Asia/Riyadh",
      permissions: ["geolocation"],
      geolocation: { latitude: 24.7136, longitude: 46.6753 }, // Riyadh coordinates
      userAgent: fingerprint.userAgent,
    });

    // Inject anti-detection scripts
    await context.addInitScript(() => {
      // Override navigator properties
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
      });

      Object.defineProperty(navigator, "plugins", {
        get: () => [1, 2, 3, 4, 5],
      });

      Object.defineProperty(navigator, "languages", {
        get: () => ["en-US", "en", "ar"],
      });

      // Override WebGL fingerprint
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function (parameter) {
        if (parameter === 37445) return "Intel Inc.";
        if (parameter === 37446) return "Intel Iris OpenGL Engine";
        return getParameter.apply(this, arguments);
      };

      // Override permissions
      const originalQuery = navigator.permissions.query;
      navigator.permissions.query = (parameters) =>
        parameters.name === "notifications"
          ? Promise.resolve({ state: Notification.permission })
          : originalQuery(parameters);

      // Hide automation indicators
      delete window.cdc_adoQpoasnfa76pfcZLmcfl_Array;
      delete window.cdc_adoQpoasnfa76pfcZLmcfl_Promise;
      delete window.cdc_adoQpoasnfa76pfcZLmcfl_Symbol;
    });

    return { browser, context, fingerprint };
  }

  async login(accountId, credentials) {
    console.log(`🔐 Logging in account: ${accountId}`);

    if (this.sessions.has(accountId)) {
      console.log(`✅ Account ${accountId} already logged in`);
      return this.sessions.get(accountId).page;
    }

    const { browser, context } = await this.createStealthBrowser(accountId);
    const page = await context.newPage();

    try {
      // Load existing cookies if available
      const savedCookies = await this.loadCookies(accountId);
      if (savedCookies) {
        await context.addCookies(savedCookies);
      }

      await page.goto("https://www.linkedin.com/login", {
        waitUntil: "networkidle",
      });

      // Check if already logged in
      const isLoggedIn = await this.checkLoginStatus(page);
      if (isLoggedIn) {
        console.log(`✅ Account ${accountId} already authenticated`);
        this.sessions.set(accountId, { page, context, browser });
        return page;
      }

      // Perform login
      await this.performLogin(page, credentials);

      // Save session
      const cookies = await context.cookies();
      await this.saveCookies(accountId, cookies);

      this.sessions.set(accountId, {
        page,
        context,
        browser,
        lastActivity: Date.now(),
      });

      console.log(`✅ Successfully logged in account: ${accountId}`);
      return page;
    } catch (error) {
      console.error(`❌ Login failed for account ${accountId}:`, error);
      await browser?.close();
      throw error;
    }
  }

  async performLogin(page, credentials) {
    // Human-like delay function
    const humanDelay = () => Math.floor(Math.random() * 2000) + 1000;

    // Wait for form elements
    await page.waitForSelector("#username", { timeout: 10000 });
    await page.waitForTimeout(humanDelay());

    // Type email with human-like patterns
    await this.typeHumanLike(page, "#username", credentials.email);
    await page.waitForTimeout(humanDelay());

    // Type password
    await this.typeHumanLike(page, "#password", credentials.password);
    await page.waitForTimeout(humanDelay());

    // Simulate mouse movement before clicking
    await this.simulateMouseMovement(page);

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForNavigation({ waitUntil: "networkidle" });

    // Handle potential security checks
    await this.handleSecurityChecks(page);
  }

  async typeHumanLike(page, selector, text) {
    await page.focus(selector);

    for (const char of text) {
      await page.keyboard.type(char, {
        delay: Math.random() * 150 + 50,
      });

      // Occasional pauses (simulate thinking)
      if (Math.random() < 0.1) {
        await page.waitForTimeout(Math.random() * 500 + 200);
      }
    }
  }

  async simulateMouseMovement(page) {
    const points = this.generateBezierPath();

    for (const point of points) {
      await page.mouse.move(point.x, point.y);
      await page.waitForTimeout(Math.random() * 50);
    }
  }

  generateBezierPath() {
    const points = [];
    const steps = 20;
    const startX = 100 + Math.random() * 200;
    const startY = 100 + Math.random() * 200;
    const endX = 400 + Math.random() * 200;
    const endY = 300 + Math.random() * 200;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x =
        Math.pow(1 - t, 3) * startX +
        3 * Math.pow(1 - t, 2) * t * (startX + 100) +
        3 * (1 - t) * Math.pow(t, 2) * (endX - 100) +
        Math.pow(t, 3) * endX;
      const y =
        Math.pow(1 - t, 3) * startY +
        3 * Math.pow(1 - t, 2) * t * (startY + 50) +
        3 * (1 - t) * Math.pow(t, 2) * (endY - 50) +
        Math.pow(t, 3) * endY;
      points.push({ x, y });
    }

    return points;
  }

  async handleSecurityChecks(page) {
    // Check for CAPTCHA or security verification
    const securitySelectors = [
      '[data-test-id="challenge-form"]',
      ".challenge-page",
      ".captcha",
      '[name="captcha"]',
    ];

    for (const selector of securitySelectors) {
      const element = await page.$(selector);
      if (element) {
        console.log(
          "⚠️ Security challenge detected. Manual intervention required."
        );
        // Implement manual intervention or CAPTCHA solving service
        await page.waitForTimeout(30000); // Wait for manual resolution
        break;
      }
    }
  }

  async checkLoginStatus(page) {
    try {
      // Check for LinkedIn feed or profile elements
      const feedSelector = ".scaffold-layout__content";
      const profileSelector = ".global-nav__me";

      await page.waitForTimeout(2000);

      const feedElement = await page.$(feedSelector);
      const profileElement = await page.$(profileSelector);

      return !!(feedElement || profileElement);
    } catch {
      return false;
    }
  }

  async loadFingerprint(accountId) {
    try {
      const fingerprintPath = path.join(
        "./profiles",
        `${accountId}_fingerprint.json`
      );
      const data = await fs.readFile(fingerprintPath, "utf8");
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async saveFingerprint(accountId, fingerprint) {
    try {
      const fingerprintPath = path.join(
        "./profiles",
        `${accountId}_fingerprint.json`
      );
      await fs.writeFile(fingerprintPath, JSON.stringify(fingerprint, null, 2));
    } catch (error) {
      console.error("Failed to save fingerprint:", error);
    }
  }

  async loadCookies(accountId) {
    try {
      const cookiesPath = path.join("./sessions", `${accountId}_cookies.json`);
      const data = await fs.readFile(cookiesPath, "utf8");
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async saveCookies(accountId, cookies) {
    try {
      const cookiesPath = path.join("./sessions", `${accountId}_cookies.json`);
      await fs.writeFile(cookiesPath, JSON.stringify(cookies, null, 2));
    } catch (error) {
      console.error("Failed to save cookies:", error);
    }
  }

  async loadSavedSessions() {
    // Implementation for loading saved sessions on startup
    console.log("📁 Loading saved sessions...");
  }

  async addAccount(accountData) {
    const accountId = crypto.randomUUID();

    // Store account configuration
    const accountPath = path.join("./profiles", `${accountId}_config.json`);
    await fs.writeFile(accountPath, JSON.stringify(accountData, null, 2));

    return accountId;
  }

  async getAccountStatus() {
    const accounts = [];

    for (const [accountId, session] of this.sessions) {
      accounts.push({
        accountId,
        status: "active",
        lastActivity: session.lastActivity,
        isOnline: !!session.page,
      });
    }

    return accounts;
  }

  async shutdown() {
    console.log("🛑 Shutting down LinkedIn Automation Core...");

    const shutdownPromises = [];

    for (const [accountId, session] of this.sessions) {
      shutdownPromises.push(session.browser?.close().catch(console.error));
    }

    await Promise.all(shutdownPromises);
    this.sessions.clear();

    console.log("✅ LinkedIn Automation Core shutdown complete");
  }
}

export default LinkedInAutomationCore;
