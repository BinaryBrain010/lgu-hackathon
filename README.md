## AcadFlow Platform

AcadFlow is a full-stack workflow automation portal that streamlines Final Year Project (FYP) management, student evaluations, and multi-stage degree clearance. It was built during a hackathon to demonstrate an end-to-end academic operations platform with rich role-based experiences for administrators, faculty, and students.

### Why It Exists
- Replace fragmented spreadsheets and manual approvals with a unified system
- Give each stakeholder a tailored dashboard with the data they need
- Enforce consistent processes (FYP lifecycle, department clearances, examiner feedback)
- Provide transparency through notifications, analytics, and audit trails

### Key Capabilities
- **FYP lifecycle**: idea submissions, supervisor assignment, staged reviews, plagiarism uploads
- **Evaluation hub**: internal/external examiner workflows and scoring
- **Degree clearance**: parallel department approvals with role-specific actions
- **Notification center**: real-time updates and unread tracking
- **Admin insights**: user management, workload overview, and status analytics

## Tech Stack

| Area      | Stack                                                                 |
|-----------|-----------------------------------------------------------------------|
| Backend   | Node.js 20, Express, TypeScript, Prisma (PostgreSQL), Zod, JWT, Swagger |
| Frontend  | Next.js (App Router), React, TypeScript, Tailwind, Radix UI, Zustand   |
| Tooling   | ESLint, Prettier, pnpm/npm, Prisma Migrate, Docker-ready configuration |

## Repository Layout

```
codes/
├── backend/   # REST API, Prisma schema, migrations, seeds
└── frontend/  # Next.js dashboard + client experiences
docs/          # Problem statement and design references
```

Each app maintains its own README for deep dives. This root document covers the big picture and cross-cutting workflows.

## Getting Started

### 1. Prerequisites
- Node.js 20+
- npm or pnpm
- PostgreSQL 14+ (local instance or cloud)

### 2. Clone & Install
```bash
git clone <repo-url>
cd hackathon
```

Backend:
```bash
cd codes/backend
npm install
cp .env.example .env        # fill in DB_URL, JWT secret, etc.
npx prisma migrate dev
npx prisma db seed          # optional but recommended
npm run dev
```

Frontend (in a new terminal):
```bash
cd codes/frontend
npm install
cp .env.example .env.local  # if needed for API URL overrides
npm run dev
```

Access points:
- API: `http://localhost:3000` (Swagger docs at `/api-docs`)
- Web app: `http://localhost:3001` (or whatever port Next chooses)

Adjust ports in `.env` files if you run both apps simultaneously on the same machine.

## Development Tips
- Synchronize schema changes by running `npx prisma generate` after edits to `schema.prisma`.
- The frontend expects an `API_URL` pointing to the backend base URL; update `.env.local` accordingly.
- Logs and generated assets are ignored globally via the root `.gitignore`.
- Use seeded credentials (see backend README) for quick role-based testing.

## Deployment Notes
- Backend is production-ready with build scripts (`npm run build` / `npm start`) and Prisma migrations.
- Frontend can be exported as a static build (`npm run build && npm run start`) or deployed to platforms like Vercel/Netlify once `NEXT_PUBLIC_API_URL` is configured.
- Consider Dockerizing both services for consistent hackathon demos; compose files can mount the `dist`/`.next` outputs.

## Contributing
1. Create a feature branch.
2. Make your changes with meaningful commits.
3. Ensure linting/tests pass (`npm run lint`, `npm run test` if available).
4. Open a PR describing the feature, screenshots, and test notes.

## License

This project is shared for hackathon/demo purposes. Refer to individual sub-project licenses if you plan to reuse the codebase.


