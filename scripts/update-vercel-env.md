# Vercel Environment Variables Update Guide

Follow these steps to update your environment variables in Vercel:

## 1. Log in to Vercel Dashboard

Go to [https://vercel.com/dashboard](https://vercel.com/dashboard) and select your ecommerce project.

## 2. Navigate to Environment Variables

Click on "Settings" in the top navigation, then select "Environment Variables" from the left sidebar.

## 3. Add or Update the Following Variables

| Name | Value | Environment |
|------|-------|-------------|
| `NEXTAUTH_SECRET` | `j9yW6o3vK+s+FDIN7rv5Vy0ovv83qxmpi4TLkeoOeuU=` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://ecommerce-rho-plum.vercel.app` | Production |
| `NEXTAUTH_URL` | `https://${VERCEL_URL}` | Preview |
| `NEXTAUTH_URL` | `http://localhost:3000` | Development |
| `NEXT_PUBLIC_APP_URL` | `https://ecommerce-rho-plum.vercel.app` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://${VERCEL_URL}` | Preview |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Development |

## 4. Verify Other Required Variables

Make sure these variables are also set:

- `DATABASE_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`

## 5. Redeploy Your Application

After updating the environment variables:

1. Go to the "Deployments" tab
2. Find your latest deployment
3. Click the three dots menu (⋮) and select "Redeploy"

## 6. Verify the Deployment

Once the deployment is complete, visit your site and check if the authentication is working correctly.

## Special Note About `${VERCEL_URL}`

The `${VERCEL_URL}` syntax is a special Vercel feature that automatically uses the deployment URL. This is useful for preview deployments that have dynamic URLs.

## Troubleshooting

If you still encounter issues:

1. Check the Function Logs in Vercel for detailed error messages
2. Visit `/debug` and `/api/debug` endpoints to verify environment variables
3. Make sure your OAuth providers (Google, GitHub) have the correct redirect URIs configured 