used my sql for db

To run the demo, first install the npm dependencies:

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

Stripe checkout setup (`frontend/.env.local`):

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Used by Stripe webhook route to update orders in Strapi
STRAPI_API_TOKEN=your_strapi_api_token_with_order_update_permission
```

Webhook endpoint:

```bash
http://localhost:3000/api/stripe/webhook
```
