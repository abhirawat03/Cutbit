import { User } from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Not authenticated", "TOKEN_INVALID");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken?._id) {
      throw new ApiError(401, "TOKEN_INVALID");
    }

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      throw new ApiError(401, "User not found", "TOKEN_INVALID");
    }

    if (user.passwordChangedAt && decodedToken.iat) {
      const changedTime = parseInt(user.passwordChangedAt.getTime() / 1000, 10);

      if (decodedToken.iat < changedTime) {
        throw new ApiError(
          401,
          "Password changed, please login again",
          "TOKEN_INVALID",
        );
      }
    }

    req.user = user;
    next();
  } catch (error) {
    // ✅ preserve your own errors
    if (error instanceof ApiError) {
      throw error;
    }

    // ✅ handle jwt expiry
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired", "TOKEN_EXPIRED");
    }
    throw new ApiError(401, "Invalid token", "TOKEN_INVALID");
  }
};
