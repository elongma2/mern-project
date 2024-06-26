import { Router } from "express";
import { signup } from "../controller/authController.js";
import { signin,signout } from "../controller/authController.js";
import { google } from "../controller/authController.js";
const router =Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/google",google);
router.get('/signout',signout);
export default router