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

export const getListings = async (req, res, next) => {
    try {
        // Parse and set default values for pagination and limits
        const limit = parseInt(req.query.limit) || 9; // Number of listings per page, default 9
        const startIndex = parseInt(req.query.startIndex) || 0; // Starting index for pagination, default 0

        // Handle offer filter
        let offer = req.query.offer;
        if (offer === undefined || offer === "false") {
            offer = { $in: [false, true] }; // Include both false and true offers
        }

        // Handle furnished filter
        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === "false") {
            furnished = { $in: [false, true] }; // Include both unfurnished and furnished listings
        }

        // Handle parking filter
        let parking = req.query.parking;
        if (parking === undefined || parking === "false") {
            parking = { $in: [false, true] }; // Include both listings with and without parking
        }

        // Handle type filter
        let type = req.query.type;
        if (type === undefined || type === "all") {
            type = { $in: ['rent', 'sale'] }; // Include both rent and sale listings
        }

        // Search term for listing name, case insensitive
        const searchTerm = req.query.searchTerm || '';

        // Sort and order parameters for listings
        const sort = req.query.sort || 'createdAt'; // Default sort by createdAt field
        const order = req.query.order || 'desc'; // Default to descending order

        // Query listings from database based on filters and pagination
        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' }, // Search by name, case insensitive using 'i
            offer,
            furnished,
            parking,
            type,
        })
        .sort({ [sort]: order }) // Sort by specified field and order [sort] allow it to be dynamic
        .limit(limit) // Limit the number of results
        .skip(startIndex); // Skip to start index for pagination

        // Respond with listings as JSON
        return res.status(200).json(listings);
    } catch (error) {
        // Pass any caught errors to the error handling middleware
        next(error);
    }
};