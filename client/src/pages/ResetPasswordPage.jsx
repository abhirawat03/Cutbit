import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useResetPassword } from "../hooks/mutations/useResetPassword";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");

  const mutation = useResetPassword();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 8 || password.length > 64) {
      setMsg("Password must be between 8 and 64 characters")
      return
    }

    if (password !== confirmPassword) {
      setMsg("Passwords do not match");
      return;
    }

    mutation.mutate(
      { token, password },
      {
        onSuccess: () => {
          setMsg("Password reset successful");
          setTimeout(() => navigate("/login"), 1500);
        },
        onError: (err) =>
          setMsg(err.response?.data?.message || "Failed"),
      }
    );
  };

  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-5">

      <div className="text-center sm:text-left space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">
          Reset Password
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Enter your new password below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {msg && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded-md text-xs sm:text-sm">
            {msg}
          </div>
        )}

        {/* Password */}
        <div className="flex flex-col gap-2 text-xs sm:text-sm text-gray-400">
          <label className="font-semibold">New Password</label>
          <input
            type="password"
            value={password}
            disabled={mutation.isPending}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="outline-none rounded-md p-2.5 text-white border border-[#7d83885e] bg-[#63686c5e] focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2 text-xs sm:text-sm text-gray-400">
          <label className="font-semibold">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            disabled={mutation.isPending}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="outline-none rounded-md p-2.5 text-white border border-[#7d83885e] bg-[#63686c5e] focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className={`p-2.5 rounded-md text-sm sm:text-base font-medium ${
            mutation.isPending
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-[#2563EB] hover:bg-blue-700"
          }`}
        >
          {mutation.isPending ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;