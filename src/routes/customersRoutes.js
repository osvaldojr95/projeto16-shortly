import express from 'express';
import { validateCustomer } from "./../middlewares/customersValidations.js"
import { signup, signin, getUser, ranking } from "./../controllers/customersController.js";

const router = express.Router();
router.post("/signup", validateCustomer, signup);
router.post("/signin", validateCustomer, signin);
router.get("/users/:id", getUser);
router.get("/ranking", ranking);

export default router;