// Importing dependencies
import mongoose, { Schema } from "mongoose";

// Define a new Mongoose schema for tweets
const tweetSchema = new Schema(
  {
    // Content of the tweet
    content: {
      type: String,     // Field type is String
      required: true    // Content is required for every tweet
    },
    // Owner of the tweet, referencing the User model
    owner: {
      type: Schema.Types.ObjectId,   // Field type is ObjectId
      ref: "User"                     // Reference to the User model
    },
  },
  // Additional options for the schema
  { timestamps: true }   // Automatically manage createdAt and updatedAt fields
);

// Create a Mongoose model named 'Tweet' using the schema
export const Tweet = mongoose.model("Tweet", tweetSchema);
