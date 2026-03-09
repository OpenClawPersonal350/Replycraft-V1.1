# ReplyCraft AI — Frontend

AI-powered review management SaaS. This frontend is built with **React + Vite + TypeScript + Tailwind CSS + shadcn/ui** and is designed to connect to a Node.js/Express/MongoDB backend.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Environment Variables](#environment-variables)
4. [API Architecture](#api-architecture)
5. [API Endpoint Map](#api-endpoint-map)
6. [Authentication Flow](#authentication-flow)
7. [Connecting the Backend](#connecting-the-backend)
8. [Adding New API Endpoints](#adding-new-api-endpoints)
9. [Adding New Dashboard Pages](#adding-new-dashboard-pages)
10. [Platform Integrations](#platform-integrations)
11. [State Management](#state-management)
12. [Routing](#routing)
13. [Theming & Design System](#theming--design-system)

---

## Quick Start

```bash
# 1. Clone the repo
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env with your backend URL

# 4. Start dev server
npm run dev
# App runs at http://localhost:8080
```

---

## Project Structure

```
src/
├── api/                    # Centralized API layer
│   ├── client.ts           # Base fetch client (auth headers, error handling)
│   ├── types.ts            # All TypeScript interfaces for API requests/responses
│   ├── hooks.ts            # React Query hooks used by pages
│   ├── mock-data.ts        # Mock data (dev only, behind DEV_BYPASS flag)
│   ├── index.ts            # Central re-export of all API modules
│   └── endpoints/          # One file per API domain
│       ├── auth.ts         # Login, signup, OTP, password reset
│       ├── dashboard.ts    # Dashboard stats, charts, activity
│       ├── reviews.ts      # Review CRUD, AI reply actions
│       ├── analytics.ts    # Analytics overview, charts
│       ├── integrations.ts # Platform connect/disconnect/sync
│       ├── settings.ts     # Business settings, notifications
│       ├── billing.ts      # Plans, invoices, usage
│       ├── payment.ts      # Payment flow, coupons, region
│       ├── profile.ts      # User profile, avatar upload
│       ├── contact.ts      # Contact form
│       └── landing.ts      # Public landing page data
├── components/
│   ├── ui/                 # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── dashboard/          # Dashboard layout, skeletons, notifications
│   ├── landing/            # Landing page sections (hero, pricing, etc.)
│   └── payment/            # Payment flow components
├── contexts/
│   └── UserContext.tsx      # Global user state (syncs with /profile API)
├── hooks/
│   ├── useAuth.tsx          # Auth provider, JWT management, route protection
│   ├── use-theme.tsx        # Theme (light/dark) management
│   └── use-mobile.tsx       # Mobile breakpoint detection
├── pages/                   # Route-level page components
│   ├── DashboardHome.tsx
│   ├── Reviews.tsx
│   ├── Analytics.tsx
│   ├── Integrations.tsx
│   ├── SettingsPage.tsx
│   ├── Billing.tsx
│   ├── Upgrade.tsx
│   ├── Payment.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── VerifyOtp.tsx
│   └── ...
├── lib/
│   └── utils.ts             # Utility functions (cn, formatters)
├── data/                    # Static config (countries, payment config)
└── App.tsx                  # Root component with routing
```

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

The variable is consumed in `src/api/client.ts`:

```ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
```

---

## API Architecture

```
Page Component
  └── React Query Hook (src/api/hooks.ts)
        └── Endpoint Function (src/api/endpoints/*.ts)
              └── apiClient() (src/api/client.ts)
                    └── fetch() → Backend
```

### Key Design Decisions

- **`apiClient()`** — Central fetch wrapper that automatically:
  - Prepends `VITE_API_BASE_URL` to all endpoints
  - Attaches `Authorization: Bearer <token>` from localStorage
  - Parses JSON responses
  - Throws `ApiError` with status code on non-2xx responses
  - Auto-clears token on 401 responses

- **React Query** — All data fetching uses `@tanstack/react-query` for caching, refetching, and loading/error states.

- **DEV_BYPASS** — Flag in `src/hooks/useAuth.tsx` (`const DEV_BYPASS = true`). When `true`, auth is not enforced so the UI is navigable without a running backend. **Set to `false` for production.**

---

## API Endpoint Map

### Auth (`src/api/endpoints/auth.ts`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Login with email/password → returns `{ user, token }` |
| POST | `/auth/signup` | Register new user → returns `{ user, token }` |
| POST | `/auth/logout` | Invalidate session |
| GET | `/auth/me` | Get current authenticated user |
| POST | `/auth/reset-password` | Request password reset email |
| PUT | `/auth/update-password` | Change password (authenticated) |
| POST | `/auth/verify-otp` | Verify 6-digit OTP → returns `{ user, token }` |
| POST | `/auth/resend-otp` | Resend OTP to email |

### Dashboard (`src/api/endpoints/dashboard.ts`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Full dashboard data (stats, charts, activity) |
| GET | `/dashboard/stats` | Stats cards only |
| GET | `/dashboard/chart?period=` | Chart data with optional period filter |
| GET | `/dashboard/sentiment` | Sentiment distribution data |
| GET | `/dashboard/activity?limit=` | Recent activity feed |

### Reviews (`src/api/endpoints/reviews.ts`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/reviews?platform=&status=&page=&limit=` | Paginated reviews with filters |
| POST | `/reviews/:id/action` | Approve, reject, or edit a review reply |
| POST | `/reviews/:id/generate` | Generate AI reply for a review |
| POST | `/reviews/:id/send` | Send approved reply to platform |

### Analytics (`src/api/endpoints/analytics.ts`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/analytics/overview?period=` | Full analytics overview |
| GET | `/analytics/reviews-over-time?period=` | Reviews trend chart data |
| GET | `/analytics/platform-distribution` | Reviews by platform |
| GET | `/analytics/reply-success-rate` | AI reply success rate over time |

### Integrations (`src/api/endpoints/integrations.ts`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/integrations` | List all integrations with connection status |
| POST | `/integrations/:id/toggle` | Connect or disconnect a platform |
| POST | `/integrations/:id/sync` | Trigger manual sync |
| DELETE | `/integrations/:id` | Remove integration |

### Settings (`src/api/endpoints/settings.ts`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/settings` | Get business settings |
| PUT | `/settings` | Update business settings |
| GET | `/settings/notifications` | Get notification preferences |
| PUT | `/settings/notifications` | Update notification preferences |
| PUT | `/settings/password` | Change password |

### Profile (`src/api/endpoints/profile.ts`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/profile` | Get user profile |
| PUT | `/profile` | Update profile fields |
| POST | `/profile/avatar` | Upload avatar (multipart/form-data) |
| POST | `/profile/complete-onboarding` | Mark onboarding as completed |

### Billing (`src/api/endpoints/billing.ts`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/billing` | Full billing info (plan, usage, invoices) |
| GET | `/billing/usage` | Current usage stats |
| GET | `/billing/invoices` | Invoice history |
| GET | `/billing/invoices/:id/download` | Download invoice PDF URL |
| POST | `/billing/change-plan` | Switch plan |
| POST | `/billing/cancel` | Cancel subscription |
| GET | `/billing/upgrade-options?currentPlan=` | Available upgrade plans |

### Payment (`src/api/endpoints/payment.ts`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/payment/region` | Detect user region/currency |
| GET | `/payment/methods?region=` | Available payment methods |
| GET | `/payment/summary?planId=&billing=` | Order summary with pricing |
| POST | `/payment/coupon/validate` | Validate coupon code |
| POST | `/payment/init` | Initialize payment → returns gateway details |
| POST | `/payment/verify` | Verify payment completion |

### Contact (`src/api/endpoints/contact.ts`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/contact` | Submit contact form |

### Landing (`src/api/endpoints/landing.ts`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/landing/testimonials` | Landing page testimonials |
| GET | `/landing/pricing` | Public pricing plans |

---

## Authentication Flow

```
1. User signs up → POST /auth/signup
2. Backend sends OTP to email
3. User enters OTP → POST /auth/verify-otp
4. Backend returns { user, token }
5. Frontend stores token in localStorage via setAuthToken()
6. All subsequent API calls include: Authorization: Bearer <token>
7. On 401 response → token cleared, user redirected to /login
```

### Key Files

| File | Role |
|---|---|
| `src/hooks/useAuth.tsx` | `AuthProvider` context, `useAuth()` hook, `ProtectedRoute` component |
| `src/api/client.ts` | `setAuthToken()`, `clearAuthToken()`, auto-attaches header |

### Auth Header Usage

```ts
// Automatically handled by apiClient()
// Every request includes:
headers: {
  "Authorization": "Bearer <token_from_localStorage>",
  "Content-Type": "application/json"
}
```

### DEV_BYPASS Mode

In `src/hooks/useAuth.tsx`:

```ts
const DEV_BYPASS = true; // Set to false when backend is connected
```

When `true`: all routes are accessible, `isAuthenticated` returns `true`, no API calls needed.

---

## Connecting the Backend

### Step 1 — Set the API URL

```env
VITE_API_BASE_URL=https://your-backend.com/api
```

### Step 2 — Disable DEV_BYPASS

In `src/hooks/useAuth.tsx`, change:

```ts
const DEV_BYPASS = false;
```

### Step 3 — Implement Backend Endpoints

Your backend must implement all endpoints listed in the [API Endpoint Map](#api-endpoint-map). Each endpoint should return JSON matching the TypeScript interfaces in `src/api/types.ts`.

### Step 4 — CORS Configuration

Your backend must allow requests from the frontend origin:

```js
// Express example
app.use(cors({
  origin: ['http://localhost:8080', 'https://your-frontend.com'],
  credentials: true
}));
```

### Expected Response Formats

All responses should be JSON. See `src/api/types.ts` for complete TypeScript interfaces. Example:

```json
// POST /auth/login response
{
  "user": {
    "id": "abc123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "plan": "pro",
    "createdAt": "2025-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## Adding New API Endpoints

### 1. Define types in `src/api/types.ts`

```ts
export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
}
```

### 2. Create endpoint file `src/api/endpoints/automation.ts`

```ts
import { apiClient } from "../client";
import type { AutomationRule } from "../types";

export const automationApi = {
  getAll: () => apiClient<AutomationRule[]>("/automation/rules"),
  create: (data: Omit<AutomationRule, "id">) =>
    apiClient<AutomationRule>("/automation/rules", { method: "POST", body: data }),
  toggle: (id: string, enabled: boolean) =>
    apiClient<AutomationRule>(`/automation/rules/${id}`, { method: "PATCH", body: { enabled } }),
};
```

### 3. Register in `src/api/index.ts`

```ts
export { automationApi } from "./endpoints/automation";
// Add to the api object
```

### 4. Add React Query hook in `src/api/hooks.ts`

```ts
export function useAutomationRules() {
  return useQuery({ queryKey: ["automation-rules"], queryFn: automationApi.getAll });
}
```

### 5. Use in page component

```tsx
const { data: rules, isLoading, error } = useAutomationRules();
```

---

## Adding New Dashboard Pages

1. Create page component in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx` inside the dashboard layout:
   ```tsx
   <Route path="/dashboard/new-page" element={<ProtectedRoute><DashboardLayout><NewPage /></DashboardLayout></ProtectedRoute>} />
   ```
3. Add nav link in `src/components/dashboard/DashboardLayout.tsx`
4. Create API hook for the page's data

---

## Platform Integrations

Supported platforms are defined by the backend via `GET /integrations`. The frontend renders them dynamically. To add a new platform:

1. **Backend**: Add the platform to the integrations collection
2. **Frontend**: Add the platform logo to `public/logos/<platform>.svg`
3. No frontend code changes needed — the integrations page renders dynamically

Currently supported: Google, Yelp, TripAdvisor, Trustpilot, Flipkart, App Store, Google Play, Amazon

---

## State Management

| Layer | Tool | Usage |
|---|---|---|
| Server state | React Query | API data fetching, caching, refetching |
| Auth state | React Context (`useAuth`) | JWT token, current user, login/logout |
| User profile | React Context (`UserContext`) | Global user info synced with `/profile` |
| Local UI state | React `useState` | Form inputs, modals, filters |

---

## Routing

| Path | Page | Protected |
|---|---|---|
| `/` | Landing page | No |
| `/login` | Login | No |
| `/signup` | Signup | No |
| `/verify-otp` | OTP verification | No |
| `/dashboard` | Dashboard home | Yes |
| `/dashboard/reviews` | Review inbox | Yes |
| `/dashboard/analytics` | Analytics | Yes |
| `/dashboard/integrations` | Integrations | Yes |
| `/dashboard/settings` | Settings | Yes |
| `/dashboard/billing` | Billing | Yes |
| `/dashboard/upgrade` | Upgrade plan | Yes |
| `/payment` | Payment flow | Yes |
| `/payment/success` | Payment success | Yes |
| `/payment/failed` | Payment failed | Yes |
| `/about` | About page | No |
| `/contact` | Contact page | No |
| `/blog` | Blog | No |
| `/privacy` | Privacy policy | No |
| `/terms` | Terms of service | No |

---

## Theming & Design System

- **CSS Variables**: Defined in `src/index.css` using HSL values
- **Tailwind Config**: `tailwind.config.ts` maps CSS variables to Tailwind classes
- **Semantic tokens**: `--background`, `--foreground`, `--primary`, `--accent`, `--muted`, etc.
- **Dark mode**: Supported via `next-themes` with class-based toggling
- **Components**: shadcn/ui primitives in `src/components/ui/`

Never use hardcoded colors in components — always use semantic tokens like `bg-primary`, `text-muted-foreground`, etc.

---

## Running Tests

```bash
npm run test
# or
npx vitest
```

---

## License

Proprietary — ReplyCraft AI
