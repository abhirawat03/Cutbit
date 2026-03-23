import { useState } from "react";
import { useForgotPassword } from "../hooks/mutations/useForgotPassword";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const mutation = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email.trim()) {
      setMessage("Email is required");
      return;
    }

    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address")
      return
    }

    mutation.mutate(email, {
      onSuccess: () => setMessage("Reset link sent to your email"),
      onError: (err) =>
        setMessage(err.response?.data?.message || "Error"),
    });
  };

  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-5">

      {/* Title */}
      <div className="text-center sm:text-left space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold">
          Forgot Password
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Enter your email to receive a reset link
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {message && (
          <div className="bg-blue-500/10 border border-blue-500 text-blue-400 p-2 rounded-md text-xs sm:text-sm">
            {message}
          </div>
        )}

        <div className="flex flex-col gap-2 text-xs sm:text-sm text-gray-400">
          <label className="font-semibold">Email</label>

          <input
            type="email"
            value={email}
            disabled={mutation.isPending}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@gmail.com"
            className="outline-none rounded-md p-2.5 text-white border border-[#7d83885e] bg-[#63686c5e] focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className={`p-2.5 rounded-md text-sm sm:text-base font-medium transition ${
            mutation.isPending
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-[#2563EB] hover:bg-blue-700"
          }`}
        >
          {mutation.isPending ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;