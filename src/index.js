import dotenv from 'dotenv';
import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { LinkedInAutomationCore } from './core/linkedin-automation-core.js';
import { LinkedInActionQueue } from './core/action-queue.js';
import { LinkedInMessageGenerator } from './ai/message-generator.js';
import { LinkedInAnalyticsDashboard } from './analytics/dashboard.js';
import { AntiDetectionLayer } from './core/anti-detection.js';

// Load environment variables
dotenv.config();

class BrainSAITLinkedInPlatform {
    constructor() {
        this.app = fastify({ logger: true });
        this.automationCore = null;
        this.actionQueue = null;
        this.messageGenerator = null;
        this.analytics = null;
        this.antiDetection = null;
        
        this.setupMiddleware();
        this.setupRoutes();
    }

    async setupMiddleware() {
        // Security middleware
        await this.app.register(helmet, {
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                }
            }
        });

        // CORS configuration
        await this.app.register(cors, {
            origin: process.env.NODE_ENV === 'production' 
                ? ['https://your-domain.com'] 
                : true,
            credentials: true
        });
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', async (request, reply) => {
            return { 
                status: 'healthy', 
                timestamp: new Date().toISOString(),
                version: process.env.npm_package_version || '1.0.0'
            };
        });

        // Dashboard
        this.app.get('/dashboard', async (request, reply) => {
            const metrics = await this.analytics?.getMetrics() || {};
            const accounts = await this.automationCore?.getAccountStatus() || [];
            
            return {
                metrics,
                accounts,
                campaigns: await this.analytics?.getCampaignPerformance() || []
            };
        });

        // API Routes
        this.app.register(this.setupAPIRoutes, { prefix: '/api/v1' });
    }

    async setupAPIRoutes(fastify) {
        // Account management
        fastify.post('/accounts', async (request, reply) => {
            const { email, password, name, industry } = request.body;
            
            try {
                const accountId = await this.automationCore.addAccount({
                    email, password, name, industry
                });
                
                return { success: true, accountId };
            } catch (error) {
                reply.code(400);
                return { success: false, error: error.message };
            }
        });

        // Campaign management
        fastify.post('/campaigns', async (request, reply) => {
            const { name, targetCriteria, messageTemplate, accountIds } = request.body;
            
            try {
                const campaignId = await this.actionQueue.createCampaign({
                    name, targetCriteria, messageTemplate, accountIds
                });
                
                return { success: true, campaignId };
            } catch (error) {
                reply.code(400);
                return { success: false, error: error.message };
            }
        });

        // Message generation
        fastify.post('/messages/generate', async (request, reply) => {
            const { profileData, messageType, language = 'en' } = request.body;
            
            try {
                const message = await this.messageGenerator.generateMessage(
                    profileData, messageType, language
                );
                
                return { success: true, message };
            } catch (error) {
                reply.code(400);
                return { success: false, error: error.message };
            }
        });

        // Analytics
        fastify.get('/analytics/:period', async (request, reply) => {
            const { period } = request.params;
            
            try {
                const analytics = await this.analytics.getMetricsForPeriod(period);
                return { success: true, data: analytics };
            } catch (error) {
                reply.code(400);
                return { success: false, error: error.message };
            }
        });

        // Account health
        fastify.get('/accounts/:accountId/health', async (request, reply) => {
            const { accountId } = request.params;
            
            try {
                const health = await this.analytics.getAccountHealth(accountId);
                return { success: true, data: health };
            } catch (error) {
                reply.code(400);
                return { success: false, error: error.message };
            }
        });
    }

    async initialize() {
        try {
            console.log('🚀 Initializing BrainSAIT LinkedIn Platform...');

            // Initialize core components
            this.antiDetection = new AntiDetectionLayer();
            this.automationCore = new LinkedInAutomationCore({
                antiDetection: this.antiDetection
            });
            this.actionQueue = new LinkedInActionQueue();
            this.messageGenerator = new LinkedInMessageGenerator({
                openaiKey: process.env.OPENAI_API_KEY,
                anthropicKey: process.env.ANTHROPIC_API_KEY
            });
            this.analytics = new LinkedInAnalyticsDashboard(this.app);

            // Initialize all components
            await Promise.all([
                this.automationCore.initialize(),
                this.actionQueue.initialize(),
                this.messageGenerator.initialize(),
                this.analytics.initialize()
            ]);

            console.log('✅ All components initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize platform:', error);
            throw error;
        }
    }

    async start() {
        try {
            await this.initialize();
            
            const port = process.env.PORT || 3000;
            const host = process.env.HOST || '0.0.0.0';
            
            await this.app.listen({ port, host });
            
            console.log(`🎉 BrainSAIT LinkedIn Platform running on http://${host}:${port}`);
            console.log(`📊 Dashboard: http://${host}:${port}/dashboard`);
            console.log(`🔗 API: http://${host}:${port}/api/v1`);
            
        } catch (error) {
            console.error('❌ Failed to start server:', error);
            process.exit(1);
        }
    }

    async shutdown() {
        console.log('🛑 Shutting down BrainSAIT LinkedIn Platform...');
        
        try {
            await Promise.all([
                this.automationCore?.shutdown(),
                this.actionQueue?.shutdown(),
                this.analytics?.shutdown(),
                this.app.close()
            ]);
            
            console.log('✅ Platform shutdown complete');
        } catch (error) {
            console.error('❌ Error during shutdown:', error);
        }
    }
}

// Start the platform
const platform = new BrainSAITLinkedInPlatform();

// Graceful shutdown
process.on('SIGTERM', () => platform.shutdown());
process.on('SIGINT', () => platform.shutdown());

// Start the platform
platform.start().catch(console.error);

export default platform;
