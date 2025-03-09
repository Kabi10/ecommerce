export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DebugPage() {
  // Get environment info (safe to expose)
  const envInfo = {
    nodeEnv: process.env.NODE_ENV,
    nextPublicAppUrl: process.env.NEXT_PUBLIC_APP_URL,
    hasGoogleOAuth: !!process.env.GOOGLE_CLIENT_ID,
    hasGithubOAuth: !!process.env.GITHUB_CLIENT_ID,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasResendApiKey: !!process.env.RESEND_API_KEY,
    hasUploadthing: !!(process.env.UPLOADTHING_SECRET && process.env.UPLOADTHING_APP_ID),
    hasStripe: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET),
  };

  // Test database connection
  let dbStatus = 'Not tested';
  try {
    // Import here to avoid issues if DB is not configured
    const { prisma } = await import('@/lib/prisma');
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'Connected';
  } catch (error) {
    dbStatus = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">System Diagnostics</h1>
      
      <div className="grid gap-6">
        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Environment Variables</h2>
          <div className="bg-gray-100 p-3 rounded overflow-auto">
            <pre>{JSON.stringify(envInfo, null, 2)}</pre>
          </div>
        </section>

        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Database Status</h2>
          <div className="bg-gray-100 p-3 rounded">
            <p className={dbStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}>
              {dbStatus}
            </p>
          </div>
        </section>

        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Next Steps</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Check Vercel logs for detailed error messages</li>
            <li>Verify all required environment variables are set</li>
            <li>Ensure database connection string is correct</li>
            <li>Check OAuth provider configuration</li>
            <li>Review recent code changes that might have caused the issue</li>
          </ul>
        </section>
      </div>
    </div>
  );
} 