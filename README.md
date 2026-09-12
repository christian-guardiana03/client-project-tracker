# Client Project Tracker

A simple full-stack CRUD application built for a technical assessment. It lets a project manager at a digital agency track client projects — creating, viewing, updating, and deleting them, with validation and clear error handling throughout.

## Tech Stack

- **Backend:** Laravel 11 (PHP 8.3)
- **Frontend:** React 18 (Vite)
- **Database:** MySQL 8
- **Containerization:** Docker & Docker Compose

## Why this stack

I went with Laravel + React because it's the stack I'm most comfortable building quickly and correctly in, and because it maps cleanly onto the assessment's requirements without needing extra libraries bolted on:

- Laravel's **Form Requests** give me validation, error formatting, and authorization in one place, without writing custom validation logic by hand.
- Laravel's **route-model binding** (`Project $project` right in the controller method) automatically returns a 404 for a bad ID, which the spec asks for ("invalid requests should return meaningful errors") basically for free.
- React with plain **component state** (no Redux/Context) was enough for an app this size — three components and one shared list of projects don't need a state management library. Adding one would've been over-engineering for the scope.

---

## Project Structure

```
client-project-tracker/
├── docker-compose.yml
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Models/Project.php
│   │   ├── Http/Controllers/Api/ProjectController.php
│   │   └── Http/Requests/
│   │       ├── StoreProjectRequest.php
│   │       └── UpdateProjectRequest.php
│   ├── database/migrations/
│   └── routes/api.php
├── frontend/                   # React (Vite)
│   ├── src/
│   │   ├── api/projects.js
│   │   ├── components/
│   │   │   ├── ProjectList.jsx
│   │   │   └── ProjectForm.jsx
│   │   └── App.jsx
└── README.md
```

**Why organized this way:** the backend and frontend are fully separate folders with their own Dockerfiles, so they can be built, deployed, or even swapped independently — that's how this would actually be split up on a real team (a backend dev and a frontend dev could work on this without stepping on each other). Inside the backend, validation lives in Form Request classes rather than inline in the controller, which keeps `ProjectController` focused purely on orchestration (fetch, save, respond) rather than mixing in validation rules. On the frontend, all API calls go through a single `api/projects.js` file rather than being scattered across components — if the API's base URL or shape ever changes, there's exactly one place to update.

---

## Setup Instructions

### Prerequisites
- Docker Desktop installed and running. That's the only requirement — everything else (PHP, Node, MySQL) runs inside the containers.

### Setup

1. Clone/download the project and navigate into it:
   ```bash
   cd client-project-tracker
   ```

2. Copy the environment file for the backend:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Make sure the `DB_*` values in `backend/.env` match the ones in `docker-compose.yml` (host `db`, database, username, password).

3. Build and start everything:
   ```bash
   docker compose up --build
   ```

4. Once containers are up, the app runs migrations automatically. If you need to run them manually:
   ```bash
   docker compose exec backend php artisan migrate
   ```

5. Open the app:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - API: [http://localhost:8000/api/projects](http://localhost:8000/api/projects)

---

## How to Run the App

Once the containers are running:

1. Go to `http://localhost:5173`.
2. Click **+ New Project** to create one — fill in client name, project name, description, status, priority, and dates.
3. Existing projects appear in the table below the form.
4. Click **Edit** on any row to update that project, or **Delete** to remove it.
5. Validation errors (e.g., missing required fields, due date before start date) show up directly under the relevant field.
6. Use the search box to filter by client or project name, and the Status/Priority dropdowns to narrow the list further — all three filters can be combined.

To reset the database to a clean state at any point:
```bash
docker compose exec backend php artisan migrate:fresh
```

To run the automated test suite:
```bash
docker compose exec backend php artisan test
```

---

## Features Implemented

- Full CRUD: create, read (list), update, and delete projects
- REST API matching the spec exactly: `GET /projects`, `GET /projects/:id`, `POST /projects`, `PUT /projects/:id`, `DELETE /projects/:id`
- Server-side validation via Laravel Form Requests:
  - Client Name and Project Name required
  - Status and Priority restricted to valid enum values
  - Due Date cannot be earlier than Start Date
- Validation errors returned as structured JSON and displayed inline on the correct form field on the frontend
- Database-level `enum` constraints on `status` and `priority`, as a second layer of protection beyond app-level validation
- Dockerized setup — backend, frontend, and MySQL each run as separate services, wired together with Docker Compose
- Styled UI using Tailwind CSS, including status/priority badges for quick visual scanning of the project list
- **Search** by client name or project name (partial match, case-insensitive)
- **Filtering** by Status and by Priority, combinable with each other and with search
- **Automated tests** (PHPUnit) covering listing, creation, validation rules (required fields, valid enum values, due-date-after-start-date), updating, deleting, 404 handling, and the new search/filter endpoints

### Bonus items implemented
Search, Filtering, and Unit Tests were added on top of the core requirements.

### Not implemented (bonus items I chose to skip)
Sorting, authentication, and deployment were left out. The spec explicitly marks these as optional bonus items that won't hurt the score if omitted, and I prioritized my remaining time on the items above instead.

---

## Assumptions Made

- A project's `description` field is optional; every other field (client name, project name, status, priority, start date, due date) is required.
- Dates are stored and compared as calendar dates only (no time-of-day component), since the spec only asks for Start Date and Due Date, not scheduling down to the hour.
- "Due Date cannot be earlier than Start Date" allows the two dates to be equal (a same-day project is valid) — I read the requirement as a minimum-bound check rather than requiring a strict gap between the two.
- The `GET /projects/:id` endpoint is implemented per the spec, even though the current UI primarily works off the full list — it's there to support features like a detail view if needed later.

---

## Is this scalable and maintainable?

For the scope of this assessment — yes, comfortably. Some specific reasons:

- **Validation logic is centralized** in Form Requests, so adding a new field or rule later means editing one file, not hunting through the controller.
- **The frontend's API layer is centralized** in `api/projects.js`, so if this API grows (auth headers, pagination, new endpoints), there's one place to extend rather than every component making its own `axios` calls.
- **The Docker services are independent**, meaning the database, backend, or frontend could each be scaled, redeployed, or swapped without touching the others — this mirrors how a real production setup would be structured (e.g., running multiple backend replicas behind a load balancer while keeping one database).

---

## AI Tools Used

I used **Claude** (Anthropic) throughout development — for scaffolding the initial Laravel/React/Docker structure, debugging Docker and database connection issues along the way, and reviewing my code for structure and clarity. All code was reviewed, tested, and understood by me before being included in this submission; I can walk through and explain any part of it.