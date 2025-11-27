# AcadFlow Backend API

Production-ready, scalable Node.js backend for FYP & Degree Workflow Automation Portal.

## Tech Stack

- **Runtime**: Node.js v20+
- **Language**: TypeScript (strict mode)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Architecture**: OOP + SOLID Principles + Clean Architecture
- **Authentication**: JWT + RBAC
- **Validation**: Zod
- **Logging**: Winston + Morgan
- **Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js v20 or higher
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your database credentials and JWT secret

5. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

6. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

7. Seed the database:
   ```bash
   npx prisma db seed
   ```

8. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`
API Documentation (Swagger) will be available at `http://localhost:3000/api-docs`

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middlewares/     # Express middlewares
├── models/          # Prisma models
├── routes/          # Route definitions
├── services/        # Business logic
├── utils/           # Utility functions
├── base/            # Base classes (OOP)
├── types/           # TypeScript types & enums
└── server.ts        # Application entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login (returns JWT token)

### FYP Management
- `GET /api/fyp` - List all FYPs (paginated, filtered)
- `GET /api/fyp/my` - Get my FYPs (student or supervisor)
- `GET /api/fyp/:id` - Get FYP by ID
- `POST /api/fyp/idea` - Submit FYP idea (STUDENT only)
- `PUT /api/fyp/:id/supervisor` - Assign supervisor (STUDENT only)
- `POST /api/fyp/:id/documents` - Upload document (PROPOSAL/SRS/FINAL)
- `PUT /api/fyp/:id/stage` - Update FYP stage (SUPERVISOR/ADMIN only)
- `POST /api/fyp/:id/plagiarism` - Upload plagiarism report

### Evaluation
- `GET /api/evaluations` - List all evaluations
- `GET /api/evaluations/my` - Get my evaluations (EXAMINER only)
- `GET /api/evaluations/fyp/:fypId` - Get evaluations for an FYP
- `POST /api/evaluations/submit` - Submit evaluation (EXAMINER only)

### Degree Clearance
- `GET /api/clearance` - List all clearances (ADMIN/HOD/DEAN only)
- `GET /api/clearance/my` - Get my clearance (STUDENT only)
- `GET /api/clearance/:id` - Get clearance by ID
- `POST /api/clearance/initiate` - Initiate degree clearance (STUDENT only)
- `PUT /api/clearance/:id/approve` - Approve department clearance
- `PUT /api/clearance/:id/reject` - Reject department clearance

### Notifications
- `GET /api/notifications` - Get my notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `PUT /api/notifications/:id/read` - Mark notification as read

### Admin
- `GET /api/admin/analytics` - Get system analytics (ADMIN only)
- `GET /api/admin/users` - Get all users (ADMIN only)
- `POST /api/admin/users` - Create user (ADMIN only)

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-Based Access Control (RBAC)
- 8 different user roles with granular permissions

### 📋 FYP Workflow Management
- Complete FYP lifecycle management (12 stages)
- Stage transition validation (prevents skipping stages)
- Document upload system (Proposal, SRS, Final)
- Plagiarism report integration with threshold checking
- Automatic notification on stage changes

### 📊 Evaluation System
- Internal and External evaluation support
- Examiner-based marking system
- Feedback mechanism

### ✅ Degree Clearance Workflow
- Multi-department approval system
- Real-time status tracking
- Department-specific remarks
- Automatic notification system

### 🔔 Notification System
- Real-time notifications for workflow events
- Unread count tracking
- Notification history

### 📈 Admin Dashboard
- System analytics
- User management
- FYP stage distribution
- Clearance status tracking

## Architecture

### OOP Base Classes
- `BaseController` - Standardized CRUD operations
- `BaseService` - Reusable business logic layer
- `BaseRouter` - Route registration abstraction

### Clean Architecture Layers
1. **Routes** - HTTP endpoint definitions
2. **Controllers** - Request/Response handling
3. **Services** - Business logic
4. **Models** - Database entities (Prisma)

### Design Patterns
- **Repository Pattern** - Through Prisma ORM
- **Dependency Injection** - Service injection in controllers
- **Middleware Pattern** - Auth, role, error handling
- **Strategy Pattern** - Stage transition validation

## Environment Variables

See `.env.example` for all required environment variables.

## Database Schema

The system uses PostgreSQL with Prisma ORM. Key models:

- **User** - 8 roles (STUDENT, SUPERVISOR, EXAMINER, HOD, DEAN, STUDENT_AFFAIRS, ACCOUNTS, ADMIN)
- **FYP** - 12 stages from IDEA_PENDING to COMPLETED
- **FYPDocument** - PROPOSAL, SRS, FINAL document types
- **Evaluation** - INTERNAL/EXTERNAL evaluation types
- **DegreeClearance** - Multi-department approval workflow
- **Notification** - Real-time event notifications

## Testing

After seeding, you can test with these credentials:

- **Admin**: admin@acadflow.edu / admin123
- **Student**: student1@acadflow.edu / student123
- **Supervisor**: supervisor1@acadflow.edu / supervisor123
- **Examiner**: examiner1@acadflow.edu / examiner123
- **HOD**: hod@acadflow.edu / hod123
- **Dean**: dean@acadflow.edu / dean123

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Open Prisma Studio (Database GUI)
npm run prisma:studio
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## License

ISC

