import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

// Middleware for handling CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from specified origin
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

// Middleware for parsing JSON request bodies
app.use(express.json({ limit: "16kb" }));
// Middleware for parsing URL-encoded request bodies
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// Middleware for serving static files (assuming there's a "public" directory)
app.use(express.static("public"));
// Middleware for parsing cookies
app.use(cookieParser());

// import routers
import userRoutes from "./routes/users.routes.js";
import videoRouter from "./routes/video.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js"

// Define base URL prefix for routes or diclaretion
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter)

export default app;
