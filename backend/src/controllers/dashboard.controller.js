import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Like } from "../models/like.models.js";
import ApiError from "../utils/ApiError.js";
import ApiRespons from "../utils/ApiRespons.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Function to get channel statistics
const getChannelStatas = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  try {
    // Get channel ID from request parameters or authentication
    const channelId = req.user._id; // Assuming the channel ID is retrieved from the authenticated user

    // Retrieve total video views
    const totalVideoViews = await Video.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
      { $group: { _id: null, views: { $sum: "$views" } } },
    ]);

    // Retrieve total subscribers
    const totalSubscribers = await Subscription.countDocuments({
      channel: channelId,
    });

    // Retrieve total videos
    const totalVideos = await Video.countDocuments({ owner: channelId });

    // Retrieve total likes
    const totalLikes = await Like.countDocuments({
      video: { $in: await Video.find({ owner: channelId }).distinct("_id") },
    });

    // Return the channel stats
    return res.status(200).json(
      new ApiRespons(
        200,
        {
          totalVideoViews: totalVideoViews[0]?.views || 0,
          totalSubscribers,
          totalVideos,
          totalLikes,
        },
        "Channel statistics retrieved successfully"
      )
    );
  } catch (error) {
    console.error("Error retrieving channel stats:", error);
    throw new ApiError(500, "Failed to retrieve channel statistics");
  }
});

// Function to get all videos uploaded by the channel
const getChannelVideo = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  try {
    // Get channel ID from request parameters or authentication
    const channelId = req.user._id; // Assuming the channel ID is retrieved from the authenticated user

    // Retrieve all videos uploaded by the channel
    const videos = await Video.find({ owner: channelId });

    // Return the channel videos
    return res
      .status(200)
      .json(
        new ApiRespons(200, videos, "Channel videos retrieved successfully")
      );
  } catch (error) {
    console.error("Error retrieving channel videos:", error);
    throw new ApiError(500, "Failed to retrieve channel videos");
  }
});

export { getChannelStatas, getChannelVideo };
