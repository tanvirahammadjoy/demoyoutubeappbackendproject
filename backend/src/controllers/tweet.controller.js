// Importing dependencies and modules
import mongoose, { isValidObjectId } from "mongoose"; // Importing mongoose and isValidObjectId from mongoose
import { Tweet } from "../models/tweet.models.js"; // Importing the Tweet model
import ApiError from "../utils/ApiError.js"; // Importing the ApiError utility
import ApiRespons from "../utils/ApiRespons.js"; // Importing the ApiResponse utility
import { asyncHandler } from "../utils/asyncHandler.js"; // Importing the asyncHandler utility

// Controller function to create a new tweet
const creatTweet = asyncHandler(async (req, res) => {
  // TODO: Implement logic to create a new tweet
  // Extract data from the request body
  const { content, ownerId } = req.body;

  try {
    // Validate the data (e.g., ensure content is not empty)
    if (!content) {
      throw new ApiError(400, "Content is required");
    }

    // Create a new tweet document
    const newTweet = await Tweet.create({
      content,
      owner: ownerId, // Assuming ownerId is the ID of the user who posted the tweet
    });

    // Save the new tweet to the database
    const savedTweet = await newTweet.save();

    // Return a success response with the created tweet
    return res
      .status(201)
      .json(new ApiRespons(201, savedTweet, "Tweet created successfully"));
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error creating tweet:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

// Controller function to get tweets of a specific user
const getUserTweets = asyncHandler(async (req, res) => {
  // Todo: Implement logic to get tweets of a specific user
  try {
    // Extract the user ID from the request parameters or from the authenticated user's session
    const userId = req.params.userId; // Assuming userId is extracted from request parameters

    // Validate the user ID
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }

    // Query the database for tweets belonging to the specified user
    const tweets = await Tweet.find({ owner: userId }).populate(
      "owner",
      "username"
    ); // Populate the 'owner' field with the 'username' field from the User model

    // Return a success response with the retrieved tweets
    return res
      .status(200)
      .json(new ApiRespons(200, tweets, "User tweets fetched successfully"));
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching user tweets:", error);
    if (error instanceof ApiError) {
      throw error; // Re-throw ApiError instances to maintain consistent error handling
    } else {
      throw new ApiError(500, "Internal Server Error");
    }
  }
});

// Controller function to update a tweet
const updateTweet = asyncHandler(async (req, res) => {
  // Todo: Implement logic to update a tweet
  // Extract tweet ID from request parameters
  const tweetId = req.params.tweetId;

  // Extract updated data from request body
  const { content } = req.body;

  try {
    // Validate the updated data (e.g., ensure content is not empty)
    if (!content) {
      throw new ApiError(400, "Content is required");
    }

    // Find the tweet by its ID in the database
    let tweet = await Tweet.findById(tweetId);

    // Check if tweet exists
    if (!tweet) {
      throw new ApiError(404, "Tweet not found");
    }

    // Update the tweet with the new data
    tweet.content = content;

    // Save the updated tweet to the database
    const updatedTweet = await tweet.save();

    // Return a success response with the updated tweet
    return res
      .status(200)
      .json(new ApiRespons(200, updatedTweet, "Tweet updated successfully"));
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error updating tweet:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

// Controller function to delete a tweet
const deleteTweet = asyncHandler(async (req, res) => {
  // Todo: Implement logic to delete a tweet
  // Extract the tweet ID from the request parameters
  const { tweetId } = req.params;

  try {
    // Find the tweet document by its ID
    let tweet = await Tweet.findById(tweetId);

    // Check if the tweet exists
    if (!tweet) {
      throw new ApiError(404, "Tweet not found");
    }

    // Optionally, check ownership and permissions here

    // Delete the tweet from the database
    await tweet.deleteOne();

    // Return a success response
    return res
      .status(200)
      .json(new ApiRespons(200, {}, "Tweet deleted successfully"));
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error deleting tweet:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

// Exporting controller functions
export { creatTweet, getUserTweets, updateTweet, deleteTweet };
