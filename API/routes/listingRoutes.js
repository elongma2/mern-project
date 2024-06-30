import express from 'express'
import { verifyToken } from '../utils/verifyuser.js';
import { createListing } from '../controller/listingController.js';
import { deletelistening } from '../controller/listingController.js';
import { updateListing } from '../controller/listingController.js';
import { getListing } from '../controller/listingController.js';
import { getListings } from '../controller/listingController.js';
const router=express();

router.post('/create',verifyToken,createListing);
router.delete('/delete/:id',verifyToken,deletelistening);
router.post('/update/:id',verifyToken,updateListing);
router.get('/get/:id',getListing);
router.get('/get',getListings);
export default router;