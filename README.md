# Smart Physio Clinic Management System

Professional SaaS platform for physiotherapy clinic management.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 + TypeScript + Tailwind CSS |
| Backend | Django REST Framework |
| Database | PostgreSQL (SQLite for dev) |
| Auth | JWT (djangorestframework-simplejwt) |
| Charts | Recharts |
| PDF | ReportLab |
| Notifications | Email (SMTP) + WhatsApp (Twilio) |
| Task Queue | Celery + Redis |
| Containerization | Docker Compose |

## Features

- **Authentication** — JWT-based with 3 roles (Admin, Physiotherapist, Secretary)
- **Dashboard** — KPI cards, revenue charts, patient growth, pathology distribution
- **Patient Management** — Full CRUD, medical records, financial tracking
- **Appointment Scheduling** — Weekly calendar view, conflict detection, status tracking
- **Session Tracking** — Treatment notes, pain levels, progress evaluation
- **Exercise Library** — 16+ exercises across 5 pathology categories, PDF export
- **Invoicing** — Auto-generated invoices and payment receipts (PDF)
- **Notifications** — In-app, email, and WhatsApp reminders
- **Reports** — Daily/weekly/monthly/annual statistics

## Quick Start

### Docker (Recommended)

```bash
cd pcms
docker-compose up --build
```

### Manual Setup

**Backend:**
```bash
cd pcms
python -m venv venv && source venv/bin/activate
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers django-filter Pillow reportlab
USE_SQLITE=True python manage.py migrate
USE_SQLITE=True python manage.py seed_exercises
USE_SQLITE=True python manage.py createsuperuser --email admin@clinic.com --first_name Admin --last_name User
python manage.py runserver
```

**Frontend:**
```bash
cd pcms/frontend
npm install
npm run dev
```

### Default Credentials
- **Admin:** `admin@smartphysio.com` / `admin123456`

## Project Structure

```
pcms/
├── backend/              # Django project settings, urls, wsgi
├── accounts/             # Custom User model (JWT auth)
├── patients/             # Patient management
├── appointments/         # Scheduling with conflict detection
├── treatment_sessions/   # Session tracking
├── exercises/            # Exercise library + programs
├── notifications/        # Notification system
├── reports/              # Invoicing + PDF generation
├── dashboard/            # Analytics dashboard API
├── frontend/             # Next.js app
│   └── src/
│       ├── app/          # Pages (dashboard, patients, appointments, etc.)
│       ├── components/   # Sidebar, Header, UI components
│       ├── services/     # API client services
│       └── store/        # Zustand auth store
├── docker-compose.yml
└── Dockerfile.backend
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/token/` | Login (JWT) |
| `POST /api/auth/register/` | Register |
| `GET /api/patients/` | List patients |
| `POST /api/patients/` | Create patient |
| `GET /api/appointments/` | List appointments |
| `GET /api/appointments/calendar/events/` | Calendar events |
| `GET /api/exercises/` | Exercise library |
| `GET /api/dashboard/overview/` | Dashboard data |
| `GET /api/reports/invoices/{id}/pdf/` | Generate invoice PDF |

## Future AI Integration

The architecture is prepared for:
- AI physiotherapy assistant
- Automatic exercise recommendation
- Patient progress prediction
- Voice assistant
- Medical chatbot
- AI-generated rehabilitation plans
