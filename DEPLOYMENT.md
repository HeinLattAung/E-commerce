# Vercel Deployment Checklist

## Prerequisites

- [x] GitHub repository created and code pushed
- [x] Vercel account linked to GitHub
- [x] MongoDB Atlas cluster provisioned
- [x] Stripe account with API keys
- [x] Google Cloud OAuth credentials created
- [x] Cloudinary account (optional — for image uploads)

---

## 1. MongoDB Atlas Setup

1. Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Under **Database Access**, create a database user with read/write permissions
3. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) so Vercel's serverless functions can connect
4. Click **Connect → Drivers** and copy the connection string
5. Replace `<password>` and add your database name:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/luxestore?retryWrites=true&w=majority
   ```

## 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (production)
4. Copy the **Client ID** and **Client Secret**

## 3. Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy the **Publishable key** and **Secret key** (use live keys for production)
3. Set up the webhook:
   - Go to **Developers → Webhooks → Add endpoint**
   - URL: `https://your-domain.vercel.app/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `checkout.session.expired`
   - Copy the **Webhook signing secret**

## 4. Generate AUTH_SECRET

Run this command to generate a secure secret:

```bash
npx auth secret
# or
openssl rand -base64 32
```

---

## 5. Vercel Environment Variables

In your Vercel project → **Settings → Environment Variables**, add:

| Variable | Value | Environment |
|---|---|---|
| `DATABASE_URL` | `mongodb+srv://...` | Production, Preview |
| `AUTH_SECRET` | (generated above) | Production, Preview |
| `AUTH_URL` | `https://your-domain.vercel.app` | Production |
| `GOOGLE_CLIENT_ID` | (from Google Console) | All |
| `GOOGLE_CLIENT_SECRET` | (from Google Console) | All |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Production |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Production |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | All |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Production |
| `CLOUDINARY_CLOUD_NAME` | (from Cloudinary) | All |
| `CLOUDINARY_API_KEY` | (from Cloudinary) | All |
| `CLOUDINARY_API_SECRET` | (from Cloudinary) | Production |

> For **Preview** deployments, use Stripe test keys (`sk_test_...`, `pk_test_...`) and a separate test webhook.

---

## 6. Prisma Setup for Vercel

The `postinstall` script in `package.json` should run `prisma generate` automatically. If not, add it:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

After the first deploy, push the schema to your database:

```bash
npx prisma db push
```

Then seed the database (run locally with production DATABASE_URL):

```bash
npx prisma db seed
```

---

## 7. Deploy

1. Import the repository in Vercel
2. Framework preset: **Next.js** (auto-detected)
3. Build command: `next build` (default)
4. Output directory: `.next` (default)
5. Add all environment variables from step 5
6. Click **Deploy**

---

## 8. Post-Deploy Verification

- [ ] Homepage loads with products
- [ ] Google OAuth login works (check redirect URI matches)
- [ ] Email/password registration and login work
- [ ] Product pages render with images
- [ ] Add to cart and checkout flow works
- [ ] Stripe redirects to checkout and back
- [ ] Webhook receives events (check Stripe Dashboard → Webhooks → Events)
- [ ] Order status updates to PAID after payment
- [ ] Admin dashboard accessible only to ADMIN users
- [ ] `/admin` redirects non-admin users to homepage

---

## 9. Custom Domain (Optional)

1. In Vercel → **Settings → Domains**, add your domain
2. Update DNS records as instructed by Vercel
3. Update these after domain is active:
   - `AUTH_URL` → `https://yourdomain.com`
   - `NEXT_PUBLIC_APP_URL` → `https://yourdomain.com`
   - Google OAuth redirect URI → `https://yourdomain.com/api/auth/callback/google`
   - Stripe webhook URL → `https://yourdomain.com/api/stripe/webhook`

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `NEXTAUTH_URL` / `AUTH_URL` mismatch | Ensure `AUTH_URL` matches your actual deployment URL exactly |
| Google OAuth redirect error | Add the exact Vercel URL to Google Console authorized redirect URIs |
| Stripe webhook 400 errors | Verify `STRIPE_WEBHOOK_SECRET` matches the endpoint's signing secret |
| Prisma connection timeout | Ensure MongoDB Atlas Network Access allows `0.0.0.0/0` |
| `prisma generate` not running | Add `"postinstall": "prisma generate"` to package.json scripts |
