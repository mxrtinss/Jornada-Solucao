# Vercel Deployment Guide

## Overview
This guide explains how to deploy your React application with serverless API functions to Vercel.

## Prerequisites
1. Vercel account (free at vercel.com)
2. Vercel CLI installed: `npm i -g vercel`
3. MongoDB Atlas database (or your existing MongoDB setup)

## Project Structure
```
├── api/                    # Serverless API functions
│   ├── funcionarios.js     # Employees API
│   └── test.js            # Test API endpoint
├── src/                    # React frontend
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```

## API Endpoints

### Available Endpoints
- `GET /api/funcionarios` - Fetch all employees
- `GET /api/test` - Test endpoint to verify API is working

### API Response Format
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

## Environment Variables

### Required Environment Variables
Set these in your Vercel project settings:

1. **MONGODB_URI** - Your MongoDB connection string
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

### How to Set Environment Variables in Vercel

#### Option 1: Vercel Dashboard
1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add `MONGODB_URI` with your connection string
4. Select all environments (Production, Preview, Development)

#### Option 2: Vercel CLI
```bash
vercel env add MONGODB_URI
```

## Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Project
```bash
npm run build
```

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Login to Vercel (first time only)
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push to main branch

### 4. Configure Environment Variables
After deployment, set your environment variables in the Vercel dashboard.

## Testing Your API

### Test the API Endpoints
Once deployed, test your API endpoints:

1. **Test endpoint**: `https://your-app.vercel.app/api/test`
2. **Employees endpoint**: `https://your-app.vercel.app/api/funcionarios`

### Expected Responses

#### Test Endpoint
```json
{
  "success": true,
  "message": "API is working!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

#### Employees Endpoint
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "matricula": "12345",
      "nome": "João Silva",
      "cargo": "Operador CNC",
      "departamento": "Produção",
      "email": "joao.silva@empresa.com",
      "telefone": "(11) 98765-4321",
      "dataAdmissao": "2020-03-15T00:00:00.000Z",
      "ativo": true
    }
  ],
  "count": 1
}
```

## Troubleshooting

### Common Issues

#### 1. API Returns 404
- Check that your API files are in the `api/` directory
- Verify the file names match the endpoint paths
- Ensure the `vercel.json` configuration is correct

#### 2. MongoDB Connection Errors
- Verify your `MONGODB_URI` environment variable is set correctly
- Check that your MongoDB Atlas cluster allows connections from Vercel's IP ranges
- Ensure your database user has the correct permissions

#### 3. CORS Errors
- The API already includes CORS headers
- If you're still getting CORS errors, check that you're calling the correct URL

#### 4. Function Timeout
- The API is configured with a 30-second timeout
- If you need longer, update the `maxDuration` in `vercel.json`

### Debugging
1. Check Vercel function logs in the dashboard
2. Use the test endpoint to verify basic functionality
3. Check environment variables are set correctly

## Local Development

### Running Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test API locally (if you have a local server)
curl http://localhost:3002/api/test
```

### Environment Variables for Local Development
Create a `.env.local` file:
```
MONGODB_URI=your_mongodb_connection_string
```

## Security Considerations

1. **Environment Variables**: Never commit sensitive data like database credentials
2. **CORS**: The API allows all origins (`*`) - consider restricting this in production
3. **Database Access**: Use MongoDB Atlas with proper user permissions
4. **API Keys**: Store any API keys as environment variables

## Performance Optimization

1. **Connection Pooling**: The API uses connection caching for better performance
2. **Timeouts**: Configured with appropriate timeouts for serverless environment
3. **Error Handling**: Includes fallback data when database is unavailable

## Monitoring

### Vercel Analytics
- Enable Vercel Analytics to monitor API performance
- Check function execution times and error rates

### MongoDB Monitoring
- Use MongoDB Atlas monitoring to track database performance
- Monitor connection counts and query performance

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test with the `/api/test` endpoint
4. Check MongoDB Atlas connection status 