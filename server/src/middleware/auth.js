import { User } from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "TOKEN_INVALID");
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
      throw new ApiError(401, "TOKEN_INVALID");
    }

    if (user.passwordChangedAt) {
      const changedTime = parseInt(user.passwordChangedAt.getTime() / 1000, 10);

      if (decodedToken.iat < changedTime) {
        throw new ApiError(401, "TOKEN_INVALID");
      }
    }

    req.user = user;
    next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "TOKEN_EXPIRED");
        }
        throw new ApiError(401, "TOKEN_INVALID");
    }
};
