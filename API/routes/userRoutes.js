import { test } from '../controller/userController.js';
import { Router } from 'express'

const router=Router();

router.get('/test',test);

export default router;