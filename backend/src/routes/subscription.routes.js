import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggoleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/c/:channelId")
  .get(getSubscribedChannels)
  .post(toggoleSubscription);

router.route("/u/:subscriberId").get(getUserChannelSubscribers);

export default router;


// user 1
// {
//   "email": "dfdfr@sddf.com",
//   "password": "dsfsdf3323ww"
// }

// user 2{
// {
//     "email": "usertosubscribe@sddf.com",
//     "password": "dsfsdf3323wwtf"
// }
