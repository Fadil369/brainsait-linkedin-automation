# 🛠️ BrainSAIT Installation & Deployment Guide

## 📋 Prerequisites

Before getting started, ensure you have:

- **Cloudflare Account**: Active account with Workers enabled
- **Node.js**: Version 18 or higher
- **Git**: For repository management
- **Wrangler CLI**: Cloudflare's deployment tool

## 🚀 Quick Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Fadil369/brainsait-linkedin-automation.git
cd brainsait-linkedin-automation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Wrangler CLI

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### 4. Configure Your Environment

Copy and edit the configuration:

```bash
cp wrangler.toml.example wrangler.toml
```

Edit `wrangler.toml` with your account details:

```toml
name = "brainsait-linkedin-automation"
account_id = "YOUR_ACCOUNT_ID"
compatibility_date = "2024-01-01"

[env.production]
workers_dev = false
route = "your-domain.com/*"

[[env.production.kv_namespaces]]
binding = "CAMPAIGNS_KV"
id = "YOUR_KV_NAMESPACE_ID"

[[env.production.d1_databases]]
binding = "DB"
database_name = "brainsait-db"
database_id = "YOUR_D1_DATABASE_ID"
```

### 5. Deploy to Cloudflare

```bash
# Deploy to production
wrangler deploy

# Or deploy to staging
wrangler deploy --env staging
```

## 🗄️ Storage Setup

### KV Namespaces

Create the required KV namespaces:

```bash
# Create KV namespaces
wrangler kv:namespace create "CAMPAIGNS_KV"
wrangler kv:namespace create "SESSIONS_KV"
wrangler kv:namespace create "ANALYTICS_KV"
wrangler kv:namespace create "CONFIG_KV"
```

### D1 Database

Set up your D1 database:

```bash
# Create D1 database
wrangler d1 create brainsait-db

# Initialize tables
wrangler d1 execute brainsait-db --file=./database/schema.sql
```

### R2 Bucket (Optional)

For file storage capabilities:

```bash
# Create R2 bucket
wrangler r2 bucket create brainsait-files
```

## 🔐 Environment Configuration

### Required Variables

Set these in your Cloudflare Workers dashboard or wrangler.toml:

```toml
[vars]
OPENAI_API_KEY = "your-openai-key"
ANTHROPIC_API_KEY = "your-anthropic-key"
LINKEDIN_EMAIL = "your-linkedin-email"
LINKEDIN_PASSWORD = "your-linkedin-password"
ADMIN_EMAIL = "admin@yourcompany.com"
```

### Security Configuration

```bash
# Set secrets (more secure than vars)
wrangler secret put OPENAI_API_KEY
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put LINKEDIN_PASSWORD
```

## 🧪 Testing Your Deployment

### 1. Health Check

```bash
curl https://your-worker.your-subdomain.workers.dev/health
```

Expected response:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-16T10:00:00Z",
  "storage": {
    "kv": "connected",
    "d1": "connected",
    "r2": "connected"
  }
}
```

### 2. Test AI Message Generation

```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/api/messages/generate \
  -H "Content-Type: application/json" \
  -d '{
    "profileData": {
      "firstName": "Dr. Sarah",
      "industry": "Healthcare Technology"
    },
    "messageType": "connection",
    "language": "en"
  }'
```

### 3. Test Campaign Creation

```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Campaign",
    "target_audience": "Healthcare Professionals",
    "daily_limit": 10
  }'
```

## 📊 Monitoring & Analytics

### Cloudflare Analytics

Monitor your deployment through:

- **Cloudflare Dashboard**: Real-time metrics
- **Wrangler Tail**: Live log streaming
- **Workers Analytics**: Performance insights

```bash
# Stream live logs
wrangler tail

# View analytics
wrangler pages deployment list
```

### Custom Monitoring

The platform includes built-in monitoring:

- `/health` - System status endpoint
- `/api/analytics` - Usage analytics
- Real-time dashboard metrics

## 🔧 Troubleshooting

### Common Issues

**1. KV Namespace Not Found**

```bash
# Verify KV namespace binding
wrangler kv:namespace list
```

**2. D1 Database Connection Error**

```bash
# Check D1 database status
wrangler d1 list
wrangler d1 info brainsait-db
```

**3. AI API Errors**

```bash
# Verify API keys are set
wrangler secret list
```

**4. LinkedIn Authentication Issues**

- Ensure credentials are correct
- Check for 2FA requirements
- Verify account permissions

### Debug Mode

Enable debug logging:

```bash
# Deploy with debug enabled
wrangler deploy --compatibility-date 2024-01-01 --debug
```

### Log Analysis

```bash
# View recent logs
wrangler tail --format pretty

# Filter specific errors
wrangler tail --grep "ERROR"
```

## 🚀 Advanced Configuration

### Custom Domain

Set up a custom domain:

```bash
# Add custom domain
wrangler pages domain add your-domain.com

# Update wrangler.toml
[env.production]
route = "your-domain.com/*"
```

### SSL/TLS Setup

Cloudflare automatically handles SSL/TLS for:

- `*.workers.dev` subdomains
- Custom domains with proper DNS setup

### Rate Limiting

Configure rate limiting in `wrangler.toml`:

```toml
[env.production.rate_limiting]
requests_per_minute = 100
burst_size = 50
```

## 📈 Performance Optimization

### Caching Strategy

```javascript
// Implement intelligent caching
const cacheKey = `ai-response:${hashInput}`;
const cached = await env.CACHE_KV.get(cacheKey);
if (cached) return JSON.parse(cached);
```

### Resource Optimization

```toml
# Optimize worker resources
[env.production]
cpu_ms = 50
memory_mb = 128
```

### CDN Configuration

```bash
# Configure CDN settings
wrangler pages config set --production \
  --cache-control "max-age=3600"
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install
      - run: npm test
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy
```

### Automated Testing

```bash
# Run tests before deployment
npm test

# Run integration tests
npm run test:integration
```

## 📱 Mobile & PWA Setup

### Progressive Web App

Enable PWA features:

```json
{
  "name": "BrainSAIT",
  "short_name": "BrainSAIT",
  "description": "Healthcare LinkedIn Automation",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#1DA1F2",
  "background_color": "#ffffff"
}
```

### Mobile Optimization

```css
/* Responsive design included */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
```

## 🌍 Multi-Region Deployment

### Geographic Distribution

```toml
[env.production]
routes = [
  { pattern = "*.brainsait.com/api/*", zone_id = "YOUR_ZONE_ID" }
]

# Regional optimization
[env.production.placement]
mode = "smart"
```

### Region-Specific Configuration

```javascript
// Auto-detect user region
const country = request.cf.country;
const language = country === "SA" ? "ar" : "en";
```

## 🎯 Healthcare Compliance

### HIPAA Considerations

- Data encryption at rest and transit
- Audit logging enabled
- Access controls implemented
- Data retention policies

### Regional Compliance

- GDPR compliance for EU users
- MENA data protection standards
- Healthcare-specific regulations

## 📚 Additional Resources

### Documentation Links

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [D1 Database Guide](https://developers.cloudflare.com/d1/)
- [KV Storage Guide](https://developers.cloudflare.com/workers/runtime-apis/kv/)

### Community Support

- GitHub Issues: Report bugs and feature requests
- Documentation: Comprehensive guides and API reference
- Healthcare Community: Connect with other healthcare professionals

---

**🎉 Your BrainSAIT platform is now ready for healthcare LinkedIn automation!**

For additional support, visit our [GitHub repository](https://github.com/Fadil369/brainsait-linkedin-automation) or contact our team.
