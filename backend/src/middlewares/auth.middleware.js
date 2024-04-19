import { User } from "../models/users.models.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log(token);

    if (!token) {
      throw new ApiError(401, "Unauthorized request 1");
    }

    // Verify the JWT token and decode its payload
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // console.log(decodedToken);

    // Retrieve the user from the database based on the _id
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    // console.log(user);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // Attach the user object to the request for further processing
    req.user = user;

    // console.log(req.user)

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export { verifyJWT };


// usertosubscribe@sddf.com
// dsfsdf3323wwtf