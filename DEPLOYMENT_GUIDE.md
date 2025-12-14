# Deployment Guide - GeoScore AI App

## Quick Start Deployment to Azure

### Prerequisites
1. Azure Account (free tier available at https://azure.microsoft.com/free/)
2. OpenAI API Key (from https://platform.openai.com/api-keys)
3. Git installed
4. Node.js 16+ installed locally

### Step 1: Prepare for Deployment

#### Create .env.production file for Backend
```
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
```

#### Update CORS in backend/server.js
Update the CORS origin to include your Azure domain:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://your-app.azurewebsites.net'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Step 2: Deploy Backend to Azure App Service

```bash
# Login to Azure
az login

# Create Resource Group
az group create --name geoscore-rg --location eastus

# Create App Service Plan
az appservice plan create --name geoscore-plan --resource-group geoscore-rg --sku B1 --is-linux

# Create Web App for Backend (Node.js)
az webapp create --resource-group geoscore-rg --plan geoscore-plan --name geoscore-api --runtime "node|18-lts"

# Deploy backend
cd backend
az webapp deployment source config-zip --resource-group geoscore-rg --name geoscore-api --src backend.zip

# Set environment variables
az webapp config appsettings set --resource-group geoscore-rg --name geoscore-api --settings OPENAI_API_KEY="your_key_here" NODE_ENV="production"
```

### Step 3: Deploy Frontend to Azure Static Web Apps

```bash
# Create Static Web App
az staticwebapp create --name geoscore-frontend --resource-group geoscore-rg --source . --location eastus --branch main --app-location "frontend" --output-location "build" --token YOUR_GITHUB_TOKEN

# Or manually build and deploy to Azure Blob Storage + CDN
cd frontend
npm run build
```

### Step 4: Update Frontend API URL

Before deploying frontend, update `frontend/src/services/apiService.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://geoscore-api.azurewebsites.net/api';
```

### Useful Azure Commands

```bash
# Get deployment status
az webapp show --resource-group geoscore-rg --name geoscore-api

# View logs
az webapp log tail --resource-group geoscore-rg --name geoscore-api

# Update environment variables
az webapp config appsettings set --resource-group geoscore-rg --name geoscore-api --settings "KEY=VALUE"
```

### Getting Your Shareable Link

After successful deployment:
- **Frontend URL**: `https://geoscore-frontend.azurewebsites.net`
- **Backend API**: `https://geoscore-api.azurewebsites.net/api`
- **Health Check**: `https://geoscore-api.azurewebsites.net/health`

### Troubleshooting

1. **CORS errors**: Make sure frontend URL is added to the CORS origins in backend
2. **Missing OpenAI Key**: Set the environment variable in Azure Portal or via CLI
3. **Build failures**: Check that all dependencies in package.json are correct
4. **Port conflicts**: Azure automatically handles port binding

## Alternative: Deploy with Azure DevOps or GitHub Actions

See `.github/workflows/deploy.yml` for CI/CD pipeline setup.
