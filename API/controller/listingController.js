import Listing from "../models/listingModel.js"
import { errorHandle } from "../utils/error.js";
export const createListing= async (req,res,next)=>{
    try {
       const listing=await Listing.create(req.body);
       return res.status(201).json(listing);
    } catch (error) {
        next(error)
    }
}

export const deletelistening= async (req,res,next)=>{
    const listing =await Listing.findById(req.params.id);

    if(!listing){
        return next(errorHandle(404,"listing not found"))
    }

    if(req.user.id !== listing.userRef){
        return next(errorHandle(403,"you can only delete your own listings"))
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(201).json("listing has been deleted successfully");
    } catch (error) {
        next(error)
    }
}


export const updateListing= async (req,res,next)=>{
  const listing = await Listing.findById(req.params.id);
  if(!listing){
    return next(errorHandle(404,"listing not found"))
}

  if(req.user.id !== listing.userRef){
    return next(errorHandle(403,"you can only update your own listings"))
  }

  try {
    const updatedListing =await Listing.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
}

export const getListing= async (req,res,next)=>{
    try {
        
        const listing=await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandle(404,"listing not found"))
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error)
    }
}