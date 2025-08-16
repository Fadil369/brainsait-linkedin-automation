# BrainSAIT LinkedIn Automation Platform - R2 Setup Guide

## Current Status ✅

- **KV Storage**: All 4 namespaces connected and working
- **Worker**: Deployed and functional with enhanced API
- **Campaigns**: Successfully created and stored in KV
- **R2 Storage**: Ready to enable (code prepared)

## To Enable R2 "dash" Bucket:

### Step 1: Enable R2 in Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account: **BRAINSAIT LTD**
3. Go to **R2 Object Storage** in the sidebar
4. Click **Enable R2** (if not already enabled)
5. The "dash" bucket should already exist and be visible

### Step 2: Uncomment R2 Configuration

Once R2 is enabled, uncomment these lines in `wrangler.toml`:

```toml
# R2 Storage using existing bucket (requires R2 to be enabled in dashboard)
[[r2_buckets]]
binding = "DASH_BUCKET"
bucket_name = "dash"
```

### Step 3: Redeploy Worker

```bash
cd /Users/fadil369/BRAINSAIT-LINKEDIN-AUTOMATION-PLATFORM
wrangler deploy --env=""
```

## Available API Endpoints (Current):

### KV Storage Endpoints ✅

- `GET /health` - System status with KV/R2 status
- `GET /api/campaigns` - List campaigns (stored in BRAINSAIT_KV)
- `POST /api/campaigns` - Create campaign (stored in BRAINSAIT_KV)
- `GET /api/campaigns/{id}` - Get campaign details
- `GET /api/analytics` - Get analytics (from BRAINSAIT_CACHE)
- `GET /api/config` - Get configuration (from BRAINSAIT_CONFIG)
- `POST /api/config` - Update configuration (to BRAINSAIT_CONFIG)
- `POST /api/messages/send` - Send messages (stored in SESSIONS)

### R2 Storage Endpoints 🔄 (Ready when R2 enabled)

- `GET /api/files` - List all files in dash bucket
- `POST /api/files/upload` - Upload files to dash bucket
- `GET /api/files/{filename}` - Download file from dash bucket
- `DELETE /api/files/{filename}` - Delete file from dash bucket

## Test Commands:

### Test KV Storage (Working Now):

```bash
# Create a campaign
curl -X POST https://brainsait-linkedin-automation.fadil.workers.dev/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Campaign", "target_audience": "Developers"}'

# List campaigns
curl https://brainsait-linkedin-automation.fadil.workers.dev/api/campaigns

# Check health
curl https://brainsait-linkedin-automation.fadil.workers.dev/health
```

### Test R2 Storage (After enabling R2):

```bash
# List files in dash bucket
curl https://brainsait-linkedin-automation.fadil.workers.dev/api/files

# Upload a file
curl -X POST https://brainsait-linkedin-automation.fadil.workers.dev/api/files/upload \
  -F "file=@/path/to/your/file.txt" \
  -F "filename=test-file.txt"

# Download a file
curl https://brainsait-linkedin-automation.fadil.workers.dev/api/files/test-file.txt

# Delete a file
curl -X DELETE https://brainsait-linkedin-automation.fadil.workers.dev/api/files/test-file.txt
```

## Architecture Overview:

```
🧠 BrainSAIT LinkedIn Automation Platform
├── 🌐 Cloudflare Worker (brainsait-linkedin-automation.fadil.workers.dev)
├── 🗄️ KV Storage (4 namespaces)
│   ├── BRAINSAIT_KV (main data storage)
│   ├── BRAINSAIT_CACHE (analytics & caching)
│   ├── BRAINSAIT_CONFIG (platform configuration)
│   └── SESSIONS (user sessions & messages)
├── 📦 R2 Storage (when enabled)
│   └── DASH_BUCKET (file storage)
└── ⚡ Cloudflare Pages (brainsait-linkedin-dashboard.pages.dev)
    └── Dashboard UI
```

## Storage Usage Strategy:

### KV Namespaces:

- **BRAINSAIT_KV**: Campaign data, user profiles, automation rules
- **BRAINSAIT_CACHE**: Analytics, performance metrics, cached API responses
- **BRAINSAIT_CONFIG**: Platform settings, AI model configs, rate limits
- **SESSIONS**: User sessions, message history, temporary data

### R2 Bucket (dash):

- **File Storage**: Profile pictures, documents, reports
- **Data Exports**: CSV/JSON exports of campaigns and analytics
- **AI Training Data**: Conversation data for AI model improvement
- **Backup Storage**: Configuration backups, data snapshots

## Next Steps:

1. ✅ **KV Storage working perfectly**
2. 🔄 **Enable R2 in Cloudflare Dashboard**
3. 🚀 **Deploy with R2 support**
4. 🧪 **Test file upload/download functionality**
5. 📊 **Implement advanced LinkedIn automation features**
