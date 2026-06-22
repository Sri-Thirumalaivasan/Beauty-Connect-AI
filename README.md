# Glamr Bangalore (Beauty Connect AI) — Beauty Salon Marketplace
**SuperXgen AI Startup Buildathon 2026** · MVC Architecture · v2.0

---

## Live features
- **Hero slider**: 4-slide auto-carousel with arrows/dots + smooth transitions.
- **Global footer**: consistent company info, links, contact + socials on every page.
- **43 salons**: unique images + gallery arrays + 6+ services per salon (via mock data).
- **Fixed filters**: area filters show accurate matches and counts.
- **Clickable “How it works”**: step cards route to the correct pages.
- **Modern Auth UI**: split-screen Login/Signup with glassmorphism + password visibility toggle.
- **Contact page**: form + FAQ + full contact details.
- **Skeleton loaders**: shimmer loading states on listing pages.
- **Performance**: routes are lazy-loaded with `React.lazy`.
- **Service chips**: preview services on every salon card.

---

## MVC architecture (project structure)

```txt
src/
├── models/           # Pure data: SalonModel, BookingModel, UserModel, ReviewModel
├── controllers/      # Business logic hooks: Auth, Salon, Booking, AI
├── services/
│   ├── firebase/     # firebaseConfig, authService, salonService
│   └── api/          # aiService, mockData (43 salons)
├── views/
│   ├── components/
│   │   ├── layout/   # Navbar (sticky/scroll), Footer
│   │   └── ui/       # SalonCard, HeroSlider
│   │   └── common/   # Spinner, Toast, PrivateRoute, AdminRoute
│   └── pages/        # All pages (lazy-loaded)
├── utils/            # constants.js, helpers.js
├── styles/           # global.css (design tokens)
└── App.jsx           # Root router + Auth wiring
```

---

## Getting started

### 1) Install dependencies
```bash
npm install
```

### 2) Run locally
```bash
npm start
```

Open: `http://localhost:3000`

> Works out-of-the-box with **mock salons** (no Firebase API keys required).

---

## Configuration

### Firebase
- Edit: `src/services/firebase/firebaseConfig.js`
- If you want live data instead of mock data, update the toggle in:
  - `src/services/firebase/salonService.js`

### AI Stylist Finder (if applicable)
Set the environment variable used by the AI integration (example):
```bash
REACT_APP_ANTHROPIC_API_KEY=your_key_here
```

---

## Payment flow
- Payment screen: `src/views/pages/PaymentPage.jsx`
- QR payment uses `react-qr-code`
- Confirmation updates booking details on `BookingConfirmPage.jsx`

---

## Salons (12+ areas)
Bodycraft (8) · Lakme (6) · YLG (5) · Naturals (4) · Enrich (4) ·
BBLUNT (2) · JCB (2) · Blown (2) · Franck Provost (2) · Jawed Habib (2) ·
Toni & Guy · Mirrors · Alchemic · BarberCo · Straight Salon · Studio 11 · Green Trends

---

Built by **Sri Thirumalai Vasan S, Vignesh U, Rameshbabu** for **SuperXgen AI Startup Buildathon 2026**

