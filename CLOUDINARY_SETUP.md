# Cloudinary Setup Guide

## Issue
The error "Must supply api_key" indicates that Cloudinary environment variables are not configured on your Render.com deployment.

## Solution

### Step 1: Get Your Cloudinary Credentials

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Sign in or create a free account
3. On the dashboard, you'll see your credentials:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

### Step 2: Set Environment Variables on Render.com

1. Go to your Render.com dashboard
2. Select your backend service (aroena.onrender.com)
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add these three variables:

```
CLOUD_NAME=your-cloud-name-here
API_KEY=your-api-key-here
API_SECRET=your-api-secret-here
```

**Important:** Replace the placeholder values with your actual Cloudinary credentials!

### Step 3: Redeploy

After adding the environment variables:
1. Render will automatically redeploy your service
2. Or manually trigger a redeploy from the Render dashboard
3. Check the logs to see: `✅ Cloudinary configured successfully`

### Step 4: Verify

1. Try creating a service with an image upload
2. The image should upload to Cloudinary successfully
3. You'll get a Cloudinary URL like: `https://res.cloudinary.com/your-cloud-name/image/upload/...`

## Local Development Setup

If you're testing locally, create a `.env` file in the `backend` folder:

```env
CLOUD_NAME=your-cloud-name-here
API_KEY=your-api-key-here
API_SECRET=your-api-secret-here
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
```

## Troubleshooting

### Error: "Must supply api_key"
- ✅ Check that all three environment variables are set
- ✅ Verify the variable names are exactly: `CLOUD_NAME`, `API_KEY`, `API_SECRET`
- ✅ Make sure there are no extra spaces in the values
- ✅ Redeploy after adding variables

### Error: "Invalid API key"
- ✅ Double-check your API key from Cloudinary dashboard
- ✅ Make sure you copied the entire key without spaces

### Images not uploading
- ✅ Check Render.com logs for Cloudinary errors
- ✅ Verify your Cloudinary account is active
- ✅ Check file size (should be under 10MB for free tier)

## Free Tier Limits

Cloudinary free tier includes:
- 25 GB storage
- 25 GB monthly bandwidth
- 25,000 monthly transformations

This should be sufficient for development and small-scale production.

