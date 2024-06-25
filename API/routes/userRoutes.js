import { test } from '../controller/userController.js';
import { Router } from 'express'
import { updateUser } from '../controller/userController.js';
import { verifyToken } from '../utils/verifyuser.js';
const router=Router();

router.get('/test',test);
router.post('/update/:id',verifyToken,updateUser);//:id allow url params to be dynamic

export default router;