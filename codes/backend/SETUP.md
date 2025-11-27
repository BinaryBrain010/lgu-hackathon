# AcadFlow Backend - Quick Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

Required environment variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/acadflow?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3000
NODE_ENV=development
```

### 3. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with mock data
npx prisma db seed
```

### 4. Start Server
```bash
npm run dev
```

## ✅ Verification

1. **Health Check**: http://localhost:3000/health
2. **API Docs**: http://localhost:3000/api-docs
3. **Test Login**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"student1@acadflow.edu","password":"student123"}'
   ```

## 📋 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@acadflow.edu | admin123 |
| Student | student1@acadflow.edu | student123 |
| Supervisor | supervisor1@acadflow.edu | supervisor123 |
| Examiner | examiner1@acadflow.edu | examiner123 |
| HOD | hod@acadflow.edu | hod123 |
| Dean | dean@acadflow.edu | dean123 |
| Student Affairs | affairs@acadflow.edu | affairs123 |
| Accounts | accounts@acadflow.edu | accounts123 |

## 🎯 Key Features Implemented

✅ **Complete OOP Architecture** with Base Classes
✅ **Full FYP Workflow** (12 stages with validation)
✅ **Role-Based Access Control** (8 roles)
✅ **JWT Authentication**
✅ **Multi-Department Clearance System**
✅ **Evaluation System** (Internal/External)
✅ **Notification System** (Auto-generated on events)
✅ **Admin Dashboard** (Analytics & User Management)
✅ **Swagger Documentation**
✅ **Comprehensive Error Handling**
✅ **Request Validation** (Zod)
✅ **Logging** (Winston + Morgan)
✅ **Rate Limiting**
✅ **Database Seeding** (15 FYPs, 10 Students, 5 Supervisors)

## 📁 Project Structure

```
src/
├── base/              # OOP Base Classes
│   ├── BaseController.ts
│   ├── BaseService.ts
│   └── BaseRouter.ts
├── config/            # Configuration
│   ├── database.ts
│   ├── jwt.ts
│   └── env.ts
├── controllers/       # Request Handlers
├── middlewares/       # Auth, Role, Error
├── routes/            # API Routes
├── services/          # Business Logic
├── types/             # TypeScript Types
├── utils/             # Utilities
└── server.ts          # Entry Point

prisma/
├── schema.prisma      # Database Schema
└── seed.ts            # Seed Data
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:seed` - Seed database
- `npm run prisma:studio` - Open Prisma Studio

## 📝 API Endpoints

All endpoints require JWT authentication (except `/api/auth/login`).

See full documentation at: http://localhost:3000/api-docs

## 🎓 Next Steps

1. Configure your PostgreSQL database
2. Update JWT_SECRET in `.env`
3. Run migrations and seed data
4. Start developing your frontend!

## 🐛 Troubleshooting

**Issue**: Prisma Client not found
**Solution**: Run `npx prisma generate`

**Issue**: Database connection error
**Solution**: Check `DATABASE_URL` in `.env`

**Issue**: Port already in use
**Solution**: Change `PORT` in `.env` or kill the process using port 3000

