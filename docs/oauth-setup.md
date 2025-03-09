# OAuth Setup Guide for Vercel Deployments

This guide will help you properly configure OAuth providers (like Google, GitHub) for your Vercel deployments.

## Google OAuth Setup

### Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to "APIs & Services" > "Credentials"

### Step 2: Configure OAuth Consent Screen

1. Go to "OAuth consent screen"
2. Fill in the required information:
   - App name: "EStore"
   - User support email: Your email
   - Developer contact information: Your email
3. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
4. Add test users if in testing mode

### Step 3: Create OAuth Client ID

1. Go to "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Application type: "Web application"
4. Name: "EStore Web Client"

### Step 4: Add Authorized Redirect URIs

Add **ALL** of the following redirect URIs:

```
# Production URL
https://ecommerce-rho-plum.vercel.app/api/auth/callback/google

# Preview deployment URLs (add all that you use)
https://ecommerce-egl366r7k-kabilantharmaratnam-kpucas-projects.vercel.app/api/auth/callback/google

# Local development
http://localhost:3000/api/auth/callback/google
```

### Step 5: Update Environment Variables in Vercel

1. Go to your Vercel project
2. Navigate to "Settings" > "Environment Variables"
3. Add or update:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

## GitHub OAuth Setup

### Step 1: Access GitHub Developer Settings

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App" or select your existing app

### Step 2: Configure OAuth App

1. Application name: "EStore"
2. Homepage URL: Your production URL (e.g., `https://ecommerce-rho-plum.vercel.app`)
3. Authorization callback URL: Your production callback URL (e.g., `https://ecommerce-rho-plum.vercel.app/api/auth/callback/github`)

### Step 3: Add Additional Callback URLs

Unfortunately, GitHub only allows one callback URL in the main settings. To handle multiple environments:

1. Create separate OAuth apps for each environment (production, preview, development)
2. OR use a proxy endpoint that redirects to the appropriate URL

### Step 4: Update Environment Variables in Vercel

1. Go to your Vercel project
2. Navigate to "Settings" > "Environment Variables"
3. Add or update:
   ```
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

## Handling Vercel Preview Deployments

Vercel creates unique URLs for preview deployments, which can cause OAuth redirect issues. Here are strategies to handle this:

### Option 1: Add All Preview URLs to OAuth Providers

- Each time Vercel creates a new preview URL, add it to your OAuth provider's redirect URIs
- This is manual but straightforward

### Option 2: Use Environment-Specific OAuth Credentials

- Create separate OAuth credentials for each environment
- Use Vercel's environment variable system to switch between them

### Option 3: Use a Custom Domain for All Deployments

- Set up a custom domain for your Vercel project
- Configure all preview deployments to use subdomains of this domain
- Register only the wildcard domain with OAuth providers

## Troubleshooting

### Redirect URI Mismatch Errors

If you see "Error 400: redirect_uri_mismatch", it means the callback URL your app is using doesn't match any of the authorized redirect URIs in your OAuth provider settings.

To fix:
1. Check the exact URL in the error message
2. Add that exact URL to your OAuth provider's authorized redirect URIs
3. Wait a few minutes for changes to propagate
4. Try signing in again

### Multiple Account Issues

If users are creating duplicate accounts when signing in with different methods, enable `allowDangerousEmailAccountLinking: true` in your OAuth provider configuration.

### Preview Deployment Issues

For preview deployments, you may need to:
1. Temporarily add the preview URL to your OAuth provider settings
2. Use a different OAuth app for preview environments
3. Implement a custom callback handler that works with multiple domains 