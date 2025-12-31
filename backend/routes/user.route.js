import express from "express";
import { signupController } from "../controllers/user.controller.js";

const router = express.Router();

router.post('/signup', signupController);
// router.post('/login', loginController);

export default router;