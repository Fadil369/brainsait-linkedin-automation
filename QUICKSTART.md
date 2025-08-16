# 🧠 BrainSAIT LinkedIn Automation Platform

## Quick Start Guide

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/Fadil369/brainsait-linkedin-automation.git
cd brainsait-linkedin-automation

# Run the setup script
./setup.sh
```

### 2. Configure Environment

```bash
# Copy and edit environment variables
cp .env.example .env
nano .env  # Add your API keys and credentials
```

### 3. Start Development

```bash
# Start local development server
./dev.sh

# Or manually
npm run dev
```

### 4. Deploy to Cloudflare

```bash
# Login to Cloudflare
wrangler login

# Deploy everything
./deploy.sh
```

## 🎯 Key Features

- **AI-Powered Messaging**: GPT-4 and Claude integration
- **Healthcare Focus**: Medical professional verification
- **Bilingual Support**: Arabic and English automation
- **Anti-Detection**: Advanced browser fingerprinting
- **Real-time Analytics**: Live dashboard with metrics
- **Cloudflare Optimized**: Workers and Pages ready

## 💰 Cost Savings

Save **$3,500+/year** compared to commercial solutions:

| Feature | Commercial Tools | BrainSAIT | Savings |
|---------|------------------|-----------|---------|
| 3 Accounts | $297/month | $20/month | $277/month |
| Unlimited Accounts | $500+/month | $20/month | $480+/month |
| Custom AI | Not Available | Included | Priceless |
| Healthcare Features | Limited | Full Suite | Priceless |

## 🏥 Healthcare Compliance

- **HIPAA-Ready**: Encrypted data handling
- **Medical Verification**: Automatic credential checking
- **Audit Logging**: Complete activity tracking
- **Data Retention**: Configurable retention policies

## 🌍 Middle East Optimized

- **Arabic Language**: Native RTL support
- **Cultural Context**: Regional business practices
- **Local Time Zones**: Riyadh business hours
- **Regional Holidays**: Saudi calendar integration

## 📊 Analytics Dashboard

Access your dashboard at: `https://your-domain.pages.dev`

- Real-time metrics
- Campaign performance
- Account health monitoring
- Lead generation tracking
- Multi-language interface

## 🔐 Security Features

- **Browser Fingerprinting**: Unique identities per account
- **Human Behavior Simulation**: Natural interaction patterns
- **Rate Limiting**: Intelligent action throttling
- **Proxy Support**: IP rotation capabilities
- **Session Management**: Secure cookie handling

## 🚀 Deployment Options

### Cloudflare Workers & Pages (Recommended)
- Global edge deployment
- Automatic scaling
- Built-in CDN
- Cost-effective

### Docker Compose (Local/VPS)
- Complete control
- Custom infrastructure
- Private deployment
- Development environment

### Kubernetes (Enterprise)
- High availability
- Auto-scaling
- Load balancing
- Enterprise features

## 📱 API Endpoints

### Health Check
```bash
GET /health
```

### Campaign Management
```bash
POST /api/v1/campaigns     # Create campaign
GET /api/v1/campaigns      # List campaigns
PUT /api/v1/campaigns/:id  # Update campaign
```

### Message Generation
```bash
POST /api/v1/messages/generate
{
  "profileData": {...},
  "messageType": "connection",
  "language": "en"
}
```

### Analytics
```bash
GET /api/v1/analytics/24h  # 24 hour metrics
GET /api/v1/analytics/7d   # 7 day metrics
GET /api/v1/analytics/30d  # 30 day metrics
```

## 🔧 Configuration

### LinkedIn Accounts
Edit `config/accounts.json`:
```json
{
  "accounts": [
    {
      "id": "account1",
      "email": "your.email@domain.com",
      "industry": "healthcare",
      "dailyLimits": {
        "connections": 15,
        "messages": 20
      }
    }
  ]
}
```

### AI Configuration
Edit `config/ai.json`:
```json
{
  "providers": {
    "openai": {
      "model": "gpt-4",
      "temperature": 0.7
    }
  }
}
```

## 🛟 Support & Resources

- **Documentation**: `/docs/`
- **GitHub Issues**: [Report bugs](https://github.com/Fadil369/brainsait-linkedin-automation/issues)
- **Email Support**: support@brainsait.com
- **Deployment Guide**: `docs/DEPLOYMENT.md`

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ by [BrainSAIT](https://brainsait.com) for the healthcare community**

*Ready to revolutionize your LinkedIn automation? Let's build the future together! 🚀*
