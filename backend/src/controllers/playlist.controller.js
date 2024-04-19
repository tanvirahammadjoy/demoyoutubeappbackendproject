import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import ApiError from "../utils/ApiError.js";
import ApiRespons from "../utils/ApiRespons.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Controller function to create a new playlist
const createPlaylist = asyncHandler(async (req, res) => {
  // Extract name and description from the request body
  const { name, description } = req.body;
  // TODO: Implement logic to create a new playlist
  try {
    // Create a new playlist document in the database
    const playlist = await Playlist.create({ name, description });

    // Return a success response with the created playlist
    return res
      .status(201)
      .json(new ApiRespons(201, playlist, "Playlist created successfully"));
  } catch (error) {
    console.error("Error creating playlist:", error);
    // If an error occurs, handle it and return an error response
    throw new ApiError(500, "Failed to create playlist");
  }
});

// Controller function to get playlists of a specific user
const getUserPlaylists = asyncHandler(async (req, res) => {
  // Extract userId from the request parameters
  const { userId } = req.params;
  // TODO: Implement logic to retrieve playlists of the specified user
  try {
    // Find playlists associated with the specified userId
    const playlists = await Playlist.find({ owner: userId });

    // Return the playlists associated with the specified user
    return res
      .status(200)
      .json(
        new ApiRespons(200, playlists, "User playlists retrieved successfully")
      );
  } catch (error) {
    console.error("Error retrieving user playlists:", error);
    // If an error occurs, handle it and return an error response
    throw new ApiError(500, "Failed to retrieve user playlists");
  }
});

// Controller function to get a playlist by its ID
const getPlaylistById = asyncHandler(async (req, res) => {
  // Extract playlistId from the request parameters
  const { playlistId } = req.params;
  // TODO: Implement logic to get a playlist by its ID
  try {
    // Find the playlist with the specified playlistId
    const playlist = await Playlist.findById(playlistId);

    // Check if the playlist exists
    if (!playlist) {
      // If the playlist is not found, return a 404 Not Found response
      throw new ApiError(404, "Playlist not found");
    }

    // Return the playlist
    return res
      .status(200)
      .json(new ApiRespons(200, playlist, "Playlist retrieved successfully"));
  } catch (error) {
    console.error("Error retrieving playlist by ID:", error);
    // If an error occurs, handle it and return an error response
    throw new ApiError(500, "Failed to retrieve playlist by ID");
  }
});

// Controller function to add a video to a playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  // Extract playlistId and videoId from the request parameters
  const { playlistId, videoId } = req.params;
  // TODO: Implement logic to add a video to a playlist
  try {
    // Find the playlist with the specified playlistId
    const playlist = await Playlist.findById(playlistId).populate("videos");

    // Check if the playlist exists
    if (!playlist) {
      // If the playlist is not found, return a 404 Not Found response
      throw new ApiError(404, "Playlist not found");
    }

    // Add the videoId to the playlist's Videos array
    playlist.videos.push(videoId);

    // Save the updated playlist
    await playlist.save();

    // Return a success response
    return res
      .status(200)
      .json(
        new ApiRespons(200, playlist, "Video added to playlist successfully")
      );
  } catch (error) {
    console.error("Error adding video to playlist:", error);
    // If an error occurs, handle it and return an error response
    throw new ApiError(500, "Failed to add video to playlist");
  }
});

// Controller function to remove a video from a playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // Extract playlistId and videoId from the request parameters
  const { playlistId, videoId } = req.params;
  // TODO: Implement logic to remove a video from a playlist
  try {
    // Find the playlist with the specified playlistId
    const playlist = await Playlist.findById(playlistId);

    // Check if the playlist exists
    if (!playlist) {
      // If the playlist is not found, return a 404 Not Found response
      throw new ApiError(404, "Playlist not found");
    }

    // Remove the videoId from the playlist's Videos array
    // playlist.videos = playlist.videos.filter((id) => id !== videoId); // if this is not working we use belwe one
    //To fix this, we can convert both the videoId and the id from the playlist.videos array to strings before comparing them. Here's how you can do it:
    playlist.videos = playlist.videos.filter(
      (id) => id.toString() !== videoId.toString()
    );

    // Save the updated playlist
    await playlist.save();

    // Return a success response
    return res
      .status(200)
      .json(
        new ApiRespons(
          200,
          playlist,
          "Video removed from playlist successfully"
        )
      );
  } catch (error) {
    console.error("Error removing video from playlist:", error);
    // If an error occurs, handle it and return an error response
    throw new ApiError(500, "Failed to remove video from playlist");
  }
});

// Controller function to delete a playlist
const deletePlaylist = asyncHandler(async (req, res) => {
  // Extract playlistId from the request parameters
  const { playlistId } = req.params;
  // TODO: Implement logic to delete a playlist
  try {
    // Find the playlist with the specified playlistId and delete it
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

    // Check if the playlist exists
    if (!deletedPlaylist) {
      // If the playlist is not found, return a 404 Not Found response
      throw new ApiError(404, "Playlist not found");
    }

    // Return a success response
    return res
      .status(200)
      .json(new ApiRespons(200, {}, "Playlist deleted successfully"));
  } catch (error) {
    console.error("Error deleting playlist:", error);
    // If an error occurs, handle it and return an error response
    throw new ApiError(500, "Failed to delete playlist");
  }
});

// Controller function to update a playlist
const updatePlaylist = asyncHandler(async (req, res) => {
  // Extract playlistId, name, and description from the request parameters and body
  const { playlistId } = req.params;
  const { name, description } = req.body;
  // TODO: Implement logic to update a playlist
  try {
    // Find the playlist with the specified playlistId and update its name and description
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      { name, description },
      { new: true }
    );

    // Check if the playlist exists
    if (!updatedPlaylist) {
      // If the playlist is not found, return a 404 Not Found response
      throw new ApiError(404, "Playlist not found");
    }

    // Return a success response
    return res
      .status(200)
      .json(
        new ApiRespons(200, updatedPlaylist, "Playlist updated successfully")
      );
  } catch (error) {
    console.error("Error updating playlist:", error);
    // If an error occurs, handle it and return an error response
    throw new ApiError(500, "Failed to update playlist");
  }
});

// Exporting controller functions
export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
