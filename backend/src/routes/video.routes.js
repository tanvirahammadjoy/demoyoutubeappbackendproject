import { Router } from "express";
import {
  getAllVideos,
  publishAVideo,
  updateVideo,
  getVideoById,
  deleteVideo,
  togglePublishStatus,
} from "../controllers/video.controller.js"; // Import controller functions
import { verifyJWT } from "../middlewares/auth.middleware.js"; // Import JWT verification middleware
import { upload } from "../middlewares/multer.middlware.js"; // Import multer middleware for file uploads

const router = Router(); // Create a router instance

// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// Define routes
router
  .route("/")
  .get(getAllVideos) // GET request to fetch all videos
  .post(
    upload.fields([
      // POST request to publish a new video
      {
        name: "videoFile", // File field name for video file
        maxCount: 1, // Maximum number of files allowed
      },
      {
        name: "thumbnail", // File field name for thumbnail
        maxCount: 1, // Maximum number of files allowed
      },
    ]),
    publishAVideo
  );

router
  .route("/:videoId")
  .get(getVideoById) // GET request to fetch a specific video by ID
  .delete(verifyJWT, deleteVideo) // DELETE request to delete a specific video by ID
  .patch(upload.single("thumbnail"), updateVideo); // PATCH request to update details of a specific video by ID

router.route("/toggle/publish/:videoId").patch(togglePublishStatus); // PATCH request to toggle publish status of a specific video by ID

export default router; // Export the router instance
