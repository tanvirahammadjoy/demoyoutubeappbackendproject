// Importing dependencies
import mongoose, { Schema } from "mongoose";

// Define a new Mongoose schema for subscriptions
const subscriptionSchema = new Schema(
  {
    // Subscriber of the subscription, referencing the 'user' model
    subscriber: {
      type: Schema.Types.ObjectId,   // Field type is ObjectId
      ref: "user"                     // Reference to the 'user' model
    },
    // Channel being subscribed to, referencing the 'user' model
    channel: {
      type: Schema.Types.ObjectId,   // Field type is ObjectId
      ref: "user"                     // Reference to the 'user' model
    },
  },
  {
    timestamps: true,   // Automatically manage createdAt and updatedAt fields
  }
);

// Create a Mongoose model named 'Subscription' using the schema
export const Subscription = mongoose.model("Subscription", subscriptionSchema);
