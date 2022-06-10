import express from 'express';
import { validateCustomer } from "./../middlewares/customersValidations.js"
import { signup, signin } from "./../controllers/customersController.js";

const router = express.Router();
router.post("/signup", validateCustomer, signup);
router.post("/signin", validateCustomer, signin);

export default router;