// Importing dependencies and modules
import mongoose, { isValidObjectId } from "mongoose";
// import { User } from "../models/users.models.js"; // Importing the User model
import { Subscription } from "../models/subscription.models.js"; // Importing the Subscription model
import ApiError from "../utils/ApiError.js"; // Importing the ApiError utility
import ApiRespons from "../utils/ApiRespons.js"; // Importing the ApiResponse utility
import { asyncHandler } from "../utils/asyncHandler.js"; // Importing the asyncHandler utility
import { User } from "../models/users.models.js";


// Controller function to toggle a subscription status
const toggoleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: Implement logic to toggle the subscription status
  const userId = req.user._id; // Assuming user ID is available in the request

  try {
    // Check if the user is already subscribed to the channel
    const existingSubscription = await Subscription.findOne({
      channel: channelId,
      subscriber: userId,
    });

    // Toggle the subscription status
    if (existingSubscription) {
      // User is already subscribed, so unsubscribe them
      await existingSubscription.deleteOne();
      return res
        .status(200)
        .json(new ApiRespons(200, {}, "Unsubscribed successfully"));
    } else {
      // User is not subscribed, so subscribe them
      const newSubscription = new Subscription({
        channel: channelId,
        subscriber: userId,
      });
      await newSubscription.save();
      return res
        .status(200)
        .json(new ApiRespons(200, {}, "Subscribed successfully"));
    }
  } catch (error) {
    console.error("Error toggling subscription:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

// Controller function to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: Implement logic to retrieve the subscriber list of the specified channel
  try {
    // Find all subscriptions for the specified channel
    const subscriptions = await Subscription.find({
      channel: channelId,
    }).populate("subscriber", "username"); // Assuming you want to populate only 'username' and 'email' fields of the subscriber

    // Extract subscriber details from each subscription
    const subscribers = subscriptions.map(
      (subscription) => subscription.subscriber
    );

    // Return the list of subscribers
    return res
      .status(200)
      .json(
        new ApiRespons(200, subscribers, "Subscriber list fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching subscriber list:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

// Controller function to return channel list a user has subscribed to
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  // TODO: Implement logic to retrieve the list of channels subscribed by the specified user
  try {
    // Find all subscriptions for the specified user
    const subscriptions = await Subscription.find({
      subscriber: subscriberId,
    }).populate("channel", "email"); // Assuming you want to populate only 'username' and 'email' fields of the channel

    // Extract channel details from each subscription
    const channels = subscriptions.map((subscription) => subscription.channel);

    // Return the list of channels
    return res
      .status(200)
      .json(
        new ApiRespons(
          200,
          channels,
          "Subscribed channels list fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching subscribed channels list:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

// Exporting controller functions
export {
  toggoleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
};
