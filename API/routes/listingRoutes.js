import express from 'express'
import { verifyToken } from '../utils/verifyuser.js';
import { createListing } from '../controller/listingController.js';
import { deletelistening } from '../controller/listingController.js';
const router=express();

router.post('/create',verifyToken,createListing);
router.delete('/delete/:id',verifyToken,deletelistening);
export default router;