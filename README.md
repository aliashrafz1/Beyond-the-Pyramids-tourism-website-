# Beyond the Pyramids — Full-Stack Tourism Web App

Node.js · Express.js · MongoDB · EJS | SWE230 Web Application Programming | Spring 2026

---

## Features

**Tourist**
- Browse day trips, week packages, and single-attraction tickets
- 3-step booking flow: pick tier → add travellers → confirm
- Custom Trip Architect to build a personalised itinerary
- Booking history, cancellation, and post-trip reviews
- Profile management with avatar upload
- Live weather widget (per destination) and EGP → USD/EUR/GBP currency converter on the booking summary

**Admin**
- Dashboard KPIs: users, bookings, revenue, open tickets
- Full CRUD for packages with image upload
- User management: suspend, change role, delete
- Booking status updates (confirmed → checked-in → checked-out)
- Support ticket inbox with replies
- Analytics & reports page

**Security**
- JWT in httpOnly cookie (7-day expiry)
- bcrypt password hashing
- Helmet HTTP headers, MongoDB-injection sanitisation, rate limiting
- Role-based access control: Tourist · Admin

---

## Project Requirements Coverage (SWE230 Rubric)

| Requirement | Weight | Where it's implemented |
|-------------|:------:|------------------------|
| **MVC & Routing** | 15 | `models/` → `controllers/` → `routes/` → `views/` (server-side EJS). `pageController.js` renders every page; `app.js` mounts all eight routers. |
| **Sessions & Authentication** (Security & Privacy) | 5 | JWT in an httpOnly cookie + bcrypt hashing (`authController.js`, `models/User.js`); `protect` / `authorize(role)` role-based access in `middleware/auth.js`. |
| **External API & Responsive UI** | 5 | OpenWeatherMap weather widget + ExchangeRate currency widget through `app.js` `/api/external/*`; responsive layouts and mobile navigation in `global.css` / `global.js`. |
| **Uploading Files** | 5 | `middleware/upload.js` — multer + Cloudinary for avatars, package images, and review photos. |
| **Error Handling** | 5 | Central `AppError` + 4-argument error middleware in `app.js`; `error403/404/500.ejs`; `try/catch` + `next(err)` in every controller. |
| **Data Validation** (Frontend + Backend) | 10 | `express-validator` chains in `middleware/validate.js`, mirrored by live client-side validation (`register.js`, `contact.js`, `travellers.js`, `writeReview.js`). |
| **CRUD operations** | 15 | Users, packages, bookings, reviews, and support tickets — full create / read / update / delete over the REST API. |
| **AJAX / Fetch** | 5 | Every form and admin action calls the REST API with `fetch()` and updates the page without a reload. |
| **Application UI/UX quality** | 5 | Cinematic public pages, scroll animations, and a custom cursor; clean admin dashboards with a dark/light theme. |
| **Innovation** | 10 | Custom Trip Architect wizard, live weather + currency widgets, automatic review-rating recalculation, and admin analytics. |
| **Bonus — HTTPS & Deployment** | 10 | Deployed on Railway over HTTPS (`railway.json`). |

> **Pagination & Localization** (bonus) is intentionally out of scope for this submission.

---

## Quick Start

### Prerequisites
- Node.js v18+
- A MongoDB connection (Atlas or local)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Create `.env` in the project root:
```
NODE_ENV=development
PORT=3000
MONGO_URL=mongodb://localhost:27017/beyondpyramids
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
OPENWEATHER_API_KEY=your_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
> Free OpenWeatherMap key at https://openweathermap.org/api — takes up to 2 hours to activate.  
> The currency converter uses the public ExchangeRate API — no key required.  
> Image uploads go to **Cloudinary** — create a free account at https://cloudinary.com and set the three `CLOUDINARY_*` keys above.  
> Optional: `MAX_FILE_SIZE` (default `2097152` — 2 MB) to override the upload limit.

### 3. Start the server
```bash
npm run dev      # nodemon — auto-restart on file save
npm start        # plain node
```

Open **http://localhost:3000**

---

## Demo Credentials

| Role    | Email            | Password  |
|---------|------------------|-----------|
| Tourist | user@egypt.com   | user123   |
| Admin   | admin@egypt.com  | admin123  |

---

## Project Structure

```
/
├── app.js                  Server entry point — middleware stack, route mounts,
│                           inline /api/external/weather & /api/external/currency handlers
├── .env                    Environment variables (see Quick Start)
│
├── controllers/
│   ├── authController.js   register, login, logout, getMe, updatePassword
│   ├── userController.js   Profile CRUD, avatar upload, admin user management
│   ├── packageController.js Package CRUD, image upload, filtering & sorting
│   ├── bookingController.js Draft → travellers → confirm flow, cancellation, admin ops
│   ├── reviewController.js  Create/read/update/delete + rating recalc trigger
│   ├── contactController.js Tickets: submit, list, status update, admin reply
│   ├── adminController.js   Dashboard stats, recent activity, user list
│   └── pageController.js    EJS render functions for every page
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── packageRoutes.js
│   ├── bookingRoutes.js
│   ├── reviewRoutes.js
│   ├── contactRoutes.js
│   ├── adminRoutes.js
│   └── pageRoutes.js
│
├── models/
│   ├── User.js             bcrypt pre-save hook, correctPassword(), changedPasswordAfter()
│   ├── Package.js          day / week / single types, itinerary arrays, auto rating
│   ├── Booking.js          Draft → confirmed, auto booking number EG-YYYY-NNNNN
│   ├── Review.js           Unique per user+package, calcAverageRating() static
│   ├── Contact.js          Support tickets with status & admin reply
│   └── TripOption.js       Destination / accommodation / room options for custom trips
│
├── middleware/
│   ├── auth.js             protect, optionalAuth, authorize(role)
│   ├── validate.js         express-validator chains for auth, package, review & contact
│   └── upload.js           multer + Cloudinary — 2 MB limit, JPEG/PNG/WebP only
│
├── views/                  EJS templates
│   ├── index.ejs           Landing page (hero, package previews, reviews carousel)
│   ├── login.ejs / register.ejs
│   ├── about.ejs / contact.ejs / faq.ejs / terms.ejs
│   ├── dayPackages.ejs / weekPackages.ejs / singlePackages.ejs
│   ├── packageDetails.ejs  Shell — JS builds the full page client-side
│   ├── userDashboard.ejs / userProfile.ejs / myBookings.ejs
│   ├── travellers.ejs / bookingSummary.ejs / bookingDetails.ejs
│   ├── writeReview.ejs / customTrip.ejs
│   ├── adminDashboard.ejs / adminBookings.ejs / adminPackages.ejs
│   ├── adminContact.ejs / adminUsers.ejs / adminReports.ejs
│   └── error403.ejs / error404.ejs / error500.ejs
│
├── public/
│   ├── css/                Per-page stylesheets + global.css design system
│   └── js/                 Per-page client scripts + global.js
│
└── railway.json            Railway deployment config (HTTPS hosting)
```

---

## Data Models

### User
| Field | Type | Notes |
|-------|------|-------|
| name | String | min 2 chars |
| email | String | unique, lowercase |
| password | String | bcrypt, excluded from default selects |
| phone / nationality / dob | String / String / Date | optional profile fields |
| image | String | avatar path |
| role | Enum | `Tourist` · `Admin` |
| status | Enum | `active` · `suspended` |

### Package
| Field | Type | Notes |
|-------|------|-------|
| name / city / description | String | required |
| type | Enum | `single` · `day` · `week` |
| price / discountedPrice | Number | min 0 |
| status | Enum | `active` · `inactive` (soft delete) |
| rating / reviewCount | Number | auto-calculated by Review model |
| itinerary | Array | `{time, activity}` — single/day packages |
| dailyItinerary | Array | `{day, title, activities}` — week packages |
| openingHours / closingDays / guidedTour | String | single/day extras |
| durationDays / nights / hotelName | Number/String | week extras |

### Booking
| Field | Type | Notes |
|-------|------|-------|
| bookingNumber | String | auto-generated `EG-YYYY-RANDOM`, unique |
| userId / userEmail | ObjectId / String | linked tourist |
| packageId / packageName / packageType | ref / String / Enum | `day · week · single · custom` |
| date / startDate / endDate | String / Date / Date | travel dates |
| travelers | Number | 1–15 |
| tier | Enum | `standard · deluxe · full · Architect Custom` |
| totalPrice / basePrice | Number | |
| status | Enum | `draft → confirmed → checked-in → checked-out → cancelled` |
| paymentStatus | Enum | `pending · paid` |
| additionalTravelers | Array | `{firstName, lastName, dob, nationality, phone}` |
| specialRequests / cancellationReason | String | |

### Review
| Field | Type | Notes |
|-------|------|-------|
| packageId / userId | ObjectId | compound unique — one review per user per package |
| rating | Number | 1–5, triggers `calcAverageRating()` on save/delete |
| title / text | String | max 100 / 10–2000 chars |

### Contact
| Field | Type | Notes |
|-------|------|-------|
| subject / message | String | required |
| email / customer | String | submitter identity |
| customerId | ObjectId | optional, if logged in |
| status | Enum | `open · resolved` |
| adminReply | String | set on reply, auto-resolves ticket |

### TripOption
Lookup table for the Custom Trip Architect.  
`type` ∈ `{destination, accommodation, room}` · `optId` · `name` · `price` · `mult` (pricing multiplier)

---

## Booking Flow

```
POST /api/bookings/draft          ← select package + tier + travelers + date
        ↓
PUT  /api/bookings/draft/:id       ← add additional traveller details + special requests
        ↓
PUT  /api/bookings/draft/:id/confirm  ← confirm → status: confirmed, paymentStatus: paid
```

A draft is visible on `/booking/travellers` and `/booking/summary`. Only confirmed bookings appear in `/my-bookings`.

---

## REST API Reference

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new Tourist account |
| POST | `/api/auth/login` | Public | Login — sets httpOnly JWT cookie |
| POST | `/api/auth/logout` | Public | Clear JWT cookie |
| GET | `/api/auth/me` | Protected | Get current user |
| PUT | `/api/auth/update-password` | Protected | Change password |

> Rate-limited: 20 requests / 15 min on `/api/auth/register` and `/api/auth/login`.

---

### Packages — `/api/packages`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/packages` | Public | List packages (`?type=day\|week\|single`, sort, paginate) |
| GET | `/api/packages/:id` | Public | Single package detail |
| POST | `/api/packages` | Admin | Create package |
| PUT | `/api/packages/:id` | Admin | Update package |
| DELETE | `/api/packages/:id` | Admin | Soft-delete (status → inactive) |
| POST | `/api/packages/:id/image` | Admin | Upload package image |

---

### Bookings — `/api/bookings`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings/draft` | Tourist | Create draft from package |
| GET | `/api/bookings/draft/:id` | Owner | Get draft |
| PUT | `/api/bookings/draft/:id` | Owner | Add traveller details + special requests |
| PUT | `/api/bookings/draft/:id/confirm` | Owner | Confirm & mark paid |
| GET | `/api/bookings/trip-options` | Tourist | Destinations / accommodation / room data |
| GET | `/api/bookings` | Tourist | My confirmed bookings |
| GET | `/api/bookings/:id` | Owner/Admin | Booking details |
| PUT | `/api/bookings/:id/cancel` | Owner/Admin | Cancel booking |

---

### Reviews — `/api/reviews`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/reviews` | Tourist | Submit review (triggers package rating recalc) |
| GET | `/api/reviews/package/:packageId` | Public | All reviews for a package |
| GET | `/api/reviews` | Admin | All reviews site-wide |
| PUT | `/api/reviews/:id` | Owner | Edit review |
| DELETE | `/api/reviews/:id` | Owner/Admin | Delete review |

---

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/profile` | Tourist | My profile |
| PUT | `/api/users/profile` | Tourist | Update name, phone, nationality, dob |
| PUT | `/api/users/avatar` | Tourist | Upload avatar |
| DELETE | `/api/users/account` | Tourist | Delete own account |
| GET | `/api/users` | Admin | All users (paginated, filter by role/status) |
| PATCH | `/api/users/:id/status` | Admin | Suspend / activate |
| PATCH | `/api/users/:id/role` | Admin | Change role |
| PATCH | `/api/users/:id/profile` | Admin | Edit user details |
| DELETE | `/api/users/:id` | Admin | Delete user |

---

### Contact — `/api/contact`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/contact` | Public | Submit support ticket |
| GET | `/api/contact/my-tickets` | Tourist | My tickets |
| GET | `/api/contact` | Admin | All tickets (filter by status) |
| PATCH | `/api/contact/:id/status` | Admin | Update ticket status |
| POST | `/api/contact/:id/reply` | Admin | Reply and auto-resolve |

---

### Admin — `/api/admin`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/stats` | Admin | Dashboard KPIs (users, bookings, revenue, tickets) |
| GET | `/api/admin/activity` | Admin | Last 10 bookings |
| GET | `/api/admin/users` | Admin | Paginated user list |
| GET | `/api/admin/bookings` | Admin | All bookings with filters |
| PATCH | `/api/admin/bookings/:id/status` | Admin | Change booking status |

---

### External APIs — `/api/external`

Inline handlers in `app.js`. Both fail silently — widget disappears, nothing breaks.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/external/weather?city=Cairo` | Public | Current weather via OpenWeatherMap (`OPENWEATHER_API_KEY` required) |
| GET | `/api/external/currency?amount=4500&from=EGP` | Public | EGP → USD / EUR / GBP via open.exchangerate-api.com (no key) |

**Where they appear:**
- **Weather widget** — inside the booking rail on the Package Details page, between the tier selector and the date picker. Fetched by `initWeatherWidget()` in `packageDetails.js` using the package's `city` field.
- **Currency widget** — below the EGP total on the Booking Summary page, shown as `≈ $XX USD · €XX EUR · £XX GBP`.

---

## Page Routes

| URL | Page | Auth |
|-----|------|------|
| `/` | Landing page | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/packages/day` | Day packages listing | No |
| `/packages/week` | Week packages listing | No |
| `/packages/single` | Single locations listing | No |
| `/packages/:id` | Package detail + booking flow | No |
| `/contact` | Contact / support form | No |
| `/about` | About us | No |
| `/faq` | FAQ | No |
| `/terms` | Terms & Conditions | No |
| `/dashboard` | User dashboard | Tourist |
| `/profile` | Profile settings | Tourist |
| `/my-bookings` | Booking history | Tourist |
| `/booking/travellers?draftId=` | Add traveller details | Tourist |
| `/booking/summary?draftId=` | Review booking before confirming | Tourist |
| `/booking/:id` | Booking receipt | Tourist |
| `/reviews/write` | Submit review | Tourist |
| `/custom-trip` | Trip Architect | Tourist |
| `/admin` | Admin dashboard | Admin |
| `/admin/bookings` | Booking management | Admin |
| `/admin/packages` | Package management | Admin |
| `/admin/contact` | Support ticket management | Admin |
| `/admin/users` | User management | Admin |
| `/admin/reports` | Analytics & reports | Admin |

---

## Architecture

- **Pattern**: MVC — Models → Controllers → Views (EJS server-side rendering)
- **Auth**: JWT in httpOnly cookie; middleware chain: `protect` / `optionalAuth` / `authorize(role)`
- **Roles**: Tourist · Admin
- **Error handling**: Centralised `AppError` class + 4-argument error middleware; renders HTML error pages (`error403/404/500.ejs`) for page routes, JSON for `/api` routes. Automatically redirects 401s to `/login`.
- **Validation**: `express-validator` chains in `middleware/validate.js` (auth, package, review, contact) mirrored by client-side validation in the page scripts
- **File uploads**: multer + Cloudinary storage, 2 MB limit, JPEG/PNG/WebP only
- **Security**: Helmet (CSP disabled for EJS inline scripts), express-mongo-sanitize, rate-limit (200 req / 15 min on `/api`)
- **Soft deletes**: Packages use `status: inactive` rather than hard deletion
- **Rating calculation**: `Review.calcAverageRating()` runs as a post-save and post-delete hook, keeping `Package.rating` and `Package.reviewCount` in sync automatically
- **External integrations**: OpenWeatherMap (weather widget, free tier) · open.exchangerate-api.com (currency, keyless)
- **Dependencies**: Only lecture-approved packages for SWE230 — see `package.json`

---

## Deployment

The app is deployed on **Railway** (`railway.json`) and served over **HTTPS**. To deploy your own copy:

1. Push the repo to GitHub and create a new Railway project from it.
2. Add the same environment variables from [Quick Start](#2-configure-environment) in the Railway dashboard — `MONGO_URL`, `JWT_SECRET`, `OPENWEATHER_API_KEY`, and the three `CLOUDINARY_*` keys.
3. Railway runs `npm start` and assigns an HTTPS URL automatically.
