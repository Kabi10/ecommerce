# Deployment Guide for EStore

This guide will help you deploy the EStore application to Vercel.

## Prerequisites

1. A Vercel account
2. A PostgreSQL database (e.g., Supabase, Railway, Neon, etc.)
3. Stripe account for payment processing
4. Resend account for email services
5. Uploadthing account for file uploads (if used)

## Step 1: Set Up Your Database

1. Create a PostgreSQL database in your preferred provider
2. Get the connection string in the format: `postgresql://username:password@hostname:port/database`
3. Make sure the database is accessible from Vercel's servers (check IP allowlisting if needed)

## Step 2: Configure Vercel Project

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project with the following settings:

### Build Settings
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm ci`

### Environment Variables

Add the following environment variables:

```
# Base URL
NEXT_PUBLIC_APP_URL=https://ecommerce-rho-plum.vercel.app
NEXTAUTH_URL=https://ecommerce-rho-plum.vercel.app

# Auth
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Database
DATABASE_URL=<your-postgresql-connection-string>

# Stripe (Payment Processing)
STRIPE_SECRET_KEY=<your-stripe-secret-key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>

# Email (Resend)
RESEND_API_KEY=<your-resend-api-key>

# File Upload (Uploadthing)
UPLOADTHING_SECRET=<your-uploadthing-secret>
UPLOADTHING_APP_ID=<your-uploadthing-app-id>

# OAuth Providers (if used)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
```

## Step 3: Deploy

1. Click "Deploy" to start the deployment process
2. Wait for the build and deployment to complete
3. Once deployed, visit your site URL to verify it's working correctly
4. Check the health endpoint at `/api/health` to verify the database connection

## Step 4: Set Up Stripe Webhooks

1. In your Stripe Dashboard, go to Developers → Webhooks
2. Add a new endpoint with your site URL + `/api/webhooks/stripe`
3. Select the events you need (typically `payment_intent.succeeded`, `payment_intent.payment_failed`)
4. Get the webhook signing secret and add it to your Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

## Troubleshooting

### Database Connection Issues
- Verify your DATABASE_URL is correct
- Check if your database provider requires IP allowlisting
- Ensure your database user has the necessary permissions

### Build Failures
- Check the build logs in Vercel for specific errors
- Verify all required environment variables are set
- Try running the build locally with the same environment variables

### Runtime Errors
- Check the Function Logs in Vercel
- Visit the `/api/health` endpoint to verify the database connection
- Check browser console for client-side errors

## Maintenance

### Database Migrations
- When you make schema changes, they will be automatically applied during deployment
- To manually apply migrations, use the Vercel CLI:
  ```
  vercel env pull
  npx prisma migrate deploy
  ```

### Environment Variable Updates
- When you update environment variables in Vercel, you need to redeploy the application
- You can do this by clicking "Redeploy" in the Vercel dashboard

### Monitoring
- Set up Vercel Analytics to monitor performance
- Configure alerts for deployment failures
- Regularly check the Function Logs for errors 