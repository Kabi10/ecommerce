# EStore - Your One-Stop Shop

## Image Requirements

The following images are required for the eBay listings import:

1. Category Images (1200x800px recommended):
   - `/public/images/industrial.webp` - Industrial & Electrical Equipment category
   - `/public/images/books.webp` - Books & Literature category
   - `/public/images/textbooks.webp` - Textbooks & Educational category
   - `/public/images/coins.webp` - Coins & Collectibles category

2. Product Images:
   - `/public/images/placeholder.webp` - Default placeholder for products (800x800px recommended)

Please ensure these images are present in the correct locations before running the import script.

## Running the eBay Import

1. Place your eBay listings CSV file in the `data` directory as `ebay-listings.csv`
2. Ensure all required images are in place
3. Run the import script:
   ```bash
   npm run import-ebay
   ```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/estore"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

## License

MIT

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
