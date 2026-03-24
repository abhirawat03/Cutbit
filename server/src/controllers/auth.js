import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User } from "../models/user.js";
import { sendEmail } from "../utils/sendEmail.js";
import { resetPasswordTemplate } from "../utils/emailTemplates/resetPassword.js";
import { ApiError } from "../utils/ApiError.js";

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // don't reveal user existence
    return res.json({ message: "If email exists, reset link sent" });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 min

  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html: resetPasswordTemplate(resetUrl)
  });

  return res.json({ message: "Reset link sent" });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8 || password.length > 64) {
    throw new ApiError(400, "Password must be 8–64 characters");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.password = password; // ✅ let schema hash it
  user.passwordChangedAt = Date.now(); // ✅ invalidate old sessions
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
   // invalidate sessions
  user.refreshToken = undefined;

  await user.save();

  return res.json({ message: "Password reset successful. Please login again." });
};

export {
    forgotPassword, 
    resetPassword
}