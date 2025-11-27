# Module Migration Guide

All modules are being migrated to a modular structure:

```
src/modules/
├── auth/
│   ├── controller/
│   ├── service/
│   ├── route/
│   └── index.ts
├── fyp/
├── evaluation/
├── clearance/
├── notification/
├── admin/
└── user/
```

Each module exports its routes via index.ts:
- `export { default as authRoutes } from './route/auth.routes';`
- `export { AuthController } from './controller/auth.controller';`
- `export { AuthService } from './service/auth.service';`

All imports should use relative paths:
- From controller: `../../../base/BaseController`
- From service: `../../../config/database`
- From route: `../../controller/auth.controller`

The main routes/index.ts imports from modules:
```ts
import { authRoutes } from '../modules/auth';
```

