// import { User } from "../models/users.models.js";
// import ApiError from "./ApiError.js";

// const generatAccessTokenRefreshToken = async (userId) => {
//   try {
//     const user = await User.findById(userId);
//     const accessToken = user.generatAccessToken();
//     const refreshToken = user.generatRefreshToken();

//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });

//     return { accessToken, refreshToken };
//   } catch (error) {
//     throw new ApiError(
//       500,
//       "somthing went wrong while generating refresh and access token"
//     );
//   }
// };

// export { generatAccessTokenRefreshToken };
