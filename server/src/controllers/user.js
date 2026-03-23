import { User } from "../models/user.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { Url } from "../models/url.js";
import mongoose from "mongoose";
import { Analytics } from "../models/analytics.js";
import { Visitor } from "../models/visitor.js";
import { clearCacheByPrefix } from "../utils/cache.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    user.refreshToken = hashedRefreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token",
    );
  }
};

const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  if ([fullName, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    email,
  });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser)
    throw new ApiError(500, "Something wen wrong while registering the user");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(201, createdUser, "User Registered Successfully"));
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (password.length < 8 || password.length > 64) {
    throw new ApiError(400, "Password must be between 8 and 64 characters");
  }

  const user = await User.findOne({
    email,
  });

  if (!user) throw new ApiError(404, "User does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
};

const googleAuthCallback = async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Google authentication failed");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .redirect(`${process.env.FRONTEND_URL}/dashboard`);
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
};

const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "TOKEN_INVALID");

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "TOKEN_INVALID");
    }

    // 🔐 Hash incoming token before comparing
    const hashedIncomingToken = crypto
      .createHash("sha256")
      .update(incomingRefreshToken)
      .digest("hex");

    if (hashedIncomingToken !== user?.refreshToken) {
      throw new ApiError(401, "TOKEN_EXPIRED");
    }

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id,
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed",
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
};

const changeCurrentPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "All fields are required");
  }

  if (newPassword.length < 8 || newPassword.length > 64) {
    throw new ApiError(400, "Password must be 8–64 characters");
  }

  if (currentPassword === newPassword) {
    throw new ApiError(400, "New password must be different");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid current password");
  }

  user.password = newPassword;

  user.passwordChangedAt = Date.now();

  await user.save(); 

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
};

const getCurrentUser = async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched Successfully"));
};

const updateAccountDetails = async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true },
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
};

const updateUserAvatar = async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is missing");

  const exisitingUser = await User.findById(req.user?._id);
  if (!exisitingUser) throw new ApiError(404, "User not found");

  //upload new avatar First
  const oldAvatar = exisitingUser?.avatar;
  let avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) throw new ApiError(400, "Error uploading an avatar");
  //update DB
  let user;
  try {
    user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: avatar.secure_url,
        },
      },
      { new: true },
    ).select("-password");
    if (!user) throw new Error("DB update failed");
  } catch (error) {
    if (avatar?.secure_url) {
      const publicId = avatar.secure_url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }
    throw new ApiError(500, "Avatar update failed");
  }

  // 4️⃣ delete old thumbnail (cleanup)
  // only after DB success
  // ==============================
  if (oldAvatar) {
    const publicId = oldAvatar.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId).catch(() => {});
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "avatar updated successfully"));
};

const deleteUserAvatar = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) throw new ApiError(404, "User not found");

  const oldAvatar = user.avatar;

  if (!oldAvatar) {
    throw new ApiError(400, "No avatar to delete");
  }
  // extract publicId from cloudinary url
  const publicId = oldAvatar.split("/").pop().split(".")[0];
  await cloudinary.uploader.destroy(publicId).catch(() => {});

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: null,
      },
    },
    { returnDocument: "after" },
  ).select("-password");

  return res
    .status(204)
    .json(new ApiResponse(204, {}, "Avatar removed successfully"));
};

const deleteUserProfile = async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized");

  // 🔥 Confirmation check (IMPORTANT)
  if (req.body.confirm !== "DELETE") {
    throw new ApiError(400, "Please type DELETE to confirm");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Get user
    const user = await User.findById(userId).session(session);
    if (!user) throw new ApiError(404, "User not found");

    // 2️⃣ Get all user URLs
    const urls = await Url.find({ userId }).select("_id").session(session);
    const urlIds = urls.map((u) => u._id);

    // 3️⃣ Delete related data
    await Promise.all([
      Url.deleteMany({ userId }).session(session),
      Analytics.deleteMany({ urlId: { $in: urlIds } }).session(session),
      Visitor.deleteMany({ urlId: { $in: urlIds } }).session(session),
    ]);

    // 4️⃣ Delete avatar (if exists)
    if (user.avatar) {
      const publicId = user.avatar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    // 5️⃣ Delete user
    await User.findByIdAndDelete(userId).session(session);

    // 6️⃣ Commit
    await session.commitTransaction();
    session.endSession();

    clearCacheByPrefix(`dashboard:${userId}`);
    clearCacheByPrefix(`links:${userId}`);
    clearCacheByPrefix(`stats:${userId}`);
    for (const id of urlIds) {
      clearCacheByPrefix(`analytics:${id.toString()}`);
    }

    // 7️⃣ Clear cookies
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "Account deleted successfully"));
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export {
  generateAccessAndRefreshTokens,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  deleteUserAvatar,
  googleAuthCallback,
  deleteUserProfile,
};
