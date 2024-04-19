import { Router } from "express";
import { getChannelStatas, getChannelVideo } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

// Route to get channel statistics
router.route("/statas").get(getChannelStatas);

// Route to get channel videos
router.route("/videos").get(getChannelVideo);

export default router;
