## Changelog

- Using NextJS v14
- Solved error `[webpack.cache.PackFileCacheStrategy] Serializing big strings (100kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)` by adding `compress: true` to the next config file.
- It is a good idea to commit package-lock.json to source control
- Added username sign in method to app on Clerk Dashboard (external website)
- Custom auth
  - https://clerk.com/docs/references/nextjs/custom-signup-signin-pages
  - Using `register`/`login` as the names of the auth routes that invoke Clerk instead of `sign-up`/`sign-in`

- Clerk component docs are now at `https://clerk.com/docs/components`



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
This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
