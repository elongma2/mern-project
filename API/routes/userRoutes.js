import { test } from '../controller/userController.js';
import { Router } from 'express'
import { updateUser,deleteUser } from '../controller/userController.js';
import { verifyToken } from '../utils/verifyuser.js';
import { getUserListings } from '../controller/userController.js';
import { getUser } from '../controller/userController.js';
const router=Router();

router.get('/test',test);
router.post('/update/:id',verifyToken,updateUser);//:id allow url params to be dynamic
router.delete('/delete/:id',verifyToken,deleteUser);
router.get('/listings/:id',verifyToken,getUserListings);
router.get('/:id',verifyToken,getUser)

export default router;