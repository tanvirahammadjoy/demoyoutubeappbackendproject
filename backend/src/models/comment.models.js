// Importing mongoose library and the Schema class from it
import mongoose, { Schema } from "mongoose";

// Importing the mongoose-aggregate-paginate-v2 plugin
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Creating a new schema for comments
const commentSchema = new Schema(
  {
    // Defining a field for the content of the comment, it's a required string
    content: {
      type: String,
      required: true, // Corrected typo from 'requiresd' to 'required'
    },
    // Defining a field for the video associated with the comment
    // It's a reference to the 'video' model using its ObjectId
    Video: {
      type: Schema.Types.ObjectId,
      ref: "video", // Reference to the 'video' model
    },
    // Defining a field for the owner of the comment
    // It's a reference to the 'User' model using its ObjectId
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the 'User' model
    },
  },
  {
    // Adding timestamps to automatically manage createdAt and updatedAt fields
    timestamps: true,
  }
);

// Adding the mongoose-aggregate-paginate-v2 plugin to the schema
commentSchema.plugin(mongooseAggregatePaginate);

// Creating a model named "Comment" based on the commentSchema
export const Comment = mongoose.model("Comment", commentSchema);

