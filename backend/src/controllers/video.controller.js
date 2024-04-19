import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/users.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiRespons.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs"; // Import the filesystem module

// Controller function to get all videos
const getAllVideos = asyncHandler(async (req, res) => {
  // Extract query parameters with default values
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  // TODO: Implement logic to fetch all videos based on query, sort, and pagination
  try {
    // Construct the base query
    let baseQuery = {};

    // Add conditions to the base query based on the provided parameters
    if (query) {
      baseQuery.title = { $regex: query, $options: "i" }; // Search by title (case-insensitive)
    }
    if (userId) {
      baseQuery.userId = userId; // Filter by user ID
    }

    // Execute the base query to get the total count of documents (for pagination)
    const totalCount = await Video.countDocuments(baseQuery);

    // Build the complete query with pagination and sorting
    let completeQuery = Video.find(baseQuery)
      .skip((page - 1) * limit) // Skip documents based on the page number
      .limit(limit); // Limit the number of documents per page

    // Apply sorting if sortBy and sortType are provided
    if (sortBy && sortType) {
      completeQuery.sort({ [sortBy]: sortType }); // Sort by the specified field and type
    }

    // Execute the complete query to fetch the videos
    const videos = await completeQuery.exec();

    // Return success response with fetched videos and total count
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { videos, totalCount },
          "Videos fetched successfully"
        )
      );
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching videos:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

// Controller function to publish a new video
const publishAVideo = asyncHandler(async (req, res) => {
  // Extract title and description from the request body
  const { title, description, duration, userId } = req.body;

  // Check if title and description are provided
  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  // TODO: Implement logic to get video, upload it to Cloudinary, and create a video entry
  const videoFile = req.files?.videoFile[0]?.path; // Assuming the video file is uploaded using multer middleware
  const thumbnailFile = req.files?.thumbnail[0]?.path;

  // Check if video file is provided
  if (!videoFile) {
    throw new ApiError(400, "Video file is missing");
  }

  try {
    // Upload the video file to Cloudinary
    const videoCloudinary = await uploadOnCloudinary(videoFile);

    // Check if the video upload to Cloudinary was successful
    if (!videoCloudinary.url) {
      throw new ApiError(500, "Error uploading video to Cloudinary");
    }
    const thumbnailCloudinary = await uploadOnCloudinary(thumbnailFile);

    // Check if the video upload to Cloudinary was successful
    if (!thumbnailCloudinary.url) {
      throw new ApiError(500, "Error uploading thumbnail to Cloudinary");
    }

    // Create a new video entry in the database
    const newVideo = await new Video({
      title,
      description,
      videoFile: videoCloudinary.url, // Set the video URL to the Cloudinary URL
      // Additional fields can be added here, such as user ID if the video is associated with a user
      thumbnail: thumbnailCloudinary.url,
      duration,
      owner: userId, // Set the owner ID to the user's ID
    });

    // Save the new video entry to the database
    await newVideo.save();

    // Update the user's videos array to include the newly created video
    const populatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { watchHistory: newVideo._id } },
      { new: true } // Return the updated user document
    );

    // Check if the update operation was successful
    if (!populatedUser) {
      throw new ApiError(500, "Failed to update user's videos array");
    }

    // Find a user by ID and populate the 'watchHistory' field
    // Find a user by ID and populate the 'watchHistory' field
    await User.findById(userId)
      .populate("watchHistory") // Populate the 'watchHistory' field with actual video data
      .exec() // Call exec without a callback
      .then((user) => {
        console.log("User with populated watchHistory:", user);
        // Access the user with populated watchHistory
      })
      .catch((err) => {
        console.error("Error:", err);
        // Handle error
      });

    // Return success response with the newly created video entry
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { newVideo, user: populatedUser },
          "Video published successfully"
        )
      );
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error publishing video:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

// Controller function to get a video by its ID
const getVideoById = asyncHandler(async (req, res) => {
  // Extract videoId from request parameters
  const { videoId } = req.params;

  // TODO: Implement logic to get a video by its ID
  try {
    // Find the video by its ID in the database
    const video = await Video.findById(videoId);

    // Check if a video with the specified ID exists
    if (!video) {
      // Return error response if video is not found
      throw new ApiError(404, "Video not found");
    }

    // Return success response with the retrieved video
    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video fetched by Id successfully"));
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching video by ID:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

// Controller function to update video details
const updateVideo = asyncHandler(async (req, res) => {
  // Extract videoId from request parameters
  const { videoId } = req.params;

  // TODO: Implement logic to update video details like title, description, and thumbnail
  try {
    // Find the video by its ID in the database
    let video = await Video.findById(videoId);

    // Check if a video with the specified ID exists
    if (!video) {
      // Return error response if video is not found
      throw new ApiError(404, "Video not found");
    }

    // Extract updated video details from the request body
    const { title, description, thumbnail } = req.body;

    // Update video details if provided
    if (title) {
      video.title = title;
    }
    if (description) {
      video.description = description;
    }
    if (thumbnail) {
      video.thumbnail = thumbnail;
    }

    // Save the updated video document to the database
    video = await video.save();

    // Return success response with the updated video data
    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video updated successfully"));
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error updating video:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

// Controller function to delete a video
const deleteVideo = asyncHandler(async (req, res) => {
  // Extract videoId from request parameters
  const { videoId } = req.params;

  // TODO: Implement logic to delete a video
  try {
    // Find the video by its ID in the database
    const video = await Video.findById(videoId);

    // Check if a video with the specified ID exists
    if (!video) {
      // Return error response if video is not found
      throw new ApiError(404, "Video not found");
    }

    // Delete the video from the database
    await video.deleteOne(); // Or use deleteOne() method if needed

    // Return success response indicating that the video has been deleted
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video deleted successfully"));
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error deleting video:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

// Controller function to toggle the publish status of a video
const togglePublishStatus = asyncHandler(async (req, res) => {
  // Extract videoId from request parameters
  const { videoId } = req.params;

  // TODO: Implement logic to toggle the publish status of a video
  try {
    // Find the video by its ID in the database
    let video = await Video.findById(videoId);

    // Check if a video with the specified ID exists
    if (!video) {
      // Return error response if video is not found
      throw new ApiError(404, "Video not found");
    }

    // Toggle the publish status of the video
    video.isPublished = !video.isPublished; // Assuming there's a boolean field 'isPublished'

    // Save the updated video document to the database
    video = await video.save();

    // Return success response with the updated video data
    return res
      .status(200)
      .json(new ApiResponse(200, video, "Publish status toggled successfully"));
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error toggling publish status:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

// Export controller functions
export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
