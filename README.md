"# frontend_stayease" 

## Run Frontend

1. Install dependencies:

```bash
npm install
```

2. Set environment variables in a `.env` file (optional but recommended):

```dotenv
VITE_API_BASE_URL=http://localhost:5000
VITE_PAYMENT_API_BASE_URL=http://localhost:4004
VITE_INTERNAL_SERVICE_KEY=replace-this-with-strong-random-value
VITE_FALLBACK_BEARER_TOKEN=demo-token
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. Start dev server:

```bash
npm run dev
```

## Payment Integration Page

- Open: `/payments`
- This page is integrated with Payment Service endpoints:
	- `POST /payments`
	- `GET /payments/:bookingId`
	- `POST /payments/refund`
	- `POST /notifications/send`
	- `GET /notifications/history`

## Backend Requirements for Full Functionality

- Payment service running on `http://localhost:4004`
- Auth verification service running on `http://localhost:4001`
- Backend `.env` configured with matching `INTERNAL_SERVICE_KEY`
- Frontend `.env` configured with `VITE_STRIPE_PUBLISHABLE_KEY` for Stripe card input
