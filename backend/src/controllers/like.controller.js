import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js"; // Importing the Like model
import ApiError from "../utils/ApiError.js"; // Importing custom error handler
import ApiRespons from "../utils/ApiRespons.js"; // Importing custom response handler
import { asyncHandler } from "../utils/asyncHandler.js"; // Importing async error handler

// Function to toggle like on a video
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params; // Extracting videoId from request parameters
  // TODO: Implement logic to toggle like on video
  try {
    // Validate if the videoId is a valid ObjectId
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid videoId");
    }

    // Ensure that the user is authenticated
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const userId = req.user.id; // Retrieve the authenticated user's ID from the request

    // Check if the user has already liked the video
    const existingLike = await Like.findOne({
      video: videoId,
      likedBy: userId,
    });

    if (existingLike) {
      // If the user has already liked the video, remove the like
      await Like.deleteOne({ _id: existingLike._id });
      // return new ApiRespons("Success", "Video like removed successfully");  // not working
      return res
        .status(200)
        .json(new ApiRespons(200, Like, "Video like removed successfully"));
    } else {
      // If the user hasn't liked the video, add a new like
      const newLike = new Like({ video: videoId, likedBy: userId });
      await newLike.save();
      //return new ApiRespons("Success", "Video liked successfully"); // not working
      // Return a success response
      return res
        .status(200)
        .json(new ApiRespons(200, newLike, "Video liked successfully"));
    }
  } catch (error) {
    // Handle errors
    if (error instanceof ApiError) {
      throw error; // Re-throw ApiError instances
    } else {
      throw new ApiError(500, "Internal Server Error");
    }
  }
});

// Function to toggle like on a comment
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params; // Extracting commentId from request parameters
  // TODO: Implement logic to toggle like on comment
  try {
    // Validate if the commentId is a valid ObjectId
    if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid commentId");
    }

    // Ensure that the user is authenticated
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const userId = req.user.id; // Retrieve the authenticated user's ID from the request

    // Check if the user has already liked the comment
    const existingLike = await Like.findOne({
      comment: commentId,
      likedBy: userId,
    });

    if (existingLike) {
      // If the user has already liked the comment, remove the like
      await Like.deleteOne({ _id: existingLike._id });
      // return new ApiRespons("Success", "Comment like removed successfully");
      // Return a success response
      return res
        .status(200)
        .json(
          new ApiRespons(200, Like, "Comment like removed successfully")
        );
    } else {
      // If the user hasn't liked the comment, add a new like
      const newLike = new Like({ comment: commentId, likedBy: userId });
      await newLike.save();
      // return new ApiRespons("Success", "Comment liked successfully");
      // Return a success response
      return res
        .status(200)
        .json(new ApiRespons(200, newLike, "Comment liked successfully"));
    }
  } catch (error) {
    // Handle errors
    if (error instanceof ApiError) {
      throw error; // Re-throw ApiError instances
    } else {
      throw new ApiError(500, "Internal Server Error");
    }
  }
});

// Function to toggle like on a tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params; // Extracting tweetId from request parameters
  // TODO: Implement logic to toggle like on tweet
  try {
    // Validate if the tweetId is a valid ObjectId
    if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid tweetId");
    }

    // Ensure that the user is authenticated
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const userId = req.user.id; // Retrieve the authenticated user's ID from the request

    // Check if the user has already liked the tweet
    const existingLike = await Like.findOne({
      tweet: tweetId,
      likedBy: userId,
    });

    if (existingLike) {
      // If the user has already liked the tweet, remove the like
      await Like.deleteOne({ _id: existingLike._id });
      // return new ApiRespons("Success", "Tweet like removed successfully");
      // Return a success response
      return res
        .status(200)
        .json(new ApiRespons(200, Like, "Tweet like removed successfully"));
    } else {
      // If the user hasn't liked the tweet, add a new like
      const newLike = new Like({ tweet: tweetId, likedBy: userId });
      await newLike.save();
      // return new ApiRespons("Success", "Tweet liked successfully");
      // Return a success response
      return res
        .status(200)
        .json(new ApiRespons(200, newLike, "Tweet liked successfully"));
    }
  } catch (error) {
    // Handle errors
    if (error instanceof ApiError) {
      throw error; // Re-throw ApiError instances
    } else {
      throw new ApiError(500, "Internal Server Error");
    }
  }
});

// Function to get all liked videos
const getLikedVideos = asyncHandler(async () => {
  // TODO: Implement logic to get all liked videos
  try {
    // Ensure that the user is authenticated
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const userId = req.user.id; // Retrieve the authenticated user's ID from the request

    // Find all likes where the user has liked a video and populate the video details
    const likedVideos = await Like.find({
      likedBy: userId,
      video: { $exists: true },
    }).populate("video");

    // Extract video details from the liked videos
    const videoDetails = likedVideos.map((like) => like.video);

    return new ApiRespons(
      "Success",
      "Liked videos fetched successfully",
      videoDetails
    );
  } catch (error) {
    // Handle errors
    if (error instanceof ApiError) {
      throw error; // Re-throw ApiError instances
    } else {
      throw new ApiError(500, "Internal Server Error");
    }
  }
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
