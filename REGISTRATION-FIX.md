# Registration fix

Signup database failures now return a form error rather than an unhandled server exception. Duplicate-email races are handled, unexpected request failures stay on the form, and a failed automatic sign-in redirects to login with an account-created message.

## Verify

- `node --test scripts/auth-register.test.mjs`
- `npx tsc --noEmit`
- `npx eslint src/actions/auth.actions.ts "src/app/(auth)/register/page.tsx" "src/app/(auth)/login/page.tsx" scripts/auth-register.test.mjs`

The regression tests mock the database and authentication; they do not verify the production MongoDB connection.

## Production diagnosis

The screenshot's digest alone does not identify the underlying exception. Check the Vercel runtime log for the failing POST to `/register`. After deploying this patch, database failures log `Registration database operation failed` with the Prisma error code and error type, without logging submitted credentials or connection strings.

Check that `DATABASE_URL` is set for the deployed Vercel environment, the database credentials are valid, and the MongoDB Atlas network rules allow the deployment to connect. Check `AUTH_SECRET` if automatic sign-in fails. Redeploy after changing environment variables. This patch does not repair unavailable or misconfigured infrastructure.

No production deployment or database changes were performed.
