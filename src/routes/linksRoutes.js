import express from 'express';
import { validateLink } from "./../middlewares/linksValidations.js"
import { shorten, getShortLink, redirect, removeLink } from "./../controllers/linksControllers.js";

const router = express.Router();
router.post("/urls/shorten", validateLink, shorten);
router.get("/urls/:id", getShortLink);
router.get("/urls/open/:shortUrl", redirect);
router.delete("/urls/:id", removeLink);

export default router;