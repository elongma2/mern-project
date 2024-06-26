import express from 'express'
import { verifyToken } from '../utils/verifyuser.js';
import { createListing } from '../controller/listingController.js';
const router=express();

router.post('/create',verifyToken,createListing);

export default router;