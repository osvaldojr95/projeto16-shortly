import express from 'express';
import customersRoutes from './customersRoutes.js';
import linksRoutes from './linksRoutes.js';

const router = express.Router();
router.use(customersRoutes);
router.use(linksRoutes);
export default router;