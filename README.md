# NTM Loyalty Console — Playwright Test Suite

![Playwright](https://img.shields.io/badge/Playwright-1.61+-45ba4b?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
![CI](https://github.com/utsavkuma123/ntm-playwright/actions/workflows/playwright.yml/badge.svg)

End-to-end test automation for the **NTM Loyalty Console** admin panel, built with [Playwright](https://playwright.dev/) and TypeScript.

---

## 📁 Project Structure

```
├── tests/                        # All test specs
│   ├── ntm-01-login.spec.ts      # TC-001–005  Authentication
│   ├── ntm-02-dashboard.spec.ts  # TC-006–012  Dashboard & KPIs
│   ├── ntm-03-dealers.spec.ts    # TC-013–019  Dealers module
│   ├── ntm-04-users.spec.ts      # TC-020–025  Users (Carpenters)
│   ├── ntm-05-products.spec.ts   # TC-026–031  Products & QR Codes
│   ├── ntm-06-banners.spec.ts    # TC-032–036  Banners
│   ├── ntm-07-pages.spec.ts      # TC-037–041  CMS Pages
│   ├── ntm-08-rewards.spec.ts    # TC-042–047  Rewards Store
│   ├── ntm-09-redemptions-referrals-languages-notifications.spec.ts
│   │                             # TC-048–055  Redemptions / Referrals / Languages / Notifications
│   ├── ntm-10-geography.spec.ts  # TC-056–064  States / Cities / Districts
│   ├── ntm-11-orders.spec.ts     # TC-065–070  Orders
│   ├── ntm-12-dynamic-values.spec.ts # TC-071–074  Dynamic Values
│   └── ntm-13-navigation.spec.ts # TC-075–079  Navigation & Security Guards
│
├── helpers/
│   └── login.ts                  # Shared loginAsAdmin() helper
│
├── playwright.config.ts          # Playwright configuration
├── package.json
└── .env                          # Local credentials (never committed)
```

---

## 🧪 Test Coverage

| File | Module | TCs |
|------|--------|-----|
| ntm-01-login | Authentication | TC-001 → TC-005 |
| ntm-02-dashboard | Dashboard & KPIs | TC-006 → TC-012 |
| ntm-03-dealers | Dealers | TC-013 → TC-019 |
| ntm-04-users | Users (Carpenters) | TC-020 → TC-025 |
| ntm-05-products | Products & QR | TC-026 → TC-031 |
| ntm-06-banners | Banners | TC-032 → TC-036 |
| ntm-07-pages | CMS Pages | TC-037 → TC-041 |
| ntm-08-rewards | Rewards Store | TC-042 → TC-047 |
| ntm-09-redemptions etc. | Redemptions / Referrals / Languages / Notifications | TC-048 → TC-055 |
| ntm-10-geography | States / Cities / Districts | TC-056 → TC-064 |
| ntm-11-orders | Orders | TC-065 → TC-070 |
| ntm-12-dynamic-values | Dynamic Values | TC-071 → TC-074 |
| ntm-13-navigation | Navigation & Security | TC-075 → TC-079 |

**Total: 79 test cases**

---

## ⚙️ Setup

### Prerequisites
- Node.js 18+
- npm

### Install

```bash
npm install
npx playwright install chromium
```

### Environment Variables

Create a `.env` file in the project root (never commit this):

```env
HD_BASE_URL=https://admindrls.swcapp.in
HD_EMAIL=your@email.com
HD_PASSWORD=yourpassword
```

---

## 🚀 Running Tests

```bash
# Run all NTM tests
npx playwright test --project="NTM Loyalty Console – Chrome"

# Run a specific module
npx playwright test tests/ntm-01-login.spec.ts --project="NTM Loyalty Console – Chrome"

# Run a specific test by TC number
npx playwright test --grep "TC-001" --project="NTM Loyalty Console – Chrome"

# Run headed (see the browser)
npx playwright test --project="NTM Loyalty Console – Chrome" --headed

# View HTML report
npx playwright show-report
```

---

## 🐛 Known Application Bugs Found

| # | Module | Bug Description |
|---|--------|-----------------|
| 1 | Products | `Sub-Dealer` coin column is missing from the Products table |
| 2 | Products | Product `1/2 inch Nails` renamed to `1/1 inch Nails` — inconsistent naming |
| 3 | Products | `Details` button replaced by `QR Records` link — no per-product detail view |
| 4 | Banners | Banner count is unstable — fluctuates between environments |
| 5 | Redemptions | Carpenter count grew from 6 → 12 — test data not isolated per environment |
| 6 | Redemptions | `ankit` coin balance changed from 485 → 484 — balance not stable |
| 7 | Languages | Unexpected `Mizo` language added — count changed from 3 → 4 |
| 8 | States | `ODISHA` state missing in new environment — data not migrated |
| 9 | Navigation | Sidebar `Products & QR` split into separate `Products` and `QR Records` links |

---

## 📊 CI / CD

Tests run automatically on every push and pull request via GitHub Actions.

See [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml).

---

## 🛠️ Tech Stack

- [Playwright](https://playwright.dev/) v1.61+
- TypeScript
- Node.js
- GitHub Actions
