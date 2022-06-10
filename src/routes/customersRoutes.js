import express from 'express';
import { validateCustomer } from "./../middlewares/customersValidations.js"
import { signup, signin, ranking } from "./../controllers/customersController.js";

const router = express.Router();
router.post("/signup", validateCustomer, signup);
router.post("/signin", validateCustomer, signin);
router.get("/ranking", ranking);

export default router;