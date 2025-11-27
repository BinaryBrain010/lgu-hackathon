import { Router } from 'express';
import authRoutes from './auth.routes';
import fypRoutes from './fyp.routes';
import evaluationRoutes from './evaluation.routes';
import clearanceRoutes from './clearance.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/fyp', fypRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/clearance', clearanceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

export default router;

