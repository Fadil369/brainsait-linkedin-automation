# Deployment Guide for Cloudflare Workers & Pages

This guide will help you deploy the BrainSAIT LinkedIn Automation Platform to Cloudflare Workers and Pages.

## Prerequisites

- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)
- Node.js 18+ installed

## Step 1: Configure Wrangler

```bash
# Login to Cloudflare
wrangler login

# Set your account ID (find this in Cloudflare dashboard)
wrangler whoami
```

## Step 2: Set Up KV Namespaces

```bash
# Create KV namespaces for session storage
wrangler kv:namespace create "SESSIONS"
wrangler kv:namespace create "SESSIONS" --preview

# Create KV namespaces for analytics
wrangler kv:namespace create "ANALYTICS"
wrangler kv:namespace create "ANALYTICS" --preview
```

Update the `wrangler.toml` file with the generated namespace IDs.

## Step 3: Configure Environment Variables

Set up your environment variables in Cloudflare:

```bash
# Set OpenAI API key
wrangler secret put OPENAI_API_KEY

# Set Anthropic API key
wrangler secret put ANTHROPIC_API_KEY

# Set LinkedIn credentials (if needed)
wrangler secret put LINKEDIN_EMAIL
wrangler secret put LINKEDIN_PASSWORD
```

## Step 4: Deploy Workers

```bash
# Build and deploy the Workers
npm run build:workers
npm run deploy:workers
```

## Step 5: Deploy Pages

```bash
# Build the dashboard
npm run build

# Deploy to Cloudflare Pages
npm run build:pages

# Or manually deploy
wrangler pages deploy dist --project-name brainsait-linkedin-dashboard
```

## Step 6: Configure Custom Domain (Optional)

1. Go to Cloudflare Dashboard
2. Navigate to Pages > brainsait-linkedin-dashboard
3. Go to Custom domains
4. Add your domain (e.g., linkedin.brainsait.com)

## Step 7: Set Up Cron Triggers

The automation runs on scheduled intervals. Configure in `wrangler.toml`:

```toml
[[triggers]]
crons = ["0 9,14,18 * * *"]  # 9 AM, 2 PM, 6 PM Riyadh time
```

## Step 8: Monitor Deployment

- Check Workers logs: `wrangler tail`
- Monitor analytics in Cloudflare dashboard
- Test endpoints: `https://your-worker.your-subdomain.workers.dev/health`

## Security Considerations

1. **Never commit secrets** to the repository
2. **Use KV storage** for sensitive session data
3. **Enable rate limiting** in production
4. **Monitor for abuse** through analytics
5. **Keep dependencies updated** regularly

## Scaling Configuration

For high-volume usage:

```toml
# In wrangler.toml
[limits]
cpu_ms = 30000      # Increase CPU time
memory_mb = 256     # Increase memory limit
```

## Troubleshooting

### Common Issues

1. **Authentication failed**: Check API keys in secrets
2. **KV namespace not found**: Verify namespace IDs in wrangler.toml
3. **Rate limits exceeded**: Implement backoff strategies
4. **Memory limits**: Optimize code and reduce payload sizes

### Debug Commands

```bash
# Check configuration
wrangler config

# View logs
wrangler tail

# Test locally
wrangler dev

# Check KV data
wrangler kv:key list --binding SESSIONS
```

## Performance Optimization

1. **Minimize cold starts**: Use Durable Objects for stateful operations
2. **Cache responses**: Implement caching for frequently accessed data
3. **Optimize bundle size**: Use tree shaking and code splitting
4. **Use Workers Analytics**: Monitor performance metrics

## Maintenance

1. **Regular updates**: Keep dependencies current
2. **Monitor quotas**: Watch Cloudflare usage limits
3. **Backup data**: Export KV data regularly
4. **Security patches**: Update when vulnerabilities are found

## Support

- Cloudflare Workers Docs: https://developers.cloudflare.com/workers/
- Wrangler CLI Docs: https://developers.cloudflare.com/workers/wrangler/
- BrainSAIT Support: support@brainsait.com
