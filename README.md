# EMR Appointment System — Frontend

> A modern Electronic Medical Records (EMR) Appointment System built with React, TypeScript, and Vite. Role-based access control ensures each user sees only what they need.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 3 |
| State Management | Zustand 5 |
| HTTP Client | Axios |
| Routing | React Router DOM v7 |
| Icons | Lucide React |

---

## 📁 Project Structure

```
src/
├── App.tsx
├── main.tsx
├── vite-env.d.ts
│
├── components/
│   └── ui/
│       ├── Button.tsx          # Reusable button with loading state
│       └── Input.tsx           # Reusable input with icon support
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   └── LoginForm.tsx
│   │   ├── pages/
│   │   │   └── LoginPage.tsx
│   │   ├── services/
│   │   │   └── auth.api.ts
│   │   ├── store/
│   │   │   └── auth.store.ts   # Zustand store (persisted)
│   │   └── types/
│   │       └── auth.types.ts
│   │
│   ├── admin/
│   │   ├── components/
│   │   │   ├── DoctorTable.tsx
│   │   │   ├── DoctorForm.tsx
│   │   │   └── UserTable.tsx
│   │   ├── pages/
│   │   │   ├── ManageDoctorsPage.tsx
│   │   │   └── ManageUsersPage.tsx
│   │   ├── services/
│   │   │   └── admin.api.ts
│   │   └── types/
│   │       └── admin.types.ts
│   │
│   ├── appointments/
│   │   ├── pages/
│   │   │   └── BookAppointmentPage.tsx
│   │   └── services/
│   │       └── appointment.api.ts
│   │
│   ├── dashboard/
│   │   └── pages/
│   │       └── DashboardPage.tsx
│   │
│   ├── doctors/
│   │   └── services/
│   │       └── doctor.api.ts
│   │
│   └── patients/
│       ├── pages/
│       │   └── CreatePatientPage.tsx
│       └── services/
│           └── patient.api.ts
│
├── layout/
│   ├── MainLayout.tsx
│   ├── Navbar.tsx
│   └── Sidebar.tsx             # SUPER_ADMIN links rendered conditionally
│
├── lib/
│   └── api.ts                  # Centralized Axios instance + interceptors
│
├── routes/
│   ├── index.tsx               # All route definitions
│   ├── ProtectedRoute.tsx      # Requires authentication
│   └── RoleProtectedRoute.tsx  # Requires specific role(s)
│
└── styles/
    └── globals.css
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000/api
PORT=5173
```

> ⚠️ Only variables prefixed with `VITE_` are exposed to the browser.

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 🔐 Authentication

- Login is handled via `POST /api/auth/login`
- Auth state is persisted in **localStorage** using Zustand's `persist` middleware
- The Axios instance (`src/lib/api.ts`) automatically:
  - Attaches cookies via `withCredentials: true`
  - Intercepts `401` responses and attempts a silent token refresh via `POST /api/auth/refresh`
  - Redirects to `/login` if the refresh also fails
  - Ignores refresh loops for `/auth/login` and `/auth/refresh` routes

---

## 🛡 Role-Based Access Control (RBAC)

| Role | Access |
|---|---|
| `SUPER_ADMIN` | Full access — can manage doctors and system users |
| `ADMIN` | Standard admin access |
| `DOCTOR` | Doctor-specific routes |
| `RECEPTIONIST` | Reception workflows |
| `PATIENT` | Patient-facing pages |

### Route Guards

| Component | Location | Behaviour |
|---|---|---|
| `ProtectedRoute` | `routes/ProtectedRoute.tsx` | Redirects unauthenticated users to `/login` |
| `RoleProtectedRoute` | `routes/RoleProtectedRoute.tsx` | Redirects unauthorized roles to `/dashboard` |

The sidebar automatically **shows/hides** the **Super Admin** section based on the logged-in user's role.

---

## 📡 API Routes (consumed)

| Method | Endpoint | Feature |
|---|---|---|
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/refresh` | Token refresh |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/doctors` | List doctors |
| `POST` | `/api/doctors` | Create doctor |
| `PUT` | `/api/doctors/:id` | Update doctor |
| `PATCH` | `/api/doctors/:id` | Toggle availability |
| `GET` | `/api/users` | List users |
| `POST` | `/api/users` | Create user |
| `PATCH` | `/api/users/:id` | Update role / status |
| `GET` | `/api/appointments` | List appointments |
| `GET` | `/api/slots` | List slots |

---

## 🧩 Key Design Decisions

- **Feature-based folder structure** — each domain (auth, admin, appointments) is fully self-contained with its own components, pages, services, and types.
- **Centralized Axios instance** — all API calls go through `src/lib/api.ts` for consistent credential handling and error interception.
- **Zustand for state** — lightweight, boilerplate-free, with built-in persistence support.
- **Separation of concerns** — pages coordinate logic only; UI lives in dedicated components; API calls live in service files.
