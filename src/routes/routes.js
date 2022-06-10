import express from 'express';
import customersRoutes from './customersRoutes.js';

const router = express.Router();
router.use(customersRoutes);
export default router;