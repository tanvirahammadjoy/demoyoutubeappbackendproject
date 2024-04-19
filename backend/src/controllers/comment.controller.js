import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
// import ApiError from "../utils/ApiError.js";
// import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Handler to get all comments for a video
const getVideoComments = asyncHandler(async (req, res) => {
  // Extracting the videoId from request parameters
  const { videoId } = req.params;
  // Extracting page and limit parameters from query, with default values
  const { page = 1, limit = 10 } = req.query;
  // TODO: Implement logic to retrieve comments for the specified videoId
  try {
    // Finding comments associated with the specified videoId
    const comments = await Comment.find({ Video: videoId })
      .limit(limit) // Limiting the number of comments per page
      .skip((page - 1) * limit) // Skipping comments based on pagination
      .populate("owner", "username") // Populating 'owner' field with 'username'
      .exec();

    // Returning the comments as part of the response
    res.json({
      success: true,
      data: comments,
      page: page,
      limit: limit,
    });
  } catch (error) {
    // Handling errors
    console.error(error);
    // Sending an error response
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

// Handler to add a comment to a video
const addComment = asyncHandler(async (req, res) => {
  // TODO: Implement logic to add a comment to a video
  try {
    // Extracting the videoId from request parameters
    const { videoId } = req.params;
    // Extracting the content of the comment from the request body
    const { content } = req.body;

    // Creating a new comment object
    const newComment = new Comment({
      content: content,
      Video: videoId,
      owner: req.user._id, // Assuming the authenticated user's ID is stored in req.user._id
    });

    // Saving the new comment to the database
    await newComment.save();

    // Returning a success response
    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    // Handling any errors that occur during the process
    console.error(error);
    // Sending an error response
    res.status(500).json({ message: "Internal server error" });
  }
});

// Handler to update a comment
const updateComment = asyncHandler(async (req, res) => {
  // TODO: Implement logic to update a comment
  try {
    // Extracting commentId from request parameters
    const { commentId } = req.params;
    // Extracting updated content from request body
    const { content } = req.body;

    // Finding the comment by its ID
    let comment = await Comment.findById(commentId);

    // If the comment does not exist, return an error
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Update the comment content
    comment.content = content;

    // Save the updated comment
    const updatedComment = await comment.save();

    // Return the updated comment as a response
    res.json(updatedComment);
  } catch (error) {
    // Handling any errors that occur during the process
    console.error(error);
    // Sending an error response
    res.status(500).json({ message: "Internal server error" });
  }
});

// Handler to delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  // TODO: Implement logic to delete a comment
  try {
    // Extracting commentId from request parameters
    const { commentId } = req.params;

    // Finding the comment by its ID and deleting it
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    // If the comment does not exist, return an error
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Return a success message indicating the comment has been deleted
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    // Handling any errors that occur during the process
    console.error(error);
    // Sending an error response
    res.status(500).json({ message: "Internal server error" });
  }
});

// Exporting the handlers
export { getVideoComments, addComment, updateComment, deleteComment };
