# AI Studio Cloudflare Deployment Guide

This document explains how to deploy the AI Studio platform on Cloudflare Pages and Workers.

## Architecture Overview

The platform uses:
- **Cloudflare Pages** - For the Next.js frontend
- **Cloudflare Workers** - For API functionality
- **Cloudflare R2** - For asset and model storage

## Deployment Steps

### 1. Setup Environment

Ensure you have the Cloudflare Wrangler CLI installed:

```bash
npm install -g wrangler
```

Login to your Cloudflare account:

```bash
wrangler login
```

### 2. Create R2 Buckets

Create the necessary storage buckets:

```bash
wrangler r2 bucket create ai-studio-assets
wrangler r2 bucket create ai-studio-models
```

### 3. Configure Secrets

Set up the required API keys for model services:

```bash
wrangler secret put FAL_API_KEY --env production
wrangler secret put RUNPOD_API_KEY --env production
```

### 4. Deploy Workers

Deploy the API workers:

```bash
cd workers/model-proxy
wrangler deploy

cd ../assets-upload
wrangler deploy
```

### 5. Deploy the Application

From the project root, run:

```bash
npm run deploy
```

This builds the Next.js application and deploys it to Cloudflare Pages.

### 6. Connect Workers to Pages

After deployment, go to the Cloudflare Dashboard and:

1. Navigate to your Pages project
2. Go to Settings > Functions > Service bindings
3. Bind your Workers to routes:
   - `/api/models/*` to `model-proxy`
   - `/api/assets/*` to `assets-upload`

## Configuration Reference

### Next.js Configuration

The `next.config.ts` file includes the Cloudflare adapter configuration.

### Worker Configuration

Each Worker has its own `wrangler.toml` file defining:
- Environment variables
- R2 bucket bindings
- Runtime compatibility

### Edge Runtime

All server components and API routes use the Edge runtime directive:

```typescript
export const runtime = 'edge';
```

## Updating the Deployment

To update the deployment, run:

```bash
npm run deploy
```

This will redeploy the Next.js application. To update Workers, navigate to the Worker directory and run:

```bash
wrangler deploy
``` 