import mongoose, { Schema, Types } from "mongoose";

// Define a new Mongoose schema for likes
const likeSchema = new Schema(
  {
    // Reference to the liked video
    video: {
      type: Schema.Types.ObjectId, // Data type is ObjectId
      ref: "Video", // References the "Video" model
    },
    // Reference to the liked comment
    comment: {
      type: Schema.Types.ObjectId, // Data type is ObjectId
      ref: "Comment", // References the "Comment" model
    },
    // Reference to the liked tweet
    tweet: {
      type: Schema.Types.ObjectId, // Data type is ObjectId
      ref: "Tweet", // References the "Tweet" model
    },
    // Reference to the user who liked (or "likedBy") the video, comment, or tweet
    likedBy: {
      type: Schema.Types.ObjectId, // Data type is ObjectId
      ref: "User", // References the "User" model
    },
  },
  // Additional options for the schema
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create a Mongoose model named "Like" based on the defined likeSchema
export const Like = mongoose.model("Like", likeSchema);
