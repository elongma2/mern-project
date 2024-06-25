import { errorHandle } from "./error.js";
import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
    // Retrieve the token from cookies
    const token = req.cookies.access_token;

    // If no token is found, return an authorization error
    if (!token) return next(errorHandle(401, "You are not authorized"));

    // Verify the token using the secret key, user in this case is the property u sign with
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // If token verification fails, return a forbidden error
        if (err) return next(errorHandle(403, "Forbidden"));
        
        // Log the decoded user information from the token
        console.log(user);
        
        // Attach the decoded user information to the request object
        req.user = user;
        
        // Call the next middleware or route handler
        next();
    });
};
