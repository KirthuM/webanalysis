# Deploy to Vercel - Quick Guide

Your code is ready to deploy! Here's how to get a live link for your client:

## Step 1: Connect GitHub to Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** → Choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. Select your **KirthuM/webanalysis** repository

## Step 2: Deploy Frontend (Main App)

1. In Vercel dashboard, click **"New Project"**
2. Select the **webanalysis** repository
3. Framework: Select **Create React App**
4. Build Command: `cd frontend && npm install && npm run build`
5. Output Directory: `frontend/build`
6. Click **"Deploy"** ✅

**Your Frontend URL will be:**
```
https://webanalysis.vercel.app
```

## Step 3: Deploy Backend (API)

The backend API will be deployed as serverless functions in the same Vercel project:

1. In the same Vercel project settings:
2. Go to **Settings** → **Environment Variables**
3. Add these environment variables:
   - **OPENAI_API_KEY**: Your OpenAI API key (https://platform.openai.com/api-keys)
   - **NODE_ENV**: `production`
   - **FRONTEND_URL**: `https://webanalysis.vercel.app`

4. The API will automatically deploy at:
```
https://webanalysis-api.vercel.app/api
```

## Step 4: Update CORS in Production

The CORS is already configured in `api/index.js` to allow:
- Localhost (for development)
- `https://webanalysis.vercel.app` (for production)

## Test Your Deployment

Once deployed, test these URLs:

```bash
# Test frontend
https://webanalysis.vercel.app

# Test backend
https://webanalysis-api.vercel.app/api/test

# Health check
https://webanalysis-api.vercel.app/health
```

## Environment Variables Needed

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| OPENAI_API_KEY | Your API key | ✅ Yes |
| FRONTEND_URL | https://webanalysis.vercel.app | No (optional) |
| NODE_ENV | production | No (defaults to production) |

## Getting Your Shareable Links

After deployment completes:

**Send this to your client:**
```
🌐 App URL: https://webanalysis.vercel.app
📱 Works on all devices - mobile, tablet, desktop
```

## Troubleshooting

### API Connection Issues
If frontend can't reach API:
1. Check that OPENAI_API_KEY is set in Vercel environment variables
2. Verify API URL in frontend - should be `https://webanalysis-api.vercel.app/api`

### Build Failures
1. Check build logs in Vercel dashboard
2. Make sure all dependencies in package.json are correct
3. Verify that `.env` file is NOT committed (check `.gitignore`)

### OpenAI API Not Working
1. Verify API key is valid: https://platform.openai.com/api-keys
2. Check API key is set in Vercel environment variables
3. Check API key has sufficient credits/quota

## Re-deployment

To redeploy after making changes:
1. Make changes locally
2. Commit: `git add . && git commit -m "your message"`
3. Push: `git push origin main`
4. Vercel will automatically redeploy! 🚀

## View Deployment Logs

In Vercel dashboard:
1. Select your project
2. Click **"Deployments"**
3. Click the latest deployment
4. View **"Logs"** for any errors

---

**Need help?** Check Vercel docs: https://vercel.com/docs
