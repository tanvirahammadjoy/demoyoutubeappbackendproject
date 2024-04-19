// src/controllers/user.controller.js
import fs from "fs"; // Import the filesystem module
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/users.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinnary } from "cloudinary";
import ApiRespons from "../utils/ApiRespons.js";
import jwt from "jsonwebtoken";
import { mongoose } from "mongoose";
// import { generatAccessTokenRefreshToken } from "../utils/generatAccessTokenRefreshToken.js";

const generatAccessTokenRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generatAccessToken();
    const refreshToken = user.generatRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "somthing went wrong while generating refresh and access token"
    );
  }
};

export { generatAccessTokenRefreshToken };

const registerUser = asyncHandler(async (req, res) => {
  console.log(uploadOnCloudinary);
  // section register user
  // res.status(200).json({
  //   massage: "ok",
  // });
  // get user detailse from frontend username, email, password, fullname
  // validation all fildse is requiarde
  // chacke user existe or note in db befor register
  // chacke for image or avater is requierd and cover Image optionel
  // upload image on local path and unlink end upload to cloudinary
  // create user object - create entry on db or create.(db) set data on db
  // check we will not send to clinte encoded -password and -refresh token in respons
  // check for user creation
  // return res

  const { fullName, username, email, password } = req.body;
  // console.log(email);
  // console.log(req.body);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log(existedUser);

  if (existedUser) {
    throw new ApiError(409, "user name and email is already existed");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // if no coverImage
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files?.coverImage[0]?.path;
  }
  console.log(req.files);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  console.log(avatar);
  console.log(coverImage);

  if (!avatar) {
    throw new ApiError(400, "file failde to upload on cloudinary");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  console.log(user);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log(createdUser);

  if (!createdUser) {
    throw new ApiError(500, "somthing went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiRespons(200, createdUser, "user register successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // section login user
  // req body -> data
  // for login we need username or email
  // and finde the user registared
  // chack passworde corect or not
  // access and referesh token
  // send cookie to clinte
  const { username, fullName, email, password } = req.body;

  if (username && email) {
    throw ApiError(400, "usernam or email is requiared");
  }

  // if (!(username || email)) {
  //   throw ApiError(400, "usernam or email is requiared");
  // }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    throw ApiError(404, "user dose not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "password is not valid");
  }

  const { accessToken, refreshToken } = await generatAccessTokenRefreshToken(
    user._id
  );

  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  console.log(loggedinUser)

  const option = {
    httpOnly: true,
    secure: true,
  };

  console.log(option)

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiRespons(
        200,
        {
          user: loggedinUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // section for logout user

  // refreshToken remove
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
      $set: { tokenExpiration: Date.now() }, // Assuming tokenExpiration field
    },
    {
      new: true,
    }
  );

  // clear cookies
  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiRespons(200, {}, "User logged Out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  console.log(`incomingRefreshToken  /  ${incomingRefreshToken}`);
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    console.log(`decodedToken  /   ${decodedToken}`);

    const user = await User.findById(decodedToken?._id);
    console.log(user);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    console.log(user);

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token expired or invalid");
    }

    const { accessToken, refreshToken } = await generatAccessTokenRefreshToken(
      user?._id
    );

    console.log(
      `accesstoken ${accessToken}   new refreshtoken ${refreshToken}`
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      // Add additional cookie options if needed
    };

    // Set the new access and refresh tokens in cookies
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({
      accessToken,
      refreshToken,
      message: "Access token refreshed",
    });
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  // section for update user
  const { oldpassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldpassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old passworde");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiError(200, {}, "Password change successfully"));
});

const getCorrentUser = asyncHandler(async (req, res) => {
  // controller for get corrent user
  return res
    .status(200)
    .json(new ApiRespons(200, req.user, "User fetched successfully"));
});

const getUserById = asyncHandler(async (req, res) => {
  // Extract user ID from request parameters
  const userId = req.params.userId;

  try {
    // Find the user by ID in the database
    const user = await User.findById(userId).populate("watchHistory");

    // Check if the user exists
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Return the user in the response
    return res.status(200).json({
      statusCode: 200,
      data: user,
      message: "User retrieved successfully",
      success: true
    });
  } catch (error) {
    // Handle any errors that occur during user retrieval
    console.error("Error retrieving user:", error);
    throw new ApiError(500, "Failed to retrieve user");
  }
});

const updatAccountDetails = asyncHandler(async (req, res) => {
  // controller for updat account
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are requred");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiRespons(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  // controller for update user avater
  const avaterLocalPath = req.file?.path;

  if (!avaterLocalPath) {
    throw ApiError(400, "Avatar file is missing");
  }

  // Upload the new avatar to Cloudinary
  const avatar = await uploadOnCloudinary(avaterLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  //TODO: delete old image - assignment
  // Fetch the current user's data
  const currentUser = await User.findById(req.user?._id).select("avatar");

  // Extract the current cover image URL
  const oldAvatarUrl = currentUser.avatar;

  // If the user already has a cover image, delete the old image from Cloudinary
  if (oldAvatarUrl) {
    // Extract the public ID from the old cover image URL (assuming Cloudinary URLs follow the standard format)
    const publicIdAvatar = oldAvatarUrl.split("/").pop().split(".")[0];

    // Delete the old cover image from Cloudinary
    await cloudinnary.uploader.destroy(publicIdAvatar);
  }

  // Update the user document with the new avatar URL
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiRespons(200, user, "Avatar image uplod successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  // controller for udate User Cover Image
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  // Upload the new cover image to Cloudinary
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw ApiError(400, "Error while uploading on coverImage");
  }

  //TODO: delete old image - asingment
  // Fetch the current user's data
  const currentUser = await User.findById(req.user?._id).select("coverImage");

  // Extract the current cover image URL
  const oldCoverImageUrl = currentUser.coverImage;

  // If the user already has a cover image, delete the old image from Cloudinary
  if (oldCoverImageUrl) {
    // Extract the public ID from the old cover image URL (assuming Cloudinary URLs follow the standard format)
    const publicIdCoverImage = oldCoverImageUrl.split("/").pop().split(".")[0];

    // Delete the old cover image from Cloudinary
    await cloudinnary.uploader.destroy(publicIdCoverImage);
  }

  // Update the user document with the new cover image URL
  const user = await User.findByIdAndUpdate(req.user?._id, {
    $set: {
      coverImage: coverImage.url,
    },
  }).select("-password");

  return res
    .status(200)
    .json(new ApiRespons(200, user, "Cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  // get user channel profile
  const { username } = req.params; // Extract the 'username' parameter from the request URL

  if (!username?.trim) {
    // Check if the 'username' parameter is missing or empty
    throw new ApiError(400, "username is missing"); // Throw an error if 'username' is missing
  }

  const channel = await User.aggregate([
    // Perform an aggregation query on the 'User' collection
    {
      $match: {
        username: username?.toLowerCase(), // Match documents where the 'username' field matches the provided value (case insensitive)
      },
    },
    {
      $lookup: {
        from: "subscriptions", // Perform a lookup on the 'subscriptions' collection
        localField: "_id", // Match documents where the '_id' field of the 'User' collection matches...
        foreignField: "channel", // ...the 'channel' field of the 'subscriptions' collection
        as: "subscribers", // Store the matching documents in the 'subscribers' field
      },
    },
    {
      $lookup: {
        from: "subscriptions", // Perform another lookup on the 'subscriptions' collection
        localField: "_id", // Match documents where the '_id' field of the 'User' collection matches...
        foreignField: "subscriber", // ...the 'subscriber' field of the 'subscriptions' collection
        as: "subscribedTo", // Store the matching documents in the 'subscribedTo' field
      },
    },
    {
      $addFields: {
        subscribersCount: {
          // Add a new field 'subscribersCount'
          $size: "$subscribers", // Calculate the size (number of elements) of the 'subscribers' array
        },
        channelsSubscribedToCount: {
          // Add a new field 'channelsSubscribedToCount'
          $size: "$subscribedTo", // Calculate the size (number of elements) of the 'subscribedTo' array
        },
        isSubscribed: {
          // Add a new field 'isSubscribed'
          $cond: {
            // Use conditional logic to determine the value of 'isSubscribed'
            if: { $in: [req.user?._id, "$subscribers.subscriber"] }, // Check if the current user is in the 'subscribers' array
            then: true, // If the user is subscribed, set 'isSubscribed' to true
            else: false, // If not, set 'isSubscribed' to false
          },
        },
      },
    },
    {
      $project: {
        fullName: 1, // Include the 'fullName' field in the output
        username: 1, // Include the 'username' field in the output
        subscribersCount: 1, // Include the 'subscribersCount' field in the output
        channelsSubscribedToCount: 1, // Include the 'channelsSubscribedToCount' field in the output
        isSubscribed: 1, // Include the 'isSubscribed' field in the output
        avatar: 1, // Include the 'avatar' field in the output
        coverImage: 1, // Include the 'coverImage' field in the output
        email: 1, // Include the 'email' field in the output
      },
    },
  ]);

  if (!channel?.length) {
    // Check if no channel is found
    throw new ApiError(404, "channel dose not exists"); // Throw an error if no channel is found
  }

  return res
    .status(200)
    .json(new ApiRespons(200, channel[0], "User channel fetched successfully")); // Return the channel data in the response
});

const getWatchHistory = asyncHandler(async (req, res) => {
  // controller for get watch history
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiRespons(
        200,
        user[0].getWatchHistory,
        "Watch history fetched successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCorrentUser,
  getUserById,
  updatAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
