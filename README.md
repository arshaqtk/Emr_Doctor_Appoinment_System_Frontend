# EMR Appointment System — Frontend

> A modern Electronic Medical Records (EMR) Appointment System built with React, TypeScript, and Vite. Role-based access control ensures each user sees only what they need. Feature-based module architecture keeps every domain fully self-contained.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 3 |
| State Management | Zustand 5 |
| HTTP Client | Axios (with interceptors) |
| Routing | React Router DOM v7 |
| Icons | Lucide React |

---

## 📁 Project Structure

```
src/
├── App.tsx
├── main.tsx
│
├── components/
│   └── ui/
│       ├── Button.tsx              # Reusable button with loading state
│       └── Input.tsx               # Reusable input with icon support
│
├── features/
│   │
│   ├── auth/                       # LOGIN / LOGOUT / TOKEN REFRESH
│   │   ├── components/LoginForm.tsx
│   │   ├── pages/LoginPage.tsx
│   │   ├── services/auth.api.ts
│   │   ├── store/auth.store.ts     # Zustand (persisted to localStorage)
│   │   └── types/auth.types.ts     # User, LoginCredentials, AuthState
│   │
│   ├── admin/                      # SUPER_ADMIN: Manage Doctors & Users
│   │   ├── components/
│   │   │   ├── DoctorTable.tsx
│   │   │   ├── DoctorForm.tsx
│   │   │   └── UserTable.tsx
│   │   ├── pages/
│   │   │   ├── ManageDoctorsPage.tsx
│   │   │   └── ManageUsersPage.tsx
│   │   ├── services/admin.api.ts
│   │   └── types/admin.types.ts
│   │
│   ├── appointments/               # APPOINTMENT BOOKING + DOCTOR VIEW
│   │   ├── components/
│   │   │   ├── PatientSelector.tsx     # EXISTING search autocomplete / NEW inline form
│   │   │   ├── DoctorSelector.tsx      # Fetches GET /doctors, renders dropdown
│   │   │   ├── DateSelector.tsx        # Date picker (min = today)
│   │   │   ├── SlotGrid.tsx            # Time slot buttons (available/booked/selected)
│   │   │   ├── AppointmentForm.tsx     # Booking summary + purpose/notes + confirm
│   │   │   ├── AppointmentFilters.tsx  # Date + status filter bar (doctor view)
│   │   │   └── AppointmentTable.tsx    # Table with loading/empty/error + pagination
│   │   ├── pages/
│   │   │   ├── BookAppointmentPage.tsx # 4-step booking flow (orchestrator)
│   │   │   ├── MyAppointmentsPage.tsx  # Doctor's own appointment list
│   │   │   └── AppointmentsListPage.tsx # Master list for all bookings
│   │   ├── services/appointment.api.ts # getSlots, bookAppointment, getAppointments, markArrived
│   │   └── types/appointment.types.ts  # Slot, CreateAppointmentPayload, Appointment, AppointmentsResponse
│   │
│   ├── dashboard/                  # Retired in favor of direct lists
│   │   └── pages/DashboardPage.tsx
│   │
│   ├── doctors/                    # DOCTOR SCHEDULE MANAGEMENT
│   │   ├── components/
│   │   │   ├── ScheduleForm.tsx
│   │   │   ├── SlotGrid.tsx
│   │   │   └── DoctorScheduleCalendar.tsx
│   │   ├── pages/DoctorSchedulePage.tsx
│   │   ├── services/doctorSchedule.api.ts
│   │   └── types/schedule.types.ts
│   │
│   └── patients/                   # PATIENT REGISTRATION & LIST
│       ├── components/
│       │   ├── PatientForm.tsx      # Name, mobile, email, gender, age with validation
│       │   └── PatientTable.tsx     # Searchable table with pagination
│       ├── pages/
│       │   ├── CreatePatientPage.tsx
│       │   └── PatientListPage.tsx  # Debounced search (350ms), pagination
│       ├── services/patient.api.ts  # getPatients, createPatient, getPatientById, searchPatients
│       └── types/patient.types.ts   # Patient, CreatePatientPayload, PatientsListResponse
│
├── layout/
│   ├── MainLayout.tsx
│   ├── Navbar.tsx                  # Simplified (Notifications removed)
│   └── Sidebar.tsx                 # Role-aware nav (Direct landing)
│
├── lib/
│   └── api.ts                      # Centralized Axios instance + silent refresh interceptor
│
├── routes/
│   ├── index.tsx                   # All route definitions
│   ├── RootRedirect.tsx            # Landing redirect logic
│   ├── ProtectedRoute.tsx          # Requires isAuthenticated
│   └── RoleProtectedRoute.tsx      # Requires specific role(s)
│
└── styles/
    └── globals.css
```

---

## ⚙️ Environment Variables

Create `.env` in `frontend/`:

```env
VITE_API_URL=http://localhost:8000/api
```

> Only variables prefixed with `VITE_` are exposed to the browser.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- Backend running on `http://localhost:8000`

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
# App available at http://localhost:5173
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🔐 Authentication

- Login → `POST /api/auth/login` — sets `accessToken` + `refreshToken` as **HTTP-only cookies**
- Tokens are **never stored in localStorage** and **never attached manually as headers**
- Axios instance uses `withCredentials: true` so cookies are sent automatically
- On a `401` response, the interceptor silently calls `POST /api/auth/refresh` and retries
- If refresh fails → redirect to `/login`
- Auth state (user object) persisted in `localStorage` via Zustand `persist` middleware (user info only, not tokens)

---

## 🛡 Role-Based Access Control

### Roles

| Role | Access Level |
|---|---|
| `SUPER_ADMIN` | Full access — manage doctors, users, all features |
| `ADMIN` | Standard admin access |
| `DOCTOR` | Doctor-specific view only (My Appointments, My Schedule) |
| `RECEPTIONIST` | Patient management, appointment booking |
| `PATIENT` | Patient-facing pages |

### Sidebar Navigation (role-aware)

| Role | Visible Links |
|---|---|
| Role | Visible Links (Main Group) |
|---|---|
| **DOCTOR** | My Appointments · My Schedule |
| **Others** (Receptionist, Admin) | Booked Appointments · Book Appointment · Patients · Create Patient · Doctor Schedule |
| **SUPER_ADMIN** | All staff links + Manage Doctors · Manage Users |

### Initial Landing (RootRedirect)

When a user logs in or visits the root `/`, the system automatically redirects them based on their role:
- **DOCTORS** → `/appointments/my` (Their personal schedule)
- **OTHERS** → `/appointments` (The master booked list)

| Component | Behaviour |
|---|---|
| `ProtectedRoute` | Redirects unauthenticated users to `/login` |
| `RoleProtectedRoute` | Redirects unauthorized roles to `/dashboard` |

---

## 📑 Routes

| Path | Component | Access |
|---|---|---|
| `/login` | `LoginPage` | Public |
| `/` | `RootRedirect` | Auth (Initial Landing) |
| `/appointments` | `AppointmentsListPage` | Auth (Master List) |
| `/appointments/book` | `BookAppointmentPage` | Auth (Booking Flow) |
| `/appointments/my` | `MyAppointmentsPage` | Auth (DOCTOR View) |
| `/patients` | `PatientListPage` | Auth |
| `/patients/create` | `CreatePatientPage` | Auth |
| `/doctors/schedule` | `DoctorSchedulePage` | Auth |
| `/admin/doctors` | `ManageDoctorsPage` | SUPER_ADMIN |
| `/admin/users` | `ManageUsersPage` | SUPER_ADMIN |

---

## 📡 API Endpoints Consumed

| Method | Endpoint | Feature |
|---|---|---|
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/refresh` | Silent token refresh |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/doctors` | Load doctor list for selector |
| `GET` | `/api/doctors/me` | Doctor fetches own profile (by userId from JWT) |
| `GET` | `/api/doctors/:id` | Get doctor detail |
| `POST` | `/api/doctors` | Create doctor (SUPER_ADMIN) |
| `PATCH` | `/api/doctors/:id` | Update doctor |
| `PATCH` | `/api/doctors/:id/availability` | Update schedule |
| `GET` | `/api/patients` | List patients (search + paginate) |
| `POST` | `/api/patients` | Register new patient |
| `GET` | `/api/patients/:id` | Get patient by id |
| `GET` | `/api/patients/search` | Autocomplete search |
| `POST` | `/api/appointments` | Book appointment |
| `GET` | `/api/appointments` | List appointments (filter doctorId/date/status) |
| `PATCH` | `/api/appointments/:id` | Update purpose/notes |
| `DELETE` | `/api/appointments/:id` | Cancel appointment |
| `PATCH` | `/api/appointments/:id/arrive` | Mark patient arrived |
| `GET` | `/api/slots` | Fetch available time slots |
| `GET` | `/api/users` | List users (SUPER_ADMIN) |
| `POST` | `/api/users` | Create user (SUPER_ADMIN) |
| `PATCH` | `/api/users/:id` | Update user (SUPER_ADMIN) |

---

## 🩺 Appointment Booking Flow

The `BookAppointmentPage` implements a **4-step progressive flow**:

```
Step 1: Patient
  ├── EXISTING → debounced search autocomplete (GET /patients/search?q=)
  └── NEW      → inline mini-form (name + mobile required)

Step 2: Doctor & Date
  ├── Doctor dropdown (GET /doctors?limit=100)
  └── Date picker (min = today)

Step 3: Select Slot
  └── SlotGrid fetches GET /slots?doctorId=&date=
      ├── Available → green border, clickable
      └── Booked    → gray, disabled

Step 4: Confirm
  ├── Purpose / Notes (optional)
  └── POST /appointments with correct patientType payload
```

**POST /appointments payload:**

| `patientType` | Required fields |
|---|---|
| `EXISTING` | `patientId` — the `PAT-XXXX` string (not MongoDB `_id`) |
| `NEW` | `patientData: { name, mobile }` |

---

## 🏥 Doctor View (My Appointments)

`MyAppointmentsPage` is only accessible to users with `role: DOCTOR`.

Flow:
1. Calls `GET /doctors/me` → resolves the doctor's MongoDB `_id`
2. Fetches `GET /appointments?doctorId=<id>&date=<today>&status=<filter>`
3. Filters: date picker + status (BOOKED / ARRIVED) + clear button
4. Paginated table showing: Time · Patient Name · Patient ID · Mobile · Purpose · Status badge

---

## 🧩 Key Design Decisions

- **Feature-based folder structure** — every domain is fully self-contained: `components/`, `pages/`, `services/`, `types/`
- **Pages orchestrate, components render** — no API calls inside UI components; all data flows from pages via props
- **Centralized Axios instance** — `src/lib/api.ts` handles credentials, token refresh, and base URL in one place
- **Zustand** — lightweight global state. Currently used for auth state only; booking flow uses local state
- **No manual Authorization headers** — `withCredentials: true` handles cookies automatically
- **Debounced search** — patient search uses a 350ms debounce to avoid hammering the backend on every keystroke
- **Backend field alignment** — Patient uses `mobile` (not `phone`) and `age: number` (not `dateOfBirth`); Appointment uses `patientId` string for EXISTING patients
