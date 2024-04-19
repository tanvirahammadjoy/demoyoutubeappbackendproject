// Importing dependencies
import mongoose, { Schema } from "mongoose";

// Define a new Mongoose schema for playlists
const playlistSchema = new Schema(
  {
    // Name of the playlist
    name: {
      type: String,
      required: true, // Name is required
    },
    // Description of the playlist
    description: {
      type: String,
      required: true, // Description is required
    },
    // Array of video IDs associated with the playlist
    videos: [
      {
        type: Schema.Types.ObjectId, // Each element in the array is of type ObjectId
        ref: "User", // Reference to the 'User' model (assuming it's the correct reference)
      },
    ],
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create a Mongoose model named 'Playlist' using the schema
export const Playlist = mongoose.model("Playlist", playlistSchema);
